from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.topic import Topic
from app.schemas.topic import TopicCreate, TopicOut, TopicUpdate
from app.api.deps import require_admin, get_db

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=TopicOut)
def create_topic(data: TopicCreate, db: Session = Depends(get_db)):
    topic = Topic(**data.dict())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic

@router.get("/", response_model=list[TopicOut])
def list_topics(db: Session = Depends(get_db)):
    return db.query(Topic).all()

# -------------------------------
# GET /api/topics/{id}
# -------------------------------
@router.get("/{topic_id}", response_model=TopicOut)
def get_topic(
    topic_id: int,
    db: Session = Depends(get_db)
):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

# -------------------------------
# PUT /api/topics/{id}
# -------------------------------
@router.put("/{topic_id}", response_model=TopicOut)
def update_topic(
    topic_id: int,
    data: TopicUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_admin)
):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    topic.name = data.name
    topic.description = data.description
    topic.difficulty = data.difficulty
    topic.is_published = data.is_published

    db.commit()
    db.refresh(topic)

    return topic

# -------------------------------
@router.delete("/{topic_id}")
def delete_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_admin)
):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    db.delete(topic)
    db.commit()

    return {"message": "Deleted"}

