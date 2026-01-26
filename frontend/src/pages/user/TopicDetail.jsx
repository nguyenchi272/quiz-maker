import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./user.css";

export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const t = await api.get(`/topics/${id}`);
        const q = await api.get(`/questions?topic_id=${id}`);

        setTopic(t.data);
        setQuestions(q.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="user-page">Loading...</div>;
  if (!topic) return <div className="user-page">Topic not found</div>;

  return (
    <div className="user-page">
      <button className="back-btn" onClick={() => navigate("/topics")}>
        ← Back to Topics
      </button>

      <div className="topic-detail-card">
        <h1>{topic.name}</h1>
        <p className="topic-desc">{topic.description}</p>

        <div className="topic-meta">
          <span>🎯 Difficulty: {topic.difficulty}</span>
          <span>📝 Questions: {questions.length}</span>
        </div>

        <h3 className="section-title">Questions Preview</h3>

        <ul className="question-preview">
          {questions.map((q, idx) => (
            <li key={q.id}>
              {idx + 1}. {q.content}
            </li>
          ))}
        </ul>

        <button
          className="start-btn"
          onClick={() => navigate(`/quiz/${topic.id}`)}
        >
          ▶ Start Quiz
        </button>

        <button
          className="review-btn"
          onClick={() => navigate(`/quiz/${topic.id}?mode=review`)}
        >
          📘 Review
        </button>
      </div>
    </div>
  );
}
