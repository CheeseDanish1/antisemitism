import React from "react";
import { Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function BlogHeader({ title, children }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginRight: "16px" }}
        onClick={() => navigate("/admin/blogs")}
      >
        Back to Blogs
      </Button>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
      {children && <div style={{ marginLeft: "auto" }}>{children}</div>}
    </div>
  );
}

export default BlogHeader;
