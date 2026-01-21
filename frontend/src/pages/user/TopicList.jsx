import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function TopicList() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    api.get("/topics").then((res) => setTopics(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Danh sách chủ đề</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topics.map((t) => (
          <div
            key={t.id}
            className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{t.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{t.description}</p>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm">🎯 {t.difficulty}</span>

              <Link
                to={`/topic/${t.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Làm bài
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
