import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Spin } from "antd";
import { Navigate } from "react-router-dom";

function AuthPage({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );

  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "70%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default AuthPage;
