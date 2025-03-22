import React from "react";
import { Typography, Button, Space } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function CollegeDetailsHeader({ college, form, saving }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <Space>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/colleges")}
        />
        <Typography.Title level={2} style={{ margin: 0 }}>
          {college?.name}
        </Typography.Title>
      </Space>

      <Space>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={form.submit}
          loading={saving}
        >
          Save Changes
        </Button>
      </Space>
    </div>
  );
}

export default CollegeDetailsHeader;
