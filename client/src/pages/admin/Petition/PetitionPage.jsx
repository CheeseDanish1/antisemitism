import React from "react";
import { Typography } from "antd";
import usePetition from "../../../hooks/usePetition";
import PetitionStats from "./PetitionStats";
import PetitionFilters from "./PetitionFilters";
import PetitionActions from "./PetitionActions";
import PetitionTable from "./PetitionTable";
import PetitionForm from "./PetitionForm";
import AuthPage from "../AuthPage";

const { Title } = Typography;

function PetitionPage() {
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
      <Title level={2}>Petition Management</Title>

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
