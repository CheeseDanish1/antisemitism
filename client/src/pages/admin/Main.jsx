import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import AuthPage from "./AuthPage";

export default function Main() {
  const { signout } = useAuth();

  return (
    <AuthPage>
      <Link to="./petition">Petition</Link>
      <br />
      <Link to="./blogs">Blogs</Link>
      <br />
      <button onClick={signout}>Logout</button>
    </AuthPage>
  );
}
