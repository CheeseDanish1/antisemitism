import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Space, Breadcrumb, App, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { getInterviewById } from "../../../api/interviewService";
import AuthPage from "../AuthPage";
import InterviewQuestionsList from "./InterviewQuestionsList";
import "./styles.css";

const { Title } = Typography;

const QuestionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { message } = App.useApp();

  useEffect(() => {
    fetchInterview();
    //eslint-disable-next-line
  }, [id]);

  const fetchInterview = async () => {
    setLoading(true);
    try {
      const response = await getInterviewById(id);
      setInterview(response.data);
    } catch (error) {
      message.error("Failed to fetch interview details");
      console.error("Error fetching interview:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage>
      <div className="interviews-container">
        <Breadcrumb
          items={[
            {
              title: "Interviews",
              href: "/interviews",
            },
            {
              title: interview?.title || "Interview Questions",
            },
          ]}
        />

        <Card loading={loading} className="questions-page-card">
          <div className="page-header">
            <Space>
              <Button
                icon={<LeftOutlined />}
                onClick={() => navigate("/admin/interviews")}
              >
                Back to Interviews
              </Button>
            </Space>

            {interview && (
              <Title level={4}>Questions for: {interview.title}</Title>
            )}
          </div>

          <InterviewQuestionsList interviewId={id} />
        </Card>
      </div>
    </AuthPage>
  );
};

export default QuestionsPage;
