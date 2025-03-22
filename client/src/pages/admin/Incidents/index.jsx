import React, { useState, useEffect } from "react";
import AuthPage from "../AuthPage";
import { Tabs, Button } from "antd";
import IncidentsList from "./IncidentsList";
import IncidentForm from "./IncidentForm";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useIncidentsContext } from "../../../contexts/IncidentsContext";

export default function Incidents() {
  const [activeTab, setActiveTab] = useState("list");
  const navigate = useNavigate();

  const { user } = useAuth();
  const { fetchIncidents, fetchStats } = useIncidentsContext();

  useEffect(() => {
    if (user) {
      fetchIncidents();
      fetchStats();
    }
    // eslint-disable-next-line
  }, [user]);

  const items = [
    {
      key: "list",
      label: "Incidents List",
      children: <IncidentsList />,
    },
    {
      key: "create",
      label: "Report Incident",
      children: <IncidentForm />,
    },
  ];

  return (
    <AuthPage>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/")}
        />
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        items={items}
      />
    </AuthPage>
  );
}
