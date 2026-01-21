import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import "./admin.css";

export default function AdminTopicQuestions() {
  const { id } = useParams(); // topic_id
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [topicRes, qRes] = await Promise.all([
      api.get(`/topics/${id}`),
      api.get(`/questions`, { params: { topic_id: id } }),
    ]);

    setTopic(topicRes.data);
    setQuestions(qRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const deleteQuestion = async (qid) => {
    if (!window.confirm("Delete this question?")) return;
    await api.delete(`/questions/${qid}`);
    fetchData();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📝 Questions – {topic.name}</h1>

        <Link
          to={`/admin/import?topic=${topic.id}`}
          className="btn-primary"
        >
          Import Excel
        </Link>
      </div>

      <table className="topic-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Type</th>
            <th>Correct Answer</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>
                <strong>{q.content}</strong>
                <div className="muted">
                  {q.answers.map((a) => (
                    <span
                      key={a.id}
                      className={a.is_correct ? "correct" : ""}
                    >
                      {a.label}. {a.content}{" "}
                    </span>
                  ))}
                </div>
              </td>

              <td>
                <span className="badge blue">{q.type}</span>
              </td>

              <td>
                {q.answers
                  .filter((a) => a.is_correct)
                  .map((a) => a.label)
                  .join(", ")}
              </td>

              <td className="actions">
                <button title="Edit">✏️</button>
                <button
                  title="Delete"
                  onClick={() => deleteQuestion(q.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
