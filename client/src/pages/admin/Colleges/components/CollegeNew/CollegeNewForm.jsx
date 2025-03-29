import React, { useState } from "react";
import { Form, Input, Button, InputNumber, App, Upload, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { createCollege } from "../../../../../api/collegeService";
import { SaveOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";

function CollegeNewForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    return isImage && isLt5M;
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Check if we have a file to upload
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // Add the file to the values
        values.banner = fileList[0].originFileObj;
      }

      await createCollege(values);
      message.success("College created successfully!");
      navigate("/admin/colleges");
    } catch (error) {
      message.error("Failed to create college");
      console.error("Error creating college:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ ranking: 0 }}
      >
        <Form.Item
          name="name"
          label="College Name"
          rules={[{ required: true, message: "Please enter the college name" }]}
        >
          <Input placeholder="Enter college name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter the college description" },
          ]}
        >
          <Input.TextArea
            placeholder="Enter college description"
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[
            { required: true, message: "Please enter the college location" },
          ]}
        >
          <Input placeholder="City, State" />
        </Form.Item>

        <Form.Item
          name="website"
          label="Website"
          rules={[
            { required: true, message: "Please enter the college website" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input placeholder="https://www.example.edu" />
        </Form.Item>

        <Form.Item
          name="ranking"
          label="Ranking"
          rules={[
            { required: true, message: "Please enter the college ranking" },
          ]}
        >
          <InputNumber
            min={1}
            max={5}
            style={{ width: "100%" }}
            placeholder="Ranking"
          />
        </Form.Item>

        <Form.Item
          label="Banner Image"
          tooltip="Upload a banner image for the college (maximum 5MB)"
          extra={
            fileList.length > 0 &&
            "Banner will be uploaded with the college data"
          }
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            maxCount={1}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload Banner</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => navigate("/admin/colleges")}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              Create College
            </Button>
          </div>
        </Form.Item>
      </Form>

      <Modal
        open={previewOpen}
        title="Preview"
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
}

export default CollegeNewForm;
