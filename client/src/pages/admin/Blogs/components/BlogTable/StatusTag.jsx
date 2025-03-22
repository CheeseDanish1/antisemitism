import React from "react";
import { Tag } from "antd";

function StatusTag({ status }) {
  const statusColors = {
    published: "green",
    draft: "gold",
  };

  return (
    <Tag color={statusColors[status?.toLowerCase()] || "default"}>{status}</Tag>
  );
}
export default StatusTag;
