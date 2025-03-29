import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Upload, Space } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import config from "../../../../../config/api";

function CollegeDetailsForm({
  form,
  college,
  onUpdate,
  onRemoveBanner,
  uploadingBanner,
}) {
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (info) => {
    // Store the file in state
    setFileList(info.fileList.slice(-1));

    // Update the form values with the file
    const file = info.file;
    form.setFieldsValue({
      file: file,
    });
  };

  const handleSubmit = (values) => {
    // Pass all form values to onUpdate
    onUpdate(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={college}
    >
      <Form.Item
        name="name"
        label="College Name"
        rules={[{ required: true, message: "Please enter the college name" }]}
      >
        <Input placeholder="Enter college name" />
      </Form.Item>

      {/* Hidden form item to store the file */}
      <Form.Item name="file" hidden={true}>
        <Input />
      </Form.Item>

      <Form.Item
        label="College Banner"
        tooltip="Upload an image to display at the top of the college page"
      >
        <Space direction="vertical">
          {college?.banner_path ? (
            <>
              <img
                src={config.API_URI + college.banner_path}
                alt="College banner"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  marginBottom: "10px",
                }}
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={onRemoveBanner}
                loading={uploadingBanner}
                danger
              >
                Remove Banner
              </Button>
            </>
          ) : (
            <Upload
              name="banner"
              listType="picture"
              fileList={fileList}
              showUploadList={true}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />} loading={uploadingBanner}>
                Upload Banner
              </Button>
            </Upload>
          )}
        </Space>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          {
            required: true,
            message: "Please enter the college description",
          },
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
          max={1000}
          style={{ width: "100%" }}
          placeholder="National ranking (1-1000)"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CollegeDetailsForm;
