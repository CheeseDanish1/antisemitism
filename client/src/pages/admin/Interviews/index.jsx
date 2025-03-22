import React, { useState } from "react";
import AuthPage from "../AuthPage";
import { Tabs, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import InterviewList from "./InterviewList";
import CreateEditInterview from "./CreateEditInterview";
import "./styles.css";

export default function Interviews() {
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("list");
  const navigate = useNavigate();

  const items = [
    {
      key: "list",
      label: "Interview List",
      children: <InterviewList setActiveKey={setActiveKey} />,
    },
    {
      key: "create",
      label: "Create Interview",
      children: <CreateEditInterview setActiveKey={setActiveKey} />,
    },
  ];

  return (
    <AuthPage>
      <div className="interviews-container">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/")}
            style={{ marginRight: 16 }}
          />
          <h1>Interview Management</h1>
        </div>
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={items}
            type="card"
            className="interview-tabs"
          />
        )}
      </div>
    </AuthPage>
  );
}
