import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import {
    getSignatures,
    getPetitionStats,
    deletePetition,
    signPetition
} from '../api/petitionService';
import { exportToCSV } from '../utils/exportUtils';

function usePetition() {
    const [signatures, setSignatures] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedYears, setSelectedYears] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [signaturesResponse, statsResponse] = await Promise.all([
                    getSignatures(),
                    getPetitionStats()
                ]);

                setSignatures(signaturesResponse.data);
                setStats(statsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Failed to load petition data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    const handleDelete = async (id) => {
        try {
            await deletePetition({ id });
            message.success("Signature deleted successfully");
            handleRefresh();
        } catch (error) {
            console.error("Error deleting signature:", error);
            message.error("Failed to delete signature");
        }
    };

    const handleCreate = async (values) => {
        try {
            await signPetition({
                signer_name: values.signer_name,
                high_school_name: values.high_school_name,
                email: values.email,
                graduation_year: values.graduation_year,
                reason: values.reason,
                college_ids: values.college_ids || []
            });

            message.success("Signature added successfully");
            setModalVisible(false);
            handleRefresh();
        } catch (error) {
            console.error("Error creating signature:", error);
            message.error("Failed to add signature");
        }
    };

    const exportData = () => {
        exportToCSV(filteredData, 'petition_signatures');
    };

    const yearOptions = useMemo(() => {
        const years = new Set(signatures.map(sig => sig.graduation_year));
        return Array.from(years).sort().map(year => ({
            value: year.toString(),
            label: year.toString()
        }));
    }, [signatures]);

    const filteredData = useMemo(() => {
        return signatures.filter(signature => {
            const matchesSearch = searchText === "" ||
                signature.signer_name.toLowerCase().includes(searchText.toLowerCase()) ||
                signature.high_school_name.toLowerCase().includes(searchText.toLowerCase()) ||
                (signature.email && signature.email.toLowerCase().includes(searchText.toLowerCase())) ||
                (signature.reason && signature.reason.toLowerCase().includes(searchText.toLowerCase()));

            const matchesYear = selectedYears.length === 0 ||
                selectedYears.includes(signature.graduation_year.toString());

            return matchesSearch && matchesYear;
        });
    }, [signatures, searchText, selectedYears]);

    return {
        signatures,
        stats,
        loading,
        filteredData,
        searchText,
        setSearchText,
        selectedYears,
        setSelectedYears,
        yearOptions,
        modalVisible,
        setModalVisible,
        handleRefresh,
        handleDelete,
        handleCreate,
        exportData
    };
}

export default usePetition;