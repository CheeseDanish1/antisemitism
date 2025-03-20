import React, { useState, useEffect } from "react";
import AuthPage from './AuthPage';
import { getResources, addResource, deleteResource, updateResource } from "../../api/resourcesService.js";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Typography, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { App } from 'antd';

function Resources() {
  const { message } = App.useApp();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchResources();

    // eslint-disable-next-line
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await getResources();
      setResources(response.data || []);
    } catch (error) {
      message.error('Failed to fetch resources');
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingResource(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingResource(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      resource_url: record.resource_url
    });
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingResource) {
        await updateResource({
          id: editingResource.id,
          ...values
        });
        message.success('Resource updated successfully');
      } else {
        await addResource(values);
        message.success('Resource added successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchResources();
    } catch (error) {
      message.error(editingResource ? 'Failed to update resource' : 'Failed to add resource');
      console.error('Error submitting form:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteResource({ id });
      message.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      message.error('Failed to delete resource');
      console.error('Error deleting resource:', error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    },
    {
      title: 'URL',
      dataIndex: 'resource_url',
      key: 'resource_url',
      render: (url) => url ? (
        <Typography.Link href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </Typography.Link>
      ) : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            type="text"
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Delete resource"
            description="Are you sure you want to delete this resource?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              type="text"
              danger
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <AuthPage>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Typography.Title level={3}>Resources</Typography.Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            Add Resource
          </Button>
        </div>

        <Spin spinning={loading}>
          <Table 
            columns={columns}
            dataSource={resources.map(resource => ({ ...resource, key: resource.id }))}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
          />
        </Spin>

        <Modal
          title={editingResource ? 'Edit Resource' : 'Add Resource'}
          open={modalVisible}
          onCancel={handleCancel}
          onOk={handleSubmit}
          okText={editingResource ? 'Update' : 'Create'}
          confirmLoading={loading}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ title: '', content: '', resource_url: '' }}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter resource title" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: 'Please enter content' }]}
            >
              <Input.TextArea placeholder="Enter resource content" rows={4} />
            </Form.Item>
            <Form.Item
              name="resource_url"
              label="Resource URL"
            >
              <Input placeholder="Enter resource URL (optional)" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AuthPage>
  );
}

export default Resources;