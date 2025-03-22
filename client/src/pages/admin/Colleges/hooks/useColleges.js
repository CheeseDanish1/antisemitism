import { useState, useEffect } from "react";
import { App } from "antd";
import { getColleges } from "../../../../api/collegeService";

function useColleges() {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
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

    return { colleges, loading, fetchColleges, message };
}

export default useColleges;