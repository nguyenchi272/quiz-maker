from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)

    label = Column(String, nullable=False)
    content = Column(String, nullable=False)

    is_correct = Column(Boolean, default=False)
    rank_order = Column(Integer, nullable=True)

    question = relationship("Question", back_populates="answers")
