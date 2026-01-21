from fastapi import APIRouter
from app.api.v1 import auth, topics, questions, quizzes   

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(topics.router, prefix="/topics", tags=["Topics"])
api_router.include_router(questions.router, prefix="/questions", tags=["Questions"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["Quizzes"])