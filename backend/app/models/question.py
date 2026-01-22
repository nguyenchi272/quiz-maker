from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)

    content = Column(Text, nullable=False)
    type = Column(String, nullable=False) 
    explanation = Column(Text, nullable=True)
    difficulty = Column(String, default="easy")

    topic = relationship("Topic", back_populates="questions")

    answers = relationship(
        "Answer",
        back_populates="question",
        cascade="all, delete-orphan"
    )
