// TODO: Delete college
import { useState, useEffect } from "react";
import { Form, App } from "antd";
import { useNavigate } from "react-router-dom";
import { getCollege, updateCollege as updateCollegeAPI, } from "../../../../api/collegeService";

function useCollege(id) {
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollegeDetails();
        // eslint-disable-next-line
    }, [id]);

    const fetchCollegeDetails = async () => {
        try {
            setLoading(true);
            const response = await getCollege({ id });
            setCollege(response.data.college);
            form.setFieldsValue(response.data.college);
            setLoading(false);
        } catch (error) {
            message.error("Failed to fetch college details");
            navigate("/admin/colleges");
            console.error("Error fetching college details:", error);
            setLoading(false);
        }
    };

    const updateCollege = async (values) => {
        try {
            setSaving(true);
            await updateCollegeAPI({ id, ...values });
            message.success("College updated successfully!");
            setCollege({ ...college, ...values });
            setSaving(false);
        } catch (error) {
            message.error("Failed to update college");
            console.error("Error updating college:", error);
            setSaving(false);
        }
    };

    return {
        college,
        loading,
        saving,
        form,
        message,
        fetchCollegeDetails,
        updateCollege
    };
}

export default useCollege;