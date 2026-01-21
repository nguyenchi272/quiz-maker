import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.question import Question
from app.models.quiz_attempt import QuizAttempt
from app.models.quiz_answer import QuizAnswer
from app.models.topic import Topic

from app.schemas.quiz import (
    QuizStartResponse,
    QuizQuestionOut,
    QuizAnswerOut,
    QuizSubmitRequest,
    QuizSubmitResponse,
    QuestionResult
)

from app.services.quiz_scoring import score_question
from app.api.deps import get_current_user, require_admin
from app.models.user import User

router = APIRouter()

# -------------------------------
# DB dependency
# -------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------
# POST /api/quizzes/start
# -------------------------------
@router.post("/start", response_model=QuizStartResponse)
def start_quiz(topic_id: int, db: Session = Depends(get_db)):
    questions = (
        db.query(Question)
        .filter(Question.topic_id == topic_id)
        .all()
    )

    if not questions:
        raise HTTPException(status_code=404, detail="No questions for this topic")

    quiz_questions: list[QuizQuestionOut] = []

    for q in questions:
        answers = [
            QuizAnswerOut(label=a.label, content=a.content)
            for a in q.answers
        ]

        # shuffle answers
        random.shuffle(answers)

        quiz_questions.append(
            QuizQuestionOut(
                id=q.id,
                content=q.content,
                type=q.type,
                answers=answers
            )
        )

    # shuffle questions
    random.shuffle(quiz_questions)

    return QuizStartResponse(
        topic_id=topic_id,
        questions=quiz_questions
    )

# -------------------------------
# POST /api/quizzes/submit
# -------------------------------
@router.post("/submit", response_model=QuizSubmitResponse)
def submit_quiz(data: QuizSubmitRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    questions = (
        db.query(Question)
        .filter(Question.topic_id == data.topic_id)
        .all()
    )

    if not questions:
        raise HTTPException(status_code=404, detail="No questions for this topic")

    question_map = {q.id: q for q in questions}

    total_score = 0.0
    max_score = 0.0
    details: list[QuestionResult] = []

    # 1️⃣ Tính tổng điểm tối đa của toàn bộ đề
    for q in questions:
        _, q_max = score_question(q, [])
        max_score += q_max

    # 2️⃣ Chấm các câu user đã trả lời
    for qid, user_answers in data.responses.items():
        question = question_map.get(qid)
        if not question:
            continue

        score, q_max = score_question(question, user_answers)
        total_score += score

        details.append(
            QuestionResult(
                question_id=qid,
                score=score,
                max_score=q_max,
                correct=score == q_max
            )
        )

    # 3️⃣ Lưu quiz attempt
    attempt = QuizAttempt(
        topic_id=data.topic_id,
        user_id=user.id,
        total_score=round(total_score, 2),
        max_score=round(max_score, 2)
    )
    db.add(attempt)
    db.flush()  # lấy attempt.id

    # 4️⃣ Lưu từng câu trả lời
    for detail in details:
        user_ans = ",".join(
            data.responses.get(detail.question_id, [])
        )

        db.add(
            QuizAnswer(
                attempt_id=attempt.id,
                question_id=detail.question_id,
                user_answer=user_ans,
                score=detail.score,
                max_score=detail.max_score
            )
        )

    db.commit()

    return QuizSubmitResponse(
        total_score=round(total_score, 2),
        max_score=round(max_score, 2),
        details=details
    )

# -------------------------------
# GET /api/quizzes/history
# -------------------------------
@router.get("/history")
def quiz_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user.id)
        .order_by(QuizAttempt.created_at.desc())
        .all()
    )

    return [
        {
            "attempt_id": a.id,
            "topic_id": a.topic_id,
            "score": a.total_score,
            "max_score": a.max_score,
            "created_at": a.created_at
        }
        for a in attempts
    ]

@router.get("/admin/history")
def admin_history(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    rows = (
        db.query(
            QuizAttempt,
            User.email,
            Topic.name.label("topic_name")
        )
        .join(User, User.id == QuizAttempt.user_id)
        .join(Topic, Topic.id == QuizAttempt.topic_id)
        .order_by(QuizAttempt.created_at.desc())
        .all()
    )

    return [
        {
            "attempt_id": attempt.id,
            "user_email": email,
            "topic_name": topic_name,
            "score": attempt.total_score,
            "max_score": attempt.max_score,
            "created_at": attempt.created_at,
        }
        for attempt, email, topic_name in rows
    ]

