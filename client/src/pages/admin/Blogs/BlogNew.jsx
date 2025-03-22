import React from "react";
import { Card } from "antd";
import AuthPage from "../AuthPage";
import { addBlog } from "../../../api/blogService";
import BlogHeader from "./components/BlogHeader";
import BlogForm from "./components/BlogForm";
import { useBlogForm } from "./hooks/useBlogForm";

function BlogNew() {
  const {
    form,
    content,
    setContent,
    loading,
    handleTitleChange,
    handleSubmit,
  } = useBlogForm((values) =>
    addBlog({
      title: values.title,
      slug: values.slug,
      content: values.content,
      author: values.author,
      status: values.status,
    })
  );

  return (
    <AuthPage>
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <BlogHeader title="Create New Blog Post" />
        <Card>
          <BlogForm
            form={form}
            content={content}
            setContent={setContent}
            handleSubmit={handleSubmit}
            loading={loading}
            handleTitleChange={handleTitleChange}
            submitText="Create Blog Post"
          />
        </Card>
      </div>
    </AuthPage>
  );
}

export default BlogNew;
