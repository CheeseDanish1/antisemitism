import React, { createContext, useState, useContext, useEffect } from "react";
import { App } from "antd";
import {
    getIncidents,
    getIncidentStats,
    createIncident,
    updateIncident,
    deleteIncident,
    updateIncidentStatus,
} from "../api/incidentService";

const IncidentsContext = createContext();

export const useIncidentsContext = () => useContext(IncidentsContext);

export const IncidentsProvider = ({ children }) => {
    const { message } = App.useApp();
    const [incidents, setIncidents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const { data } = await getIncidents();
            setIncidents(data);
        } catch (error) {
            console.error("Failed to fetch incidents:", error);
            message.error("Failed to load incidents");
        } finally {
            setLoading(false);
        }
    };


    const fetchStats = async () => {
        try {
            const { data } = await getIncidentStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };


    useEffect(() => {
        fetchIncidents();
        fetchStats();
    }, [refreshTrigger]);


    const refreshData = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleCreateIncident = async (incidentData) => {
        try {
            await createIncident(incidentData);
            refreshData();
            return true;
        } catch (error) {
            console.error("Failed to create incident:", error);
            return false;
        }
    };

    const handleUpdateIncident = async (id, incidentData) => {
        try {
            await updateIncident(id, incidentData);
            refreshData();
            return true;
        } catch (error) {
            console.error("Failed to update incident:", error);
            return false;
        }
    };

    const handleDeleteIncident = async (id) => {
        try {
            await deleteIncident({ id });
            message.success("Incident deleted successfully");
            refreshData();
            return true;
        } catch (error) {
            console.error("Failed to delete incident:", error);
            message.error(
                error.response?.data?.error || "Failed to delete incident"
            );
            return false;
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateIncidentStatus({ id, status });
            message.success(`Status updated to ${status}`);
            refreshData();
            return true;
        } catch (error) {
            console.error("Failed to update status:", error);
            message.error(
                error.response?.data?.error || "Failed to update status"
            );
            return false;
        }
    };

    const value = {
        incidents,
        stats,
        loading,
        refreshData,
        createIncident: handleCreateIncident,
        updateIncident: handleUpdateIncident,
        deleteIncident: handleDeleteIncident,
        updateStatus: handleUpdateStatus,
        fetchIncidents,
        fetchStats
    };

    return (
        <IncidentsContext.Provider value={value}>
            {children}
        </IncidentsContext.Provider>
    );
};