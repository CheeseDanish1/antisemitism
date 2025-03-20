import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  App,
  Select,
  Divider,
  Card,
  Skeleton,
  Popconfirm,
  Space,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import AuthPage from "../AuthPage";
import {
  getBlogDetails,
  updateBlog,
  deleteBlog,
} from "../../../api/blogService";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function BlogDetails() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    fetchBlogDetails();

    // eslint-disable-next-line
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const response = await getBlogDetails({ id });
      const blog = response.data.blog;

      form.setFieldsValue({
        title: blog.title,
        slug: blog.slug,
        status: blog.status,
      });

      setContent(blog.content);
      setLoading(false);
    } catch (error) {
      message.error(
        "Failed to fetch blog details: " +
          (error.response?.data?.message || error.message)
      );
      navigate("/admin/blogs");

      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setSaving(true);
      await updateBlog({
        id,
        title: values.title,
        slug: values.slug,
        content: content,
        status: values.status,
      });
      message.success("Blog post updated successfully!");
    } catch (error) {
      message.error(
        "Failed to update blog post: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteBlog({ id });
      message.success("Blog post deleted successfully!");
      navigate("/admin/blogs");
    } catch (error) {
      message.error(
        "Failed to delete blog post: " +
          (error.response?.data?.message || error.message)
      );
      setDeleting(false);
    }
  };

  const generateSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    form.setFieldsValue({ slug });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <AuthPage>
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
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
            Edit Blog Post
          </Typography.Title>
          <div style={{ marginLeft: "auto" }}>
            <Popconfirm
              title="Are you sure you want to delete this blog post?"
              description="This action cannot be undone."
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} loading={deleting}>
                Delete Post
              </Button>
            </Popconfirm>
          </div>
        </div>

        <Card>
          {loading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : (
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: "Please enter the blog title" },
                ]}
              >
                <Input
                  placeholder="Enter blog title"
                  onChange={handleTitleChange}
                />
              </Form.Item>

              <Form.Item
                name="slug"
                label="Slug"
                rules={[
                  { required: true, message: "Please enter the blog slug" },
                ]}
              >
                <Input placeholder="enter-blog-slug" />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[
                  { required: true, message: "Please select the blog status" },
                ]}
              >
                <Select>
                  <Select.Option value="draft">Draft</Select.Option>
                  <Select.Option value="published">Published</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Content"
                rules={[
                  { required: true, message: "Please enter the blog content" },
                ]}
              >
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  style={{ height: "300px", marginBottom: "50px" }}
                />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="default"
                    onClick={() => navigate("/admin/blogs")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </AuthPage>
  );
}

export default BlogDetails;
