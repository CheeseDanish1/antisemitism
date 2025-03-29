import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, App, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { getInterviews, deleteInterview } from "../../../api/interviewService";
import { useNavigate } from "react-router-dom";

const InterviewList = ({ setActiveKey }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    fetchInterviews();
    //eslint-disable-next-line
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await getInterviews();

      setInterviews(response.data.data);
    } catch (error) {
      message.error("Failed to fetch interviews");
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/interviews/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteInterview(id);
      message.success("Interview deleted successfully");
      fetchInterviews();
    } catch (error) {
      message.error("Failed to delete interview");
      console.error("Error deleting interview:", error);
    }
  };

  const handleCreateNew = () => {
    setActiveKey("create");
  };

  const handleViewQuestions = (id) => {
    navigate(`/admin/interviews/${id}/questions`);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (text, record) => (
        <p
          style={{ cursor: "pointer", color: "#1677ff" }}
          onClick={() => handleEdit(record.id)}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Interviewee",
      dataIndex: "interviewee_name",
      key: "interviewee_name",
      sorter: true,
    },
    {
      title: "College",
      dataIndex: "college_name",
      key: "college_name",
      sorter: true,
    },
    {
      title: "Media Type",
      dataIndex: "media_type",
      key: "media_type",
      render: (type) => (
        <Tag
          color={
            type === "text" ? "blue" : type === "video" ? "green" : "orange"
          }
        >
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Rating",
      dataIndex: "final_assessment",
      key: "final_assessment",
      sorter: true,
      render: (rating) => `${rating}/5`,
    },
    {
      title: "Published",
      dataIndex: "published_at",
      key: "published_at",
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Interview">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record.id)}
            />
          </Tooltip>
          <Tooltip title="Manage Questions">
            <Button
              icon={<QuestionCircleOutlined />}
              size="small"
              onClick={() => handleViewQuestions(record.id)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this interview?"
            description="This action cannot be undone"
            onConfirm={() => handleDelete(record.id)}
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
    <div className="interview-list-container">
      <div className="list-header">
        <Button type="primary" onClick={handleCreateNew}>
          Create New Interview
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={interviews}
        rowKey="id"
        loading={loading}
        className="interview-table"
      />
    </div>
  );
};

export default InterviewList;
