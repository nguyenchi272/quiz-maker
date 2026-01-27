import { useLocation, useNavigate } from "react-router-dom";
import "./user.css";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>Không có dữ liệu</p>;

  const { questions, answers, result } = state;
  const { total_score, max_score, details } = result;

  // map question_id -> result
  const resultMap = {};
  details.forEach(r => {
    resultMap[r.question_id] = r;
  });

  return (
    <div className="result-box">
      <h2>Kết quả</h2>

      <div className="result-score">
        {total_score} / {max_score}
      </div>

      <p>
        {total_score === max_score
          ? "🎉 Hoàn hảo!"
          : "💪 Cố gắng hơn nhé!"}
      </p>

      <button
        className="btn-primary"
        onClick={() => navigate("/topics")}
      >
        Quay lại Topics
      </button>

      <hr style={{ margin: "24px 0" }} />

      {questions.map((q, idx) => {
        const r = resultMap[q.id];
        const userAns = answers[q.id] || [];

        return (
          <div key={q.id} style={{ marginBottom: 20 }}>
            <strong>
              {idx + 1}. {q.content}
            </strong>

            <ul style={{ fontSize: 14, marginTop: 8 }}>
              {q.answers.map((a) => {
                const chosen = userAns.includes(a.label);
                const isCorrectAnswer =
                  r?.correct_answers?.includes(a.label) ?? false;

                let color = "#374151";
                if (isCorrectAnswer) color = "#16a34a";
                else if (chosen) color = "#dc2626";

                return (
                  <li
                    key={a.label}
                    style={{
                      color,
                      fontWeight:
                        isCorrectAnswer || chosen ? 600 : 400,
                    }}
                  >
                    <strong>{a.label}.</strong> {a.content}
                  </li>
                );
              })}
            </ul>

            <div style={{ fontWeight: 600 }}>
              {r?.correct ? "✅ Đúng" : "❌ Sai"} —{" "}
              {r?.score} / {r?.max_score}
            </div>
          </div>
        );
      })}
    </div>
  );
}
