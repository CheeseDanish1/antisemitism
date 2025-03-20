import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  App,
  Select,
  Divider,
  Card,
} from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthPage from "../AuthPage";
import { addBlog } from "../../../api/blogService";
import ReactQuill from "react-quill-new";

function BlogNew() {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

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

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await addBlog({
        title: values.title,
        slug: values.slug,
        content: content,
        author: values.author,
        status: values.status,
      });
      message.success("Blog post created successfully!");
      navigate("/admin/blogs");
    } catch (error) {
      message.error(
        "Failed to create blog post: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setSubmitting(false);
    }
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
            Create New Blog Post
          </Typography.Title>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: "draft",
            }}
          >
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
              name="author"
              label="Author"
              rules={[
                { required: true, message: "Please enter the author name" },
              ]}
            >
              <Input placeholder="Author name" />
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
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="default"
                  style={{ marginRight: "10px" }}
                  onClick={() => navigate("/admin/blogs")}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={submitting}
                >
                  Create Blog Post
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AuthPage>
  );
}

export default BlogNew;
