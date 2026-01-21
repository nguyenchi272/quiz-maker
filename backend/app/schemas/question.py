from pydantic import BaseModel, Field, model_validator
from typing import List, Optional
from app.schemas.answer import AnswerCreate, AnswerOut

class QuestionCreate(BaseModel):
    topic_id: int
    content: str = Field(..., min_length=5)
    type: str = Field(..., pattern="^(multiple|checkbox|ranking)$")
    difficulty: str = "easy"
    explanation: Optional[str] = None

    answers: List[AnswerCreate]

    @model_validator(mode="after")
    def validate_answers(self):
        if len(self.answers) < 2:
            raise ValueError("A question must have at least 2 answers")

        if self.type == "multiple":
            correct = [a for a in self.answers if a.is_correct]
            if len(correct) != 1:
                raise ValueError("Multiple choice must have exactly 1 correct answer")

        if self.type == "checkbox":
            correct = [a for a in self.answers if a.is_correct]
            if len(correct) < 1:
                raise ValueError("Checkbox must have at least 1 correct answer")

        if self.type == "ranking":
            ranks = [a.rank_order for a in self.answers]
            if any(r is None for r in ranks):
                raise ValueError("Ranking answers must have rank_order")
            if len(set(ranks)) != len(ranks):
                raise ValueError("Ranking answers must have unique rank_order")

        return self

class QuestionOut(BaseModel):
    id: int
    topic_id: int
    content: str
    type: str
    difficulty: str
    explanation: Optional[str]
    answers: list[AnswerOut]

    class Config:
        from_attributes = True
