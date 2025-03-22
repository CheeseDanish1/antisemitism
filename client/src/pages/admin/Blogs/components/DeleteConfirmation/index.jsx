import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function DeleteConfirmation({ onConfirm, loading }) {
  return (
    <Popconfirm
      title="Are you sure you want to delete this blog post?"
      description="This action cannot be undone."
      onConfirm={onConfirm}
      okText="Yes"
      cancelText="No"
    >
      <Button danger icon={<DeleteOutlined />} loading={loading}>
        Delete Post
      </Button>
    </Popconfirm>
  );
}

export default DeleteConfirmation;
