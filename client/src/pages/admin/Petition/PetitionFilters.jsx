import React from "react";
import { Row, Col, Input } from "antd";

function PetitionFilters({ searchText, setSearchText }) {
  return (
    <Row gutter={16} style={{ marginBottom: "20px" }}>
      <Col span={12}>
        <Input.Search
          placeholder="Search"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => setSearchText(value)}
          style={{ width: "100%" }}
        />
      </Col>
    </Row>
  );
}

export default PetitionFilters;
