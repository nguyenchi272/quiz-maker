import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    api.get(`/topics/${id}`).then((res) => setTopic(res.data));
  }, [id]);

  if (!topic) return null;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-2">{topic.name}</h1>
      <p className="text-gray-600 mb-4">{topic.description}</p>

      <ul className="text-sm space-y-2">
        <li>📘 Số câu: {topic.question_count}</li>
        <li>⏱ Thời gian: {topic.time_limit} phút</li>
        <li>🎯 Độ khó: {topic.difficulty}</li>
      </ul>

      <button
        onClick={() => navigate(`/quiz/${topic.id}`)}
        className="mt-6 w-full bg-green-600 text-white py-3 rounded text-lg"
      >
        Bắt đầu làm bài
      </button>
    </div>
  );
}
