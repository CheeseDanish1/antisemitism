import React, { useState, useEffect } from "react";
import { Card, Skeleton, App, Form } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import AuthPage from "../AuthPage";
import {
  getBlogDetails,
  updateBlog,
  deleteBlog,
} from "../../../api/blogService";
import BlogHeader from "./components/BlogHeader";
import BlogForm from "./components/BlogForm";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { generateSlug } from "./components/BlogForm/slugGenerator";

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

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    form.setFieldsValue({ slug });
  };

  return (
    <AuthPage>
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <BlogHeader title="Edit Blog Post">
          <DeleteConfirmation onConfirm={handleDelete} loading={deleting} />
        </BlogHeader>

        <Card>
          {loading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : (
            <BlogForm
              form={form}
              content={content}
              setContent={setContent}
              handleSubmit={handleUpdate}
              loading={saving}
              handleTitleChange={handleTitleChange}
            />
          )}
        </Card>
      </div>
    </AuthPage>
  );
}

export default BlogDetails;
