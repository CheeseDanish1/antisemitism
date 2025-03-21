import React from "react";
import { Typography, Button } from "antd";
import usePetition from "../../../hooks/usePetition";
import PetitionStats from "./PetitionStats";
import PetitionFilters from "./PetitionFilters";
import PetitionActions from "./PetitionActions";
import PetitionTable from "./PetitionTable";
import PetitionForm from "./PetitionForm";
import AuthPage from "../AuthPage";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function PetitionPage() {
  const navigate = useNavigate();

  const {
    stats,
    loading,
    filteredData,
    searchText,
    setSearchText,
    selectedYears,
    setSelectedYears,
    yearOptions,
    handleRefresh,
    handleDelete,
    modalVisible,
    setModalVisible,
    handleCreate,
    exportData,
  } = usePetition();

  return (
    <AuthPage style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/")}
          style={{ marginRight: 16 }}
        />
        <Title level={2}>Petition Management</Title>
      </div>
      <PetitionStats stats={stats} />
      <PetitionActions
        onRefresh={handleRefresh}
        onExport={exportData}
        onAddNew={() => setModalVisible(true)}
      />
      <PetitionFilters
        searchText={searchText}
        setSearchText={setSearchText}
        selectedYears={selectedYears}
        setSelectedYears={setSelectedYears}
        yearOptions={yearOptions}
      />
      <PetitionTable
        data={filteredData}
        loading={loading}
        onDelete={handleDelete}
      />
      <PetitionForm
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleCreate}
      />
    </AuthPage>
  );
}

export default PetitionPage;
