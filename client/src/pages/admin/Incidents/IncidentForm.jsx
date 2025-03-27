import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Space,
  App,
} from "antd";
import { useIncidentsContext } from "../../../contexts/IncidentsContext";
import dayjs from "dayjs";
import { getColleges } from "../../../api/collegeService";

export default function IncidentForm({
  initialValues = null,
  onSuccess = () => {},
}) {
  const { notification } = App.useApp();
  const { createIncident, updateIncident, fetchIncidents } =
    useIncidentsContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetchColleges();

    // If initialValues are provided, set the form fields
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        incident_date: initialValues.incident_date
          ? dayjs(initialValues.incident_date)
          : null,
      });
    }
  }, [initialValues, form]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const response = await getColleges();
      setColleges(response.data.colleges);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // Format the date properly for the API
      const formattedValues = {
        ...values,
        incident_date: values.incident_date.format("YYYY-MM-DD"),
      };

      let success;

      if (initialValues) {
        // Update existing incident
        success = await updateIncident(initialValues.id, formattedValues);
      } else {
        // Create new incident
        success = await createIncident(formattedValues);
      }

      if (success) {
        form.resetFields();
        notification.success({
          message: initialValues ? "Incident Updated" : "Incident Reported",
          description: initialValues
            ? "The incident has been successfully updated."
            : "Thank you for reporting this incident.",
        });
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={initialValues ? "Edit Incident" : "Report New Incident"}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: "pending",
          severity: 3,
          reported_by: "Anonymous",
        }}
      >
        <Form.Item
          name="title"
          label="Incident Title"
          rules={[
            {
              required: true,
              message: "Please enter a title for the incident",
            },
          ]}
        >
          <Input placeholder="Brief title describing the incident" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please provide a description",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Detailed description of what happened"
          />
        </Form.Item>

        <Form.Item
          name="college_id"
          label="College"
          rules={[
            {
              required: true,
              message: "Please select a college",
            },
          ]}
        >
          <Select
            placeholder="Select the college where incident occurred"
            options={colleges.map((college) => ({
              value: college.id,
              label: college.name,
            }))}
          />
        </Form.Item>

        <Space style={{ width: "100%" }} size="large">
          <Form.Item
            name="incident_date"
            label="Date of Incident"
            rules={[
              {
                required: true,
                message: "Please select the date",
              },
            ]}
            style={{ width: "100%" }}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="severity"
            label="Severity Level"
            rules={[
              {
                required: true,
                message: "Please rate the severity",
              },
            ]}
            style={{ width: "100%" }}
          >
            <Select
              placeholder="Select severity"
              options={[1, 2, 3, 4, 5].map((n) => ({
                value: n,
                label: `Level ${n}`,
              }))}
            />
          </Form.Item>
        </Space>

        <Form.Item
          name="location"
          label="Specific Location"
          rules={[
            {
              required: true,
              message: "Please specify where this occurred",
            },
          ]}
        >
          <Input placeholder="Building, room number, area, etc." />
        </Form.Item>

        <Form.Item
          name="media_url"
          label="Media URL"
          rules={[
            {
              type: "url",
              message: "Please enter a valid URL",
            },
          ]}
        >
          <Input placeholder="Link to photo or video (optional)" />
        </Form.Item>

        <Form.Item name="reported_by" label="Reported By">
          <Input placeholder="Your name (leave blank to remain anonymous)" />
        </Form.Item>

        {initialValues && (
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { value: "pending", label: "Pending" },
                { value: "verified", label: "Verified" },
                { value: "resolved", label: "Resolved" },
              ]}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {initialValues ? "Update Incident" : "Report Incident"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
