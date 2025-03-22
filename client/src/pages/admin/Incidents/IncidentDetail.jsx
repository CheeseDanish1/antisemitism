// File: src/pages/Incidents/components/IncidentDetail.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Descriptions,
  Tag,
  Divider,
  Skeleton,
  Card,
  Space,
  Button,
  Steps,
  Form,
  Input,
  List,
  Popconfirm,
  Image,
  App,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  UploadOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getIncidentById,
  getIncidentEvidence,
  addIncidentEvidence,
  deleteEvidence,
} from "../../../api/incidentService";
import dayjs from "dayjs";
import { useIncidentsContext } from "../../../contexts/IncidentsContext";

const { Title, Text } = Typography;

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "orange";
    case "verified":
      return "blue";
    case "resolved":
      return "green";
    default:
      return "default";
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 1:
      return "green";
    case 2:
      return "cyan";
    case 3:
      return "blue";
    case 4:
      return "orange";
    case 5:
      return "red";
    default:
      return "default";
  }
};

export default function IncidentDetail({ incidentId }) {
  const { updateStatus } = useIncidentsContext();
  const [incident, setIncident] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    const statusMap = {
      pending: 0,
      verified: 1,
      resolved: 2,
    };

    const fetchIncidentData = async () => {
      setLoading(true);
      try {
        const { data } = await getIncidentById(incidentId);
        setIncident(data);
        setCurrentStatus(statusMap[data.status] || 0);

        const evidenceResponse = await getIncidentEvidence({ id: incidentId });
        setEvidence(evidenceResponse.data);
      } catch (error) {
        console.error("Failed to fetch incident details:", error);
        message.error("Failed to load incident details");
      } finally {
        setLoading(false);
      }
    };

    if (incidentId) {
      fetchIncidentData();
    }
  }, [incidentId, message]);

  const handleStatusChange = async (value) => {
    const statusValues = ["pending", "verified", "resolved"];
    const newStatus = statusValues[value];
    const success = await updateStatus(incidentId, newStatus);
    if (success) {
      setCurrentStatus(value);
      const { data } = await getIncidentById(incidentId);
      setIncident(data);
    }
  };

  const handleAddEvidence = async (values) => {
    try {
      await addIncidentEvidence({ incidentId, evidenceData: values });
      message.success("Evidence added successfully");
      const evidenceResponse = await getIncidentEvidence({ id: incidentId });
      setEvidence(evidenceResponse.data);
      form.resetFields();
    } catch (error) {
      console.error("Failed to add evidence:", error);
      message.error("Failed to add evidence");
    }
  };

  const handleDeleteEvidence = async (evidenceId) => {
    try {
      await deleteEvidence({ evidenceId });
      message.success("Evidence deleted successfully");
      const evidenceResponse = await getIncidentEvidence({ id: incidentId });
      setEvidence(evidenceResponse.data);
    } catch (error) {
      console.error("Failed to delete evidence:", error);
      message.error("Failed to delete evidence");
    }
  };

  if (loading) {
    return <Skeleton active />;
  }

  if (!incident) {
    return <Text>Incident not found</Text>;
  }

  return (
    <div>
      <Title level={4}>{incident.title}</Title>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Description">
              {incident.description}
            </Descriptions.Item>
            <Descriptions.Item label="College">
              {incident.college_name}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              <Space>
                <CalendarOutlined />
                {dayjs(incident.incident_date).format("MMMM D, YYYY")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              <Space>
                <EnvironmentOutlined />
                {incident.location}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Severity">
              <Tag color={getSeverityColor(incident.severity)}>
                Level {incident.severity}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Reported By">
              <Space>
                <UserOutlined />
                {incident.reported_by || "Anonymous"}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Reported At">
              <Space>
                <ClockCircleOutlined />
                {dayjs(incident.reported_at).format("MMMM D, YYYY h:mm A")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Current Status">
              <Tag color={getStatusColor(incident.status)}>
                {incident.status.charAt(0).toUpperCase() +
                  incident.status.slice(1)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Status">
          <Steps
            current={currentStatus}
            onChange={handleStatusChange}
            items={[
              {
                title: "Pending",
                description: "Awaiting verification",
              },
              {
                title: "Verified",
                description: "Incident confirmed",
              },
              {
                title: "Resolved",
                description: "Issue addressed",
              },
            ]}
          />
        </Card>

        {incident.media_url && (
          <Card title="Primary Media">
            <Image
              src={incident.media_url}
              alt="Incident media"
              style={{ maxWidth: "100%" }}
            />
          </Card>
        )}

        <Card
          title="Additional Evidence"
          extra={
            <Text type="secondary">
              {evidence.length} item{evidence.length !== 1 ? "s" : ""}
            </Text>
          }
        >
          <List
            dataSource={evidence}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Popconfirm
                    title="Delete this evidence?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDeleteEvidence(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <a
                      href={item.evidence_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Evidence #{evidence.indexOf(item) + 1}
                    </a>
                  }
                  description={item.description || "No description provided"}
                />
                <Text type="secondary">
                  {dayjs(item.uploaded_at).format("MMM D, YYYY")}
                </Text>
              </List.Item>
            )}
          />

          <Divider orientation="left">Add New Evidence</Divider>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddEvidence}
            autoComplete="off"
          >
            <Form.Item
              name="evidence_url"
              label="Evidence URL"
              rules={[
                {
                  required: true,
                  message: "Please enter the evidence URL",
                },
              ]}
            >
              <Input placeholder="URL to media file" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea
                rows={4}
                placeholder="Description of the evidence"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<UploadOutlined />}
                block
              >
                Add Evidence
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
}
