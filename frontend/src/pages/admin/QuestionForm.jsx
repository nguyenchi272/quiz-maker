import { useEffect, useState } from "react";
import "./admin.css";

const EMPTY_ANSWER = {
  content: "",
  is_correct: false,
  rank_order: null
};

export default function QuestionForm({
  topicId,
  initialData = null,
  onSubmit,
  onCancel
}) {
  const [form, setForm] = useState({
    content: "",
    type: "multiple",
    difficulty: "easy",
    explanation: "",
    answers: [{ ...EMPTY_ANSWER }, { ...EMPTY_ANSWER }]
  });

  const [error, setError] = useState("");

  /* -------------------------
     INIT (EDIT MODE)
  ------------------------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        content: initialData.content,
        type: initialData.type,
        difficulty: initialData.difficulty,
        explanation: initialData.explanation || "",
        answers: initialData.answers.map(a => ({
          content: a.content,
          is_correct: a.is_correct,
          rank_order: a.rank_order
        }))
      });
    }
  }, [initialData]);

  /* -------------------------
     TYPE CHANGE
  ------------------------- */
  const changeType = (type) => {
    setForm({
      ...form,
      type,
      answers: form.answers.map(a => ({
        content: a.content,
        is_correct: false,
        rank_order: type === "ranking" ? 1 : null
      }))
    });
  };

  /* -------------------------
     ANSWER HANDLERS
  ------------------------- */
  const updateAnswer = (index, key, value) => {
    const answers = [...form.answers];
    answers[index][key] = value;
    setForm({ ...form, answers });
  };

  const addAnswer = () => {
    setForm({
      ...form,
      answers: [...form.answers, { ...EMPTY_ANSWER }]
    });
  };

  const removeAnswer = (index) => {
    if (form.answers.length <= 2) return;
    setForm({
      ...form,
      answers: form.answers.filter((_, i) => i !== index)
    });
  };

  const setCorrectRadio = (index) => {
    setForm({
      ...form,
      answers: form.answers.map((a, i) => ({
        ...a,
        is_correct: i === index
      }))
    });
  };

  /* -------------------------
     VALIDATION
  ------------------------- */
  const validate = () => {
    if (form.answers.length < 2) {
      return "Phải có ít nhất 2 đáp án";
    }

    if (form.type === "multiple") {
      const correct = form.answers.filter(a => a.is_correct);
      if (correct.length !== 1)
        return "Multiple choice phải có đúng 1 đáp án đúng";
    }

    if (form.type === "checkbox") {
      const correct = form.answers.filter(a => a.is_correct);
      if (correct.length < 1)
        return "Checkbox phải có ít nhất 1 đáp án đúng";
    }

    if (form.type === "ranking") {
      const ranks = form.answers.map(a => a.rank_order);
      if (ranks.some(r => !r))
        return "Ranking: thứ tự không được để trống";
      if (new Set(ranks).size !== ranks.length)
        return "Ranking: thứ tự không được trùng";
    }

    return null;
  };

  /* -------------------------
     SUBMIT
  ------------------------- */
  const submit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    const payload = {
      topic_id: topicId,
      content: form.content,
      type: form.type,
      difficulty: form.difficulty,
      explanation: form.explanation,
      answers: form.answers.map(a => ({
        content: a.content,
        is_correct: form.type === "ranking" ? false : a.is_correct,
        rank_order: form.type === "ranking" ? a.rank_order : null
      }))
    };

    await onSubmit(payload);
  };

  /* -------------------------
     UI
  ------------------------- */
  return (
    <div className="modal-backdrop">
      <div className="modal large">
        <h2>{initialData ? "Edit Question" : "New Question"}</h2>

        {error && <div className="error-box">{error}</div>}

        <input
          placeholder="Question content"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
        />

        <select
          value={form.type}
          onChange={e => changeType(e.target.value)}
        >
          <option value="multiple">Multiple choice</option>
          <option value="checkbox">Checkbox</option>
          <option value="ranking">Ranking</option>
        </select>

        <textarea
          placeholder="Explanation (optional)"
          rows={3}
          value={form.explanation}
          onChange={e =>
            setForm({ ...form, explanation: e.target.value })
          }
        />

        <h4>Answers</h4>

        {form.answers.map((a, idx) => (
          <div key={idx} className="answer-row">
            {form.type === "multiple" && (
              <input
                type="radio"
                checked={a.is_correct}
                onChange={() => setCorrectRadio(idx)}
              />
            )}

            {form.type === "checkbox" && (
              <input
                type="checkbox"
                checked={a.is_correct}
                onChange={e =>
                  updateAnswer(idx, "is_correct", e.target.checked)
                }
              />
            )}

            {form.type === "ranking" && (
              <input
                type="number"
                min={1}
                placeholder="Rank"
                value={a.rank_order ?? ""}
                onChange={e =>
                  updateAnswer(idx, "rank_order", Number(e.target.value))
                }
                className="rank-input"
              />
            )}

            <input
              placeholder={`Answer ${idx + 1}`}
              value={a.content}
              onChange={e =>
                updateAnswer(idx, "content", e.target.value)
              }
            />

            <button
              className="icon-btn"
              onClick={() => removeAnswer(idx)}
            >
              ❌
            </button>
          </div>
        ))}

        <button className="btn-secondary" onClick={addAnswer}>
          + Add answer
        </button>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
