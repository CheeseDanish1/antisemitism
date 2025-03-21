// File: src/pages/Incidents/components/IncidentsList.jsx
import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Drawer,
  Popconfirm,
  Select,
  Form,
  DatePicker,
  Card,
} from "antd";
import { useIncidentsContext } from "../../../contexts/IncidentsContext";

import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import IncidentDetail from "./IncidentDetail";
import IncidentForm from "./IncidentForm";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

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
  const {
    incidents,
    loading,
    filters,
    setFilters,
    refreshData,
    deleteIncident,
  } = useIncidentsContext();
  const [viewIncident, setViewIncident] = useState(null);
  const [editIncident, setEditIncident] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
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

  const handleFiltersSubmit = (values) => {
    const { dateRange, ...rest } = values;

    const newFilters = {
      ...rest,
      start_date: dateRange?.[0] ? dateRange[0].format("YYYY-MM-DD") : null,
      end_date: dateRange?.[1] ? dateRange[1].format("YYYY-MM-DD") : null,
    };

    setFilters(newFilters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilters({});
  };

  return (
    <div>
      <Card
        title="Incidents List"
        extra={
          <Space>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(true)}
            >
              Filters
            </Button>
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

      {/* Filters Drawer */}
      <Drawer
        title="Filter Incidents"
        placement="right"
        onClose={() => setShowFilters(false)}
        open={showFilters}
        width={400}
        extra={
          <Button type="primary" ghost onClick={resetFilters}>
            Reset
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFiltersSubmit}
          initialValues={{
            status: filters.status,
            severity: filters.severity,
            college_id: filters.college_id,
            dateRange:
              filters.start_date && filters.end_date
                ? [dayjs(filters.start_date), dayjs(filters.end_date)]
                : null,
          }}
        >
          <Form.Item name="status" label="Status">
            <Select
              allowClear
              placeholder="Select status"
              options={[
                { value: "pending", label: "Pending" },
                { value: "verified", label: "Verified" },
                { value: "resolved", label: "Resolved" },
              ]}
            />
          </Form.Item>

          <Form.Item name="severity" label="Severity">
            <Select
              allowClear
              placeholder="Select severity"
              options={[1, 2, 3, 4, 5].map((n) => ({
                value: n,
                label: `Level ${n}`,
              }))}
            />
          </Form.Item>

          <Form.Item name="college_id" label="College">
            <Select
              allowClear
              placeholder="Select college"
              options={
                // This would ideally come from an API call
                incidents
                  .map((i) => ({
                    value: i.college_id,
                    label: i.college_name,
                  }))
                  .filter(
                    (v, i, a) => a.findIndex((t) => t.value === v.value) === i
                  ) // Unique values
              }
            />
          </Form.Item>

          <Form.Item name="dateRange" label="Date Range">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Apply Filters
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
