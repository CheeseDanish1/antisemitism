import React from "react";
import { Row, Col, Card, Statistic, Badge } from "antd";

function PetitionStats({ stats }) {
  if (!stats) return null;
  console.log(stats);

  return (
    <Row gutter={16} style={{ marginBottom: "20px" }}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Signatures"
            value={stats.total_signers || 0}
            prefix={<Badge status="processing" />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Signatures Today"
            value={stats.signatures_today || 0}
            prefix={<Badge status="success" />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Unique Schools"
            value={stats.unique_schools || 0}
            prefix={<Badge status="warning" />}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default PetitionStats;
