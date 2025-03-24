import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spin,
  Form,
  Input,
  Modal,
  App,
  Space,
  Popconfirm,
} from "antd";
import {
  getInterviewQuestions,
  updateInterviewQuestion,
  deleteInterviewQuestion,
  addInterviewQuestions,
  reorderInterviewQuestions,
} from "../../../api/interviewService";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DragOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

const { TextArea } = Input;

const QuestionForm = ({
  form,
  onFinish,
  initialValues = {},
  loading,
  open,
  onCancel,
  title,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, message: "Please enter the question" }]}
        >
          <TextArea rows={3} placeholder="Enter the question..." />
        </Form.Item>

        <Form.Item
          name="answer"
          label="Answer"
          rules={[{ required: true, message: "Please enter the answer" }]}
        >
          <TextArea rows={5} placeholder="Enter the answer..." />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <TextArea rows={3} placeholder="Optional notes..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Create a separate DragHandle component that uses the drag listeners
const DragHandle = ({ id }) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id });

  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        cursor: "move",
        display: "inline-flex",
        padding: "4px",
        background: "#f5f5f5",
        borderRadius: "2px",
      }}
    >
      <DragOutlined />
    </span>
  );
};

const InterviewQuestionsList = ({ interviewId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Add activation constraints to make dragging more intentional
      activationConstraint: {
        distance: 5, // Minimum distance in pixels before activating
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (interviewId) {
      fetchQuestions();
    }
  }, [interviewId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await getInterviewQuestions(interviewId);
      // Sort questions by position
      const sortedQuestions = response.data.questions.sort(
        (a, b) => a.position - b.position
      );
      setQuestions(sortedQuestions);
    } catch (error) {
      message.error("Failed to fetch interview questions");
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    form.resetFields();
    setEditQuestion(null);
    setModalVisible(true);
  };

  const handleEditQuestion = (question) => {
    form.setFieldsValue(question);
    setEditQuestion(question);
    setModalVisible(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteInterviewQuestion(interviewId, questionId);
      message.success("Question deleted successfully");
      fetchQuestions();
    } catch (error) {
      message.error("Failed to delete question");
      console.error("Error deleting question:", error);
    }
  };

  const handleSubmitQuestion = async (values) => {
    setFormLoading(true);
    try {
      if (editQuestion) {
        await updateInterviewQuestion(interviewId, editQuestion.id, values);
        message.success("Question updated successfully");
      } else {
        // For new questions, add to the end of the list
        const position =
          questions.length > 0
            ? Math.max(...questions.map((q) => q.position)) + 1
            : 0;

        await addInterviewQuestions(interviewId, {
          questions: [{ ...values, position }],
        });
        message.success("Question added successfully");
      }

      setModalVisible(false);
      fetchQuestions();
    } catch (error) {
      message.error(`Failed to ${editQuestion ? "update" : "add"} question`);
      console.error(
        `Error ${editQuestion ? "updating" : "adding"} question:`,
        error
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Find the indices of the items
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      // Create a new array with the updated order
      const updatedQuestions = [...questions];
      const [movedItem] = updatedQuestions.splice(oldIndex, 1);
      updatedQuestions.splice(newIndex, 0, movedItem);

      // Update the positions
      const questionsWithUpdatedPositions = updatedQuestions.map(
        (q, index) => ({
          ...q,
          position: index,
        })
      );

      // Update locally immediately for better UX
      setQuestions(questionsWithUpdatedPositions);

      // Send to API
      try {
        await reorderInterviewQuestions(interviewId, {
          questions: questionsWithUpdatedPositions.map((q) => ({
            id: q.id,
            position: q.position + 1,
          })),
        });
      } catch (error) {
        message.error("Failed to update question order");
        console.error("Error updating question order:", error);
        fetchQuestions(); // Revert to original order on error
      }
    }
  };

  const columns = [
    {
      title: "Order",
      dataIndex: "position",
      key: "position",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      render: (text) => <div className="question-text">{text}</div>,
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      render: (text) => <div className="answer-text">{text}</div>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditQuestion(record)}
          />
          <Popconfirm
            title="Delete this question?"
            description="This action cannot be undone"
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
          <DragHandle id={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <div className="interview-questions-section">
      <div className="section-header">
        <h3>Interview Questions</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              dataSource={questions}
              columns={columns}
              rowKey="id"
              pagination={false}
              className="questions-table"
            />
          </SortableContext>
        </DndContext>
      )}

      <QuestionForm
        form={form}
        onFinish={handleSubmitQuestion}
        loading={formLoading}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        title={editQuestion ? "Edit Question" : "Add Question"}
      />
    </div>
  );
};

export default InterviewQuestionsList;
