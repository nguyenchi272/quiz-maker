import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./user.css";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { topicId } = useParams();

  if (!state) return <p>Không có dữ liệu</p>;

  const { questions, answers } = state;

  let totalScore = 0;
  let maxScore = questions.length;

  const isCorrect = (q, selected) => {
    if (!selected || selected.length === 0) return false;

    // ---------- MULTIPLE / CHECKBOX ----------
    if (q.type === "multiple" || q.type === "checkbox") {
      const correctLabels = q.answers
        .filter(a => a.is_correct)
        .map(a => a.label);

      if (selected.length !== correctLabels.length) return false;
      return correctLabels.every(label => selected.includes(label));
    }

    // ---------- RANKING ----------
    if (q.type === "ranking") {
      const correctOrder = q.answers
        .slice()
        .sort((a, b) => a.rank_order - b.rank_order)
        .map(a => a.id);

      if (selected.length !== correctOrder.length) return false;

      return selected.every((id, idx) => id === correctOrder[idx]);
    }

    return false;
  };


  questions.forEach((q) => {
    if (isCorrect(q, answers[q.id])) totalScore++;
  });

  return (
    <div className="result-box">
      <h2>Kết quả</h2>

      <div className="result-score">
        {totalScore} / {maxScore}
      </div>

      <p>
        {totalScore === maxScore
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
        const correct = isCorrect(q, answers[q.id]);

        return (
          <div key={q.id} style={{ marginBottom: 20 }}>
            <strong>
              {idx + 1}. {q.content}
            </strong>

            <ul style={{ fontSize: 14, marginTop: 8 }}>
              {q.answers.map((a, i) => {
                const chosen =
                  (answers[q.id] || []).includes(i);

                return (
                  <li
                    key={i}
                    style={{
                      color: a.is_correct
                        ? "#16a34a"          // xanh
                        : chosen
                        ? "#dc2626"          // đỏ
                        : "#374151",
                      fontWeight: a.is_correct || chosen ? 600 : 400,
                    }}
                  >
                    {a.content}
                  </li>

                );
              })}
            </ul>

            <div style={{ fontWeight: 600 }}>
              {correct ? "✅ Đúng" : "❌ Sai"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
