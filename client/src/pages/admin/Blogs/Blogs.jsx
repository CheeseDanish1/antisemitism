import React from "react";
import { Button, Typography, App } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthPage from "../AuthPage";
import { getBlogs } from "../../../api/blogService";
import BlogTable from "./components/BlogTable";

function Blogs() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [blogs, setBlogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/")}
          />
          <Typography.Title level={2}>Blog Management</Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/blog/new")}
          >
            New Blog Post
          </Button>
        </div>
        <BlogTable blogs={blogs} loading={loading} />
      </div>
    </AuthPage>
  );
}

export default Blogs;
