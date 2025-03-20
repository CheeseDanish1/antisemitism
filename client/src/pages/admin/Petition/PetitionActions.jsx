import React from "react";
import { Row, Col, Button, Space, message } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  ExportOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

function PetitionActions({ onRefresh, onExport, onAddNew }) {
  return (
    <Row style={{ marginBottom: "20px" }}>
      <Col span={24}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
            Add Signature
          </Button>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Refresh
          </Button>
          <Button icon={<ExportOutlined />} onClick={onExport}>
            Export CSV
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default PetitionActions;
