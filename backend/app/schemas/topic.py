from pydantic import BaseModel

class TopicBase(BaseModel):
    name: str
    description: str | None = None
    difficulty: str = "easy"

class TopicCreate(TopicBase):
    pass

class TopicUpdate(TopicBase):
    is_published: bool

class TopicOut(TopicBase):
    id: int
    is_published: bool

    class Config:
        from_attributes = True
