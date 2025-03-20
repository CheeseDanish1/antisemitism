import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  InputNumber,
  Button,
  Skeleton,
  Divider,
  Space,
  App,
} from "antd";
import AuthPage from "../AuthPage";
import { useParams, useNavigate } from "react-router-dom";
import { getCollege, updateCollege } from "../../../api/collegeService";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

function CollegeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    fetchCollegeDetails();

    // eslint-disable-next-line
  }, [id]);

  const fetchCollegeDetails = async () => {
    try {
      setLoading(true);
      const response = await getCollege({ id });
      setCollege(response.data.college);
      form.setFieldsValue(response.data.college);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch college details");
      navigate("/admin/colleges");
      console.error("Error fetching college details:", error);
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setSaving(true);
      await updateCollege({ id, ...values });
      message.success("College updated successfully!");
      setCollege({ ...college, ...values });
      setSaving(false);
    } catch (error) {
      message.error("Failed to update college");
      console.error("Error updating college:", error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  return (
    <AuthPage>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/colleges")}
          />
          <Typography.Title level={2} style={{ margin: 0 }}>
            {college?.name}
          </Typography.Title>
        </Space>

        <Space>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={form.submit}
            loading={saving}
          >
            Save Changes
          </Button>
        </Space>
      </div>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
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
    </AuthPage>
  );
}

export default CollegeDetails;
