import React, { useState } from "react";
import { Form, Input, Button, InputNumber, App } from "antd";
import { useNavigate } from "react-router-dom";
import { createCollege } from "../../../../../api/collegeService";
import { SaveOutlined } from "@ant-design/icons";

function CollegeNewForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await createCollege(values);
      message.success("College created successfully!");
      navigate("/admin/colleges");
    } catch (error) {
      message.error("Failed to create college");
      console.error("Error creating college:", error);
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ ranking: 0 }}
    >
      <Form.Item
        name="name"
        label="College Name"
        rules={[{ required: true, message: "Please enter the college name" }]}
      >
        <Input placeholder="Enter college name" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: "Please enter the college description" },
        ]}
      >
        <Input.TextArea
          placeholder="Enter college description"
          autoSize={{ minRows: 4, maxRows: 8 }}
        />
      </Form.Item>
      <Form.Item
        name="location"
        label="Location"
        rules={[
          { required: true, message: "Please enter the college location" },
        ]}
      >
        <Input placeholder="City, State" />
      </Form.Item>
      <Form.Item
        name="website"
        label="Website"
        rules={[
          { required: true, message: "Please enter the college website" },
          { type: "url", message: "Please enter a valid URL" },
        ]}
      >
        <Input placeholder="https://www.example.edu" />
      </Form.Item>
      <Form.Item
        name="ranking"
        label="Ranking"
        rules={[
          { required: true, message: "Please enter the college ranking" },
        ]}
      >
        <InputNumber
          min={1}
          max={5}
          style={{ width: "100%" }}
          placeholder="Ranking"
        />
      </Form.Item>
      <Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={() => navigate("/admin/colleges")}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Create College
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

export default CollegeNewForm;
