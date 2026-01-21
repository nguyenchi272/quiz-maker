export default function AuthLayout({ children }) {
  return (
    <div style={wrapper}>
      <div style={card}>
        {children}
      </div>
    </div>
  );
}

const wrapper = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const card = {
  width: 380,
  background: "#fff",
  padding: 32,
  borderRadius: 12,
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
};
