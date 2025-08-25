import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <div style={{ textAlign: "center", marginTop: 80 }}>
            <h2>Bạn không có quyền truy cập trang này.</h2>
            <button
                onClick={() => navigate("/")}
                style={{
                    marginTop: 24,
                    padding: "8px 20px",
                    borderRadius: 8,
                    fontSize: 16,
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Quay về trang Home
            </button>
        </div>);
}

export default Unauthorized;