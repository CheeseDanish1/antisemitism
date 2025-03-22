import React from "react";
import AuthPage from "../AuthPage";
import CollegeNewHeader from "./components/CollegeNew/CollegeNewHeader";
import CollegeNewForm from "./components/CollegeNew/CollegeNewForm";

function CollegeNewPage() {
  return (
    <AuthPage style={{ maxWidth: 800, margin: "0 auto" }}>
      <CollegeNewHeader />
      <CollegeNewForm />
    </AuthPage>
  );
}

export default CollegeNewPage;
