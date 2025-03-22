import { useState } from "react";
import { Form, App } from "antd";
import { useNavigate } from "react-router-dom";
import { generateSlug } from "../components/BlogForm/slugGenerator";

export const useBlogForm = (submitFn) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    form.setFieldsValue({ slug });
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await submitFn({ ...values, content });
      message.success("Operation completed successfully!");
      navigate("/admin/blogs");
    } catch (error) {
      message.error(
        "Operation failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    content,
    setContent,
    loading,
    handleTitleChange,
    handleSubmit,
  };
};
