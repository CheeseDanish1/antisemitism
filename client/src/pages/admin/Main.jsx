import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import AuthPage from "./AuthPage";

export default function Main() {
  const { signout } = useAuth();

  const navigationItems = [
    { path: "./petition", label: "Petition" },
    { path: "./blogs", label: "Blogs" },
    { path: "./colleges", label: "Colleges" },
    { path: "./resources", label: "Resources" },
    { path: "./incidents", label: "Incidents" },
    { path: "./interviews", label: "Interviews" },
  ];

  return (
    <AuthPage>
      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "24px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Dashboard
        </h1>

        <nav style={{ marginBottom: "32px" }}>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: "16px",
            }}
          >
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px 16px",
                    backgroundColor: "#f0f9ff",
                    color: "#1e40af",
                    fontWeight: "500",
                    borderRadius: "8px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#e0f2fe")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#f0f9ff")
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={signout}
            style={{
              padding: "8px 24px",
              backgroundColor: "#e5e7eb",
              color: "#1f2937",
              fontWeight: "500",
              borderRadius: "8px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#d1d5db")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
          >
            Logout
          </button>
        </div>
      </div>
    </AuthPage>
  );
}
