import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import api from "../../api/axios";
import "./user.css";

export default function QuizPlay() {
  const { id } = useParams();
  const topicId = Number(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "exam";
  const isReview = mode === "review";

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =======================
        LOAD QUIZ
  ======================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.post(
          `/quizzes/start?topic_id=${topicId}&mode=${mode}`
        );
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
        alert("Load quiz failed");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [topicId, mode]);

  if (loading) return <div className="user-page">Loading...</div>;
  if (!questions.length)
    return <div className="user-page">No questions</div>;

  const q = questions[current];

  /* =======================
     SELECT ANSWER
  ======================= */
  const selectAnswer = (label) => {
    setChecked(false);

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
        RANKING
  ======================= */
  const rankingOrder =
    answers[q.id] || q.answers.map((a) => a.label);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("from", index);
  };

  const onDrop = (e, index) => {
    const from = Number(e.dataTransfer.getData("from"));
    if (from === index) return;

    const newOrder = [...rankingOrder];
    const moved = newOrder.splice(from, 1)[0];
    newOrder.splice(index, 0, moved);

    setChecked(false);
    setAnswers({ ...answers, [q.id]: newOrder });
  };

  /* =======================
          SUBMIT
  ======================= */
  const submitQuiz = async () => {
    if (isReview) return;

    try {
      const normalized = {};

      questions.forEach((q) => {
        const userAns = answers[q.id];
        if (!userAns) return;
        normalized[q.id] = userAns;
      });

      const payload = {
        topic_id: topicId,
        responses: normalized,
      };

      const res = await api.post("/quizzes/submit", payload);

      navigate("/result", {
        state: {
          questions,
          answers,
          result: res.data,
        },
      });
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Submit quiz failed");
    }
  };

  /* =======================
            UI
  ======================= */
  return (
    <div className="user-page">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2>
            Question {current + 1} / {questions.length}
            {isReview && " (Review)"}
          </h2>
        </div>

        <div className="quiz-question">{q.content}</div>

        {/* ===== ANSWERS ===== */}
        <div className="quiz-answers">
          {/* ===== EXPLANATION (REVIEW ONLY) ===== */}
          {isReview && checked && q.explanation && (
            <div className="quiz-explanation">
              <strong>📘 Giải thích:</strong>
              <p>{q.explanation}</p>
            </div>
          )}

          {/* MULTIPLE / CHECKBOX */}
          {q.type !== "ranking" &&
            q.answers.map((a) => {
              const selected =
                (answers[q.id] || []).includes(a.label);

              return (
                <label
                  key={a.label}
                  className={`answer-option
                    ${checked && a.is_correct && "correct"}
                    ${checked &&
                    !a.is_correct &&
                    selected &&
                    "wrong"}
                  `}
                >
                  <input
                    type={
                      q.type === "checkbox" ? "checkbox" : "radio"
                    }
                    checked={selected}
                    onChange={() => selectAnswer(a.label)}
                  />
                  <span>
                    <strong>{a.label}.</strong> {a.content}
                  </span>
                </label>
              );
            })}

          {/* RANKING */}
          {q.type === "ranking" && (
            <ul className="ranking-list">
              {rankingOrder.map((label, idx) => {
                const ans = q.answers.find(
                  (a) => a.label === label
                );

                return (
                  <li
                    key={label}
                    draggable
                    className={`ranking-item
                      ${checked &&
                      ans?.is_correct &&
                      ans?.rank_order === idx + 1 &&
                      "correct"}
                      ${checked &&
                      ans?.is_correct &&
                      ans?.rank_order !== idx + 1 &&
                      "wrong"}
                    `}
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDrop(e, idx)}
                  >
                    <span className="rank">{idx + 1}</span>
                    {ans?.content}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="quiz-actions">
          <button
            disabled={current === 0}
            onClick={() => {
              setCurrent((c) => c - 1);
              setChecked(false);
            }}
          >
            ← Previous
          </button>

          {isReview && (
            <button
              className="btn-primary"
              onClick={() => setChecked(true)}
            >
              ✅ Check
            </button>
          )}

          {current < questions.length - 1 ? (
            <button
              onClick={() => {
                setCurrent((c) => c + 1);
                setChecked(false);
              }}
            >
              Next →
            </button>
          ) : (
            !isReview && (
              <button
                className="btn-primary"
                onClick={submitQuiz}
              >
                Submit Quiz
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
