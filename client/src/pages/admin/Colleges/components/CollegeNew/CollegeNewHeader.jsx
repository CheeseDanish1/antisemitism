import React from "react";
import { Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function CollegeNewHeader() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/colleges")}
        style={{ marginRight: 16 }}
      />
      <Typography.Title level={2}>Add New College</Typography.Title>
    </div>
  );
}

export default CollegeNewHeader;
