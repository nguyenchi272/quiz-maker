import { useEffect, useState } from "react";
import { getAdminQuizHistory } from "../../api/quizzes.api";
import "./admin.css";

export default function AdminDashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAdminQuizHistory();
    setHistory(res.data);
  };

  return (
    <>
      <h1>Quiz History</h1>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Topic</th>
              <th>Score</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.attempt_id}>
                <td>{h.user_email}</td>
                <td>{h.topic_name}</td>
                <td>
                  {h.score} / {h.max_score}
                </td>
                <td>
                  {new Date(h.created_at + "Z").toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
