from pydantic import BaseModel, Field
from typing import Optional

class AnswerCreate(BaseModel):
    content: str = Field(..., min_length=1)
    is_correct: bool = False
    rank_order: Optional[int] = None

class AnswerOut(BaseModel):
    id: int
    label: str
    content: str
    is_correct: bool
    rank_order: Optional[int]

    class Config:
        from_attributes = True
