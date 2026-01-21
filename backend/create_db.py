from app.core.database import engine, Base
from app.models import *

Base.metadata.create_all(bind=engine)

print("✅ Database tables created")
