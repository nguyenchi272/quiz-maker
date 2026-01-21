export default function Card({ children }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-5">
      {children}
    </div>
  );
}
