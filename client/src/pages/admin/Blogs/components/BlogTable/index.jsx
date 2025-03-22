import React from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import StatusTag from "./StatusTag";

function BlogTable({ blogs, loading }) {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, post) => <Link to={`/admin/blog/${post.id}`}>{text}</Link>,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusTag status={status} />,
      filters: [
        { text: "Published", value: "published" },
        { text: "Draft", value: "draft" },
      ],
      onFilter: (value, record) => record.status.toLowerCase() === value,
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => {
        return new Date(date).toLocaleDateString();
      },
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={blogs}
      rowKey="_id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
      }}
    />
  );
}

export default BlogTable;
