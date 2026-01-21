import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./user.css";

export default function QuizPlay() {
  const { id } = useParams();
  const topicId = Number(id);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/questions?topic_id=${topicId}`);
      setQuestions(res.data);
      setLoading(false);
    };
    load();
  }, [topicId]);

  if (loading) return <div className="user-page">Loading...</div>;
  if (!questions.length) return <div className="user-page">No questions</div>;

  const q = questions[current];

  /* =======================
     MULTIPLE / CHECKBOX
  ======================= */
  const selectAnswer = (label) => {
    setAnswers((prev) => {
      const cur = prev[q.id] || [];

      if (q.type === "multiple") {
        return { ...prev, [q.id]: [label] };
      }

      if (q.type === "checkbox") {
        return {
          ...prev,
          [q.id]: cur.includes(label)
            ? cur.filter((l) => l !== label)
            : [...cur, label],
        };
      }

      return prev;
    });
  };

  /* =======================
        RANKING (DRAG)
  ======================= */
  const rankingOrder =
    answers[q.id] || q.answers.map((a) => a.id);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("from", index);
  };

  const onDrop = (e, index) => {
    const from = Number(e.dataTransfer.getData("from"));
    if (from === index) return;

    const newOrder = [...rankingOrder];
    const moved = newOrder.splice(from, 1)[0];
    newOrder.splice(index, 0, moved);

    setAnswers({
      ...answers,
      [q.id]: newOrder,
    });
  };

  /* =======================
          SUBMIT
  ======================= */
  const submitQuiz = () => {
    navigate("/result", {
      state: {
        questions,
        answers,
      },
    });
  };

  return (
    <div className="user-page">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2>
            Question {current + 1} / {questions.length}
          </h2>
        </div>

        <div className="quiz-question">{q.content}</div>

        {/* ========== ANSWERS ========== */}
        <div className="quiz-answers">
          {/* ----- MULTIPLE / CHECKBOX ----- */}
          {q.type !== "ranking" &&
            q.answers.map((a) => (
              <label key={a.id} className="answer-option">
                <input
                  type={q.type === "checkbox" ? "checkbox" : "radio"}
                  checked={(answers[q.id] || []).includes(a.label)}
                  onChange={() => selectAnswer(a.label)}
                />
                <span>
                  <strong>{a.label}.</strong> {a.content}
                </span>
              </label>
            ))}

          {/* ----- RANKING ----- */}
          {q.type === "ranking" && (
            <ul className="ranking-list">
              {rankingOrder.map((aid, idx) => {
                const answer = q.answers.find(
                  (a) => a.id === aid
                );

                return (
                  <li
                    key={aid}
                    draggable
                    className="ranking-item"
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDrop(e, idx)}
                  >
                    <span className="rank">{idx + 1}</span>
                    {answer.content}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ========== ACTIONS ========== */}
        <div className="quiz-actions">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            ← Previous
          </button>

          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent((c) => c + 1)}>
              Next →
            </button>
          ) : (
            <button className="btn-primary" onClick={submitQuiz}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
