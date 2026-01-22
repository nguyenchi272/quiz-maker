from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_STARTTLS=settings.MAIL_TLS,
    MAIL_SSL_TLS=settings.MAIL_SSL,
    USE_CREDENTIALS=True
)

async def send_verification_email(email: str, token: str):
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    message = MessageSchema(
        subject="Verify your email",
        recipients=[email],
        body=f"""
        <h3>Welcome!</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="{verify_url}">Verify Email</a>
        """,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)

