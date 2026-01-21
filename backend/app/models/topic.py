from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    description = Column(String)
    difficulty = Column(String)
    is_published = Column(Boolean, default=True)
