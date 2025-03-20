import React, { useState, useEffect } from "react";
import { Table, Button, Typography, App, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import AuthPage from "../AuthPage";
import { getBlogs } from "../../../api/blogService";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    fetchBlogs();

    // eslint-disable-next-line
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getBlogs();
      setBlogs(response.data.blogs);
      setLoading(false);
    } catch (error) {
      message.error(
        "Failed to fetch blogs: " +
          (error.response?.data?.message || error.message)
      );
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusColors = {
      published: "green",
      draft: "gold",
    };

    return (
      <Tag color={statusColors[status?.toLowerCase()] || "default"}>
        {status}
      </Tag>
    );
  };

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
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Published", value: "published" },
        { text: "Draft", value: "draft" },
      ],
      onFilter: (value, record) => record.status.toLowerCase() === value,
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  return (
    <AuthPage>
      <div style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <Typography.Title level={2}>Blog Management</Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/blog/new")}
          >
            New Blog Post
          </Button>
        </div>

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
      </div>
    </AuthPage>
  );
}

export default Blogs;
