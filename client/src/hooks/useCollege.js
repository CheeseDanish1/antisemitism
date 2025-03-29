import { useState, useEffect } from "react";
import { Form, App } from "antd";
import { useNavigate } from "react-router-dom";
import {
    getCollege,
    updateCollege as updateCollegeAPI,
    deleteCollegeBanner
} from "../api/collegeService";

function useCollege(id) {
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
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

            const bannerFile = values.file;

            const collegeData = { ...values };
            delete collegeData.file;

            await updateCollegeAPI(id, collegeData, bannerFile);

            message.success("College updated successfully!");

            await fetchCollegeDetails();

            setSaving(false);
        } catch (error) {
            message.error("Failed to update college");
            console.error("Error updating college:", error);
            setSaving(false);
        }
    };

    const removeBanner = async () => {
        try {
            setUploadingBanner(true);
            await deleteCollegeBanner(id);

            // Update college state to remove banner URL
            const updatedCollege = { ...college };
            delete updatedCollege.banner_path;
            setCollege(updatedCollege);

            // Also update the form state
            const currentValues = form.getFieldsValue();
            delete currentValues.banner_path;
            form.setFieldsValue(currentValues);

            message.success("Banner removed successfully!");
            setUploadingBanner(false);
        } catch (error) {
            message.error("Failed to remove banner");
            console.error("Error removing banner:", error);
            setUploadingBanner(false);
        }
    };

    return {
        college,
        loading,
        saving,
        uploadingBanner,
        form,
        message,
        fetchCollegeDetails,
        updateCollege,
        removeBanner
    };
}

export default useCollege;