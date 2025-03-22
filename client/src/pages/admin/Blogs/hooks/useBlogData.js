import { useState, useEffect } from "react";
import { App } from "antd";
import { useNavigate } from "react-router-dom";

export const useBlogData = (fetchFn, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchFn(params);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      message.error(
        "Failed to fetch data: " +
          (error.response?.data?.message || error.message)
      );
      navigate("/admin/blogs");
      setLoading(false);
    }
  };

  return { data, loading, refreshData: fetchData };
};
