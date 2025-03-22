import React from "react";
import AuthPage from "../AuthPage";
import CollegesHeader from "./components/CollegesList/CollegeHeader";
import CollegesTable from "./components/CollegesList/CollegeTable";
import useColleges from "./hooks/useColleges";

function CollegesPage() {
  const { colleges, loading } = useColleges();

  return (
    <AuthPage>
      <CollegesHeader />
      <CollegesTable colleges={colleges} loading={loading} />
    </AuthPage>
  );
}

export default CollegesPage;
