import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
      {status === "loading" && <p>⏳ Đang xác thực email...</p>}
      {status === "success" && (
        <>
          <h3>✅ Xác thực thành công</h3>
          <p>Đang chuyển tới trang đăng nhập...</p>
        </>
      )}
      {status === "error" && (
        <>
          <h3>❌ Xác thực thất bại</h3>
          <p>Link không hợp lệ hoặc đã hết hạn</p>
        </>
      )}
    </div>
  );
}
