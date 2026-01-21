import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import "./user.css";

export default function TopicList() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    api.get("/topics").then(res => setTopics(res.data));
  }, []);

  return (
    <>
      <h1 className="topic-title">Topics</h1>

      <div className="topic-grid">
        {topics.map(t => (
          <div key={t.id} className="topic-card">
            <h3>{t.name}</h3>
            <p className="topic-desc">{t.description}</p>

            <div className="topic-footer">
              <span className="topic-level">{t.difficulty}</span>
              <Link to={`/topic/${t.id}`}>
                <button className="btn-start">Start</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
