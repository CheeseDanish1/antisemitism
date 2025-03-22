import React, { useState, useEffect } from "react";
import { Table, Typography, Button, App } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { getColleges } from "../../../api/collegeService";
import AuthPage from "../AuthPage";

function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    fetchColleges();

    // eslint-disable-next-line
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await getColleges();
      setColleges(response.data.colleges);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch colleges");
      console.error("Error fetching colleges:", error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/admin/college/${record.id}`}>{text}</Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "Ranking",
      dataIndex: "ranking",
      key: "ranking",
      sorter: (a, b) => a.ranking - b.ranking,
    },
  ];

  return (
    <AuthPage>
      <div
        className="colleges-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/")}
        />
        <Typography.Title level={2}>Colleges Directory</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/college/new")}
        >
          Add College
        </Button>
      </div>

      <Table
        dataSource={colleges}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Total ${total} colleges`,
        }}
      />
    </AuthPage>
  );
}

export default Colleges;
