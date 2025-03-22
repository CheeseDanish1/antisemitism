import React from "react";
import { Skeleton, Card, Divider } from "antd";
import { useParams } from "react-router-dom";
import AuthPage from "../AuthPage";
import CollegeDetailsHeader from "./components/CollegeDetails/CollegeDetailsHeader";
import CollegeDetailsForm from "./components/CollegeDetails/CollegeDetailsForm";
import useCollege from "./hooks/useCollege";

function CollegeDetailsPage() {
  const { id } = useParams();
  const { college, loading, saving, updateCollege, form } = useCollege(id);

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  return (
    <AuthPage>
      <CollegeDetailsHeader college={college} form={form} saving={saving} />
      <Divider />
      <CollegeDetailsForm
        form={form}
        college={college}
        onUpdate={updateCollege}
      />
    </AuthPage>
  );
}

export default CollegeDetailsPage;
