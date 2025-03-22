import React from "react";
import { Typography, Button } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function CollegesHeader() {
  const navigate = useNavigate();

  return (
    <div
      className="colleges-container"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/")}
      />
      <Typography.Title level={2}>Colleges Directory</Typography.Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate("/admin/college/new")}
      >
        Add College
      </Button>
    </div>
  );
}

export default CollegesHeader;
