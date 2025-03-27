// File: src/pages/Incidents/components/IncidentsList.jsx
import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Drawer,
  Popconfirm,
  Form,
  DatePicker,
  Card,
} from "antd";
import { useIncidentsContext } from "../../../contexts/IncidentsContext";

import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import IncidentDetail from "./IncidentDetail";
import IncidentForm from "./IncidentForm";
import dayjs from "dayjs";

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

export default function IncidentsList() {
  const { incidents, loading, refreshData, deleteIncident } =
    useIncidentsContext();
  const [viewIncident, setViewIncident] = useState(null);
  const [editIncident, setEditIncident] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "College",
      dataIndex: "college_name",
      key: "college_name",
      sorter: (a, b) => a.college_name.localeCompare(b.college_name),
    },
    {
      title: "Date",
      dataIndex: "incident_date",
      key: "incident_date",
      render: (date) => dayjs(date).format("MMM D, YYYY"),
      sorter: (a, b) => new Date(a.incident_date) - new Date(b.incident_date),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity) => (
        <Tag color={getSeverityColor(severity)}>Level {severity}</Tag>
      ),
      sorter: (a, b) => a.severity - b.severity,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Reported By",
      dataIndex: "reported_by",
      key: "reported_by",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => setViewIncident(record)}
            size="small"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditIncident(record)}
            size="small"
          />
          <Popconfirm
            title="Delete this incident?"
            description="This action cannot be undone."
            onConfirm={() => deleteIncident(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Incidents List"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={refreshData}>
              Refresh
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={incidents}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* View Incident Drawer */}
      <Drawer
        title="Incident Details"
        placement="right"
        onClose={() => setViewIncident(null)}
        open={!!viewIncident}
        width={600}
      >
        {viewIncident && <IncidentDetail incidentId={viewIncident.id} />}
      </Drawer>

      {/* Edit Incident Drawer */}
      <Drawer
        title="Edit Incident"
        placement="right"
        onClose={() => setEditIncident(null)}
        open={!!editIncident}
        width={600}
      >
        {editIncident && (
          <IncidentForm
            initialValues={editIncident}
            onSuccess={() => setEditIncident(null)}
          />
        )}
      </Drawer>
    </div>
  );
}
