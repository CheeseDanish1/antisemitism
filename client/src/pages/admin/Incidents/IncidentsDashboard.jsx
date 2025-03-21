import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Skeleton,
  Typography,
  Space,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useIncidentsContext } from "../../../contexts/IncidentsContext";
import dayjs from "dayjs";

const { Text } = Typography;

// Status and severity color functions from other components
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

// Chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function IncidentsDashboard() {
  const { incidents, loading } = useIncidentsContext();

  // Calculate summary statistics from incidents data
  const calculateStats = () => {
    if (!incidents || incidents.length === 0) return null;

    // Count incidents by status
    const statusCounts = {
      pending: 0,
      verified: 0,
      resolved: 0,
    };

    // Count incidents by severity
    const severityCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    // Count incidents by college
    const collegeMap = {};

    // Count incidents by month
    const monthMap = {};

    incidents.forEach((incident) => {
      // Count by status
      statusCounts[incident.status] = (statusCounts[incident.status] || 0) + 1;

      // Count by severity
      severityCounts[incident.severity] =
        (severityCounts[incident.severity] || 0) + 1;

      // Count by college
      const college = incident.college_name;
      collegeMap[college] = (collegeMap[college] || 0) + 1;

      // Count by month
      const month = dayjs(incident.incident_date).format("MMM YYYY");
      monthMap[month] = (monthMap[month] || 0) + 1;
    });

    // Convert to chart-friendly format
    const statusData = Object.keys(statusCounts).map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: statusCounts[key],
    }));

    const severityData = Object.keys(severityCounts).map((key) => ({
      name: `Level ${key}`,
      value: severityCounts[key],
    }));

    const collegeData = Object.keys(collegeMap).map((key) => ({
      name: key,
      value: collegeMap[key],
    }));

    // Sort months chronologically
    const monthKeys = Object.keys(monthMap).sort(
      (a, b) => dayjs(a, "MMM YYYY").valueOf() - dayjs(b, "MMM YYYY").valueOf()
    );

    const monthData = monthKeys.map((month) => ({
      name: month,
      incidents: monthMap[month],
    }));

    return {
      totalIncidents: incidents.length,
      pendingCount: statusCounts.pending,
      verifiedCount: statusCounts.verified,
      resolvedCount: statusCounts.resolved,
      statusData,
      severityData,
      collegeData,
      monthData,
      highSeverityCount: severityCounts[4] + severityCounts[5],
    };
  };

  const calculatedStats = calculateStats();

  // Get recent incidents for the table
  const recentIncidents =
    incidents && incidents.length > 0
      ? [...incidents]
          .sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at))
          .slice(0, 5)
      : [];

  // Table columns configuration
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Date",
      dataIndex: "incident_date",
      key: "incident_date",
      render: (date) => dayjs(date).format("MMM D, YYYY"),
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity) => (
        <Tag color={getSeverityColor(severity)}>Level {severity}</Tag>
      ),
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
    },
  ];

  if (loading || !calculatedStats) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Summary Statistics */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Incidents"
              value={calculatedStats.totalIncidents}
              prefix={<AlertOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={calculatedStats.pendingCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Verified"
              value={calculatedStats.verifiedCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Resolved"
              value={calculatedStats.resolvedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* High Severity Alert */}
      {calculatedStats.highSeverityCount > 0 && (
        <Card style={{ backgroundColor: "#fff2f0", borderColor: "#ffccc7" }}>
          <Space align="center">
            <FireOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />
            <div>
              <Text strong>Alert: </Text>
              <Text>
                {calculatedStats.highSeverityCount} high severity (Level 4-5)
                incident{calculatedStats.highSeverityCount !== 1 ? "s" : ""}{" "}
                currently in the system
              </Text>
            </div>
          </Space>
        </Card>
      )}

      {/* Charts Row */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Incidents by Month">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={calculatedStats.monthData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="incidents"
                    name="Incidents"
                    fill="#1890ff"
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card title="By Status">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={calculatedStats.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {calculatedStats.statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card title="By Severity">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={calculatedStats.severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {calculatedStats.severityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Incidents Table */}
      <Card title="Recent Incidents">
        <Table
          columns={columns}
          dataSource={recentIncidents}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Incidents by College */}
      <Card title="Incidents by College">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={calculatedStats.collegeData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Incidents" fill="#52c41a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </Space>
  );
}
