import React from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";

function CollegesTable({ colleges, loading }) {
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
  );
}

export default CollegesTable;
