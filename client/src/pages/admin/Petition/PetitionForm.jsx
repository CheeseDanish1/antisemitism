import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { getColleges } from "../../../api/collegeService";

const { Option } = Select;
const { TextArea } = Input;

function PetitionForm({ visible, onCancel, onSubmit }) {
  const [colleges, setColleges] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    try {
      getColleges().then((res) => {
        setColleges(res.data.colleges || []);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Signature"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="signer_name"
          label="Name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="high_school_name"
          label="High School"
          rules={[
            { required: true, message: "Please enter the high school name" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter an email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="graduation_year"
          label="Graduation Year"
          rules={[
            { required: true, message: "Please enter the graduation year" },
          ]}
        >
          <Input type="number" min={1900} max={2050} />
        </Form.Item>

        <Form.Item name="reason" label="Reason">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="college_ids" label="Colleges">
          <Select
            mode="multiple"
            placeholder="Select colleges"
            style={{ width: "100%" }}
            optionFilterProp="children"
            showSearch
          >
            {colleges.map((college, i) => {
              return (
                <Option key={i} value={college.id}>
                  {college.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PetitionForm;
