import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, InputNumber, Spin, App } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import {
  createInterview,
  getInterviewById,
  updateInterview,
} from "../../../api/interviewService";
import { getColleges } from "../../../api/collegeService";
import AuthPage from "../AuthPage";
import ReactQuill from "react-quill-new";
import "./styles.css";

const { Option } = Select;

const CreateEditInterview = ({ setActiveKey }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const response = await getColleges();
        setColleges(response.data.colleges);
      } catch (error) {
        message.error("Failed to fetch college details");
        console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchInterview = async (interviewId) => {
      setLoading(true);
      try {
        const response = await getInterviewById(interviewId);
        form.setFieldsValue({
          ...response.data,
          college_id: response.data.college_id,
        });
      } catch (error) {
        message.error("Failed to fetch interview details");
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();

    if (id) {
      setIsEditing(true);
      fetchInterview(id);
    }
  }, [id, form, message]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const method = isEditing ? updateInterview : createInterview;
      const payload = { ...values };

      if (isEditing) {
        await method(id, payload);
        message.success("Interview updated successfully");
      } else {
        const response = await method(payload);
        message.success("Interview created successfully");
        // Navigate to edit mode to add questions
        navigate(`/admin/interviews/edit/${response.data.id}`);
      }

      if (!isEditing) {
        setActiveKey("list");
      }
    } catch (error) {
      message.error(`Failed to ${isEditing ? "update" : "create"} interview`);
      error.response.data.errors.forEach(({ message: messageErr }) => {
        message.error(messageErr);
      });
      console.error(
        `Error ${isEditing ? "updating" : "creating"} interview:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage className="create-edit-interview">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {isEditing && (
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/interviews")}
            style={{ marginRight: 16 }}
          />
        )}
        <h2>{isEditing ? "Edit Interview" : "Create New Interview"}</h2>
      </div>

      {loading && !form.getFieldsValue().title ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            media_type: "text",
            final_assessment: 3,
            questions: [],
          }}
          className="interview-form"
        >
          <div className="form-section">
            <h3>Basic Information</h3>

            <Form.Item
              name="title"
              label="Interview Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Enter interview title" />
            </Form.Item>

            <Form.Item
              name="college_id"
              label="College"
              rules={[{ required: true, message: "Please select a college" }]}
            >
              <Select
                placeholder="Select college"
                showSearch
                optionFilterProp="children"
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

            <Form.Item
              name="interviewee_name"
              label="Interviewee Name"
              rules={[
                { required: true, message: "Please enter interviewee name" },
              ]}
            >
              <Input placeholder="Enter interviewee name" />
            </Form.Item>

            <Form.Item name="interviewee_title" label="Interviewee Title">
              <Input placeholder="Enter interviewee title (optional)" />
            </Form.Item>
          </div>

          <div className="form-section">
            <h3>Content</h3>

            <Form.Item
              name="media_type"
              label="Media Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="text">Text</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="media_url"
              label="Media URL"
              rules={[
                {
                  required: form.getFieldValue("media_type") !== "text",
                  message: "Please enter media URL",
                },
              ]}
              hidden={form.getFieldValue("media_type") === "text"}
            >
              <Input placeholder="Enter media URL" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Interview Content"
              rules={[
                {
                  required: true,
                  message: "Please enter the interview content",
                },
              ]}
            >
              <ReactQuill
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ align: [] }],
                    ["clean"],
                  ],
                }}
                style={{ height: "300px", marginBottom: "50px" }}
              />
            </Form.Item>
          </div>

          <div className="form-section">
            <h3>Assessment</h3>

            <Form.Item name="final_assessment" label="Interview Rating (0-5)">
              <InputNumber min={0} max={5} step={0.5} style={{ width: 120 }} />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              {isEditing ? "Update Interview" : "Create Interview"}
            </Button>{" "}
          </Form.Item>
        </Form>
      )}
    </AuthPage>
  );
};

export default CreateEditInterview;
