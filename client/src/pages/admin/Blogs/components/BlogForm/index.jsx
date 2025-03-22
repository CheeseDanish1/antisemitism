import React from "react";
import { Form, Input, Select, Divider, Button, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import QuillEditor from "./QuillEditor";
import { useNavigate } from "react-router-dom";

function BlogForm({
  form,
  content,
  setContent,
  handleSubmit,
  loading,
  handleTitleChange,
  initialValues = { status: "draft" },
  submitText = "Save Changes",
}) {
  const navigate = useNavigate();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Please enter the blog title" }]}
      >
        <Input placeholder="Enter blog title" onChange={handleTitleChange} />
      </Form.Item>

      <Form.Item
        name="slug"
        label="Slug"
        rules={[{ required: true, message: "Please enter the blog slug" }]}
      >
        <Input placeholder="enter-blog-slug" />
      </Form.Item>

      {!initialValues.status && (
        <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please enter the author name" }]}
        >
          <Input placeholder="Author name" />
        </Form.Item>
      )}

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select the blog status" }]}
      >
        <Select>
          <Select.Option value="draft">Draft</Select.Option>
          <Select.Option value="published">Published</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Content"
        rules={[{ required: true, message: "Please enter the blog content" }]}
      >
        <QuillEditor content={content} setContent={setContent} />
      </Form.Item>

      <Divider />

      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="default" onClick={() => navigate("/admin/blogs")}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
          >
            {submitText}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default BlogForm;
