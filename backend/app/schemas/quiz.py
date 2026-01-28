from pydantic import BaseModel
from typing import List, Dict

class QuizAnswerOut(BaseModel):
    label: str
    content: str
    is_correct: bool | None = None

class QuizQuestionOut(BaseModel):
    id: int
    content: str
    type: str
    explanation: str | None = None
    answers: List[QuizAnswerOut]

class QuizStartResponse(BaseModel):
    topic_id: int
    questions: List[QuizQuestionOut]

class QuizSubmitRequest(BaseModel):
    topic_id: int
    responses: Dict[int, List[str]]  # question_id -> labels

class QuestionResult(BaseModel):
    question_id: int
    score: float
    max_score: float
    correct: bool
    correct_answers: List[str]

class QuizSubmitResponse(BaseModel):
    total_score: float
    max_score: float
    details: List[QuestionResult]
