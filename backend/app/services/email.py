import smtplib
from email.mime.text import MIMEText
from app.core.config import settings

def send_verify_email(to_email: str, token: str):
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    body = f"""
    Chào bạn,

    Vui lòng xác thực email bằng link sau:
    {verify_url}

    Link có hiệu lực 24 giờ.
    """

    msg = MIMEText(body)
    msg["Subject"] = "Verify your email"
    msg["From"] = settings.MAIL_FROM
    msg["To"] = to_email

    with smtplib.SMTP(settings.MAIL_HOST, settings.MAIL_PORT) as server:
        server.starttls()
        server.login(settings.MAIL_USER, settings.MAIL_PASSWORD)
        server.send_message(msg)
