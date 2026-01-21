import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    api.get(`/quiz/${id}`).then((res) => setQuestions(res.data));
  }, [id]);

  if (!questions.length) return null;

  const q = questions[current];

  const selectAnswer = (label) => {
    setAnswers({ ...answers, [q.id]: label });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-4 text-sm text-gray-500">
        Câu {current + 1} / {questions.length}
      </div>

      {/* Question */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">{q.content}</h2>

        <div className="space-y-3">
          {q.answers.map((a) => (
            <label
              key={a.label}
              className={`block border rounded p-3 cursor-pointer ${
                answers[q.id] === a.label
                  ? "border-blue-600 bg-blue-50"
                  : ""
              }`}
            >
              <input
                type="radio"
                className="mr-2"
                checked={answers[q.id] === a.label}
                onChange={() => selectAnswer(a.label)}
              />
              {a.label}. {a.content}
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            ← Trước
          </button>

          {current === questions.length - 1 ? (
            <button
              onClick={() =>
                navigate("/result", { state: { answers } })
              }
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Nộp bài
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Tiếp →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
