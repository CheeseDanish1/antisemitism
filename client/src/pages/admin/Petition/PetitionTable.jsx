import React from "react";
import { Table, Button, Popconfirm, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

function PetitionTable({ data, loading, onDelete }) {
  const columns = [
    {
      title: "Name",
      dataIndex: "signer_name",
      key: "signer_name",
      sorter: (a, b) => a.signer_name.localeCompare(b.signer_name),
    },
    {
      title: "High School",
      dataIndex: "high_school_name",
      key: "high_school_name",
      sorter: (a, b) => a.high_school_name.localeCompare(b.high_school_name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Graduation Year",
      dataIndex: "graduation_year",
      key: "graduation_year",
      sorter: (a, b) => a.graduation_year - b.graduation_year,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: "Signed At",
      dataIndex: "signed_at",
      key: "signed_at",
      sorter: (a, b) => new Date(a.signed_at) - new Date(b.signed_at),
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this signature?"
          onConfirm={() => onDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />} danger type="link" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "25", "50", "100"],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} signatures`,
      }}
    />
  );
}

export default PetitionTable;
