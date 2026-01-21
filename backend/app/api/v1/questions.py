from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
import os

from app.core.database import SessionLocal
from app.models.question import Question
from app.models.answer import Answer
from app.schemas.question import QuestionCreate, QuestionOut
from app.models.topic import Topic
from app.api.deps import require_admin, get_db

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------
# POST /api/questions
# -------------------------------
@router.post("/", response_model=QuestionOut)
def create_question(data: QuestionCreate, db: Session = Depends(get_db)):
    # 1. Create question
    question = Question(
        topic_id=data.topic_id,
        content=data.content,
        type=data.type,
        difficulty=data.difficulty,
        explanation=data.explanation
    )
    db.add(question)
    db.flush()  # get question.id

    # 2. Create answers with auto label A, B, C...
    for idx, ans in enumerate(data.answers):
        answer = Answer(
            question_id=question.id,
            label=chr(65 + idx),  # A, B, C...
            content=ans.content,
            is_correct=ans.is_correct,
            rank_order=ans.rank_order
        )
        db.add(answer)

    db.commit()
    db.refresh(question)

    return question


# -------------------------------
# GET /api/questions
# -------------------------------
@router.get("/", response_model=list[QuestionOut])
def list_questions(
    topic_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Question)
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)
    return query.all()
# -------------------------------
@router.post("/import-excel")
def import_questions_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(require_admin)
):
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Only .xlsx file supported")

    # 1. Topic = filename
    topic_name = os.path.splitext(file.filename)[0]

    topic = db.query(Topic).filter(Topic.name == topic_name).first()
    if not topic:
        topic = Topic(
            name=topic_name,
            description=f"Imported from {file.filename}",
            difficulty="medium",
            is_published=True
        )
        db.add(topic)
        db.commit()
        db.refresh(topic)

    # 2. Read Excel
    try:
        df = pd.read_excel(file.file)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Excel file")

    required_cols = {"question", "type", "correct"}

    if not required_cols.issubset(df.columns):
        raise HTTPException(
            status_code=400,
            detail=f"Excel must contain columns: {required_cols}"
        )

    imported = 0

    for index, row in df.iterrows():
        q_type = str(row["type"]).strip().lower()
        if q_type not in ["multiple", "checkbox", "ranking"]:
            continue

        # 3. Create Question
        question = Question(
            topic_id=topic.id,
            content=str(row["question"]).strip(),
            type=q_type,
            difficulty="easy"
        )
        db.add(question)
        db.flush()  # get question.id

        # Collect answers dynamically (A → E)
        answers_map = {}

        for idx, label in enumerate(["A", "B", "C", "D", "E"]):
            col = f"answer_{label.lower()}"
            if col in df.columns:
                val = row[col]
                if pd.notna(val) and str(val).strip() != "":
                    answers_map[label] = str(val).strip()

        # Must have at least 2 answers
        if len(answers_map) < 2:
            db.rollback()
            continue

        correct_raw = str(row["correct"]).strip().upper()
        correct_list = [c.strip() for c in correct_raw.split(",")]

        # Validate correct labels
        if any(c not in answers_map for c in correct_list):
            db.rollback()
            continue

        # 4. Create Answers
        for label, content in answers_map.items():
            answer = Answer(
                question_id=question.id,
                label=label,
                content=content,
                is_correct=False,
                rank_order=None
            )

            if q_type == "multiple":
                answer.is_correct = (label == correct_list[0])

            elif q_type == "checkbox":
                answer.is_correct = (label in correct_list)

            elif q_type == "ranking":
                if label in correct_list:
                    answer.rank_order = correct_list.index(label) + 1

            db.add(answer)

        imported += 1

    db.commit()

    return {
        "message": "Import success",
        "topic": topic.name,
        "questions_imported": imported
    }

@router.put("/{question_id}", response_model=QuestionOut)
def update_question(
    question_id: int,
    data: QuestionCreate,
    db: Session = Depends(get_db),
    user=Depends(require_admin)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Update question
    question.content = data.content
    question.type = data.type
    question.difficulty = data.difficulty
    question.explanation = data.explanation

    # Delete old answers
    db.query(Answer).filter(Answer.question_id == question.id).delete()

    # Re-create answers
    for idx, ans in enumerate(data.answers):
        answer = Answer(
            question_id=question.id,
            label=chr(65 + idx),
            content=ans.content,
            is_correct=ans.is_correct,
            rank_order=ans.rank_order
        )
        db.add(answer)

    db.commit()
    db.refresh(question)
    return question

# -------------------------------
@router.delete("/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_admin)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db.query(Answer).filter(Answer.question_id == question.id).delete()
    db.delete(question)
    db.commit()

    return {"message": "Deleted successfully"}

