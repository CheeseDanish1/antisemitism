import React from "react";
import { Form, Input, InputNumber } from "antd";

function CollegeDetailsForm({ form, college, onUpdate }) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onUpdate}
      initialValues={college}
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
          {
            required: true,
            message: "Please enter the college description",
          },
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
          max={1000}
          style={{ width: "100%" }}
          placeholder="National ranking (1-1000)"
        />
      </Form.Item>
    </Form>
  );
}

export default CollegeDetailsForm;
