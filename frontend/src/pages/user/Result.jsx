import { useLocation, Link } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();

  if (!state) return null;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Kết quả</h1>

      <p className="mb-2">🎯 Số câu đã trả lời: {Object.keys(state.answers).length}</p>

      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
