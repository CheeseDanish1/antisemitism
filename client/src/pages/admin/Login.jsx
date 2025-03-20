import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, signin, signinError, isLoading } = useAuth();

  if (user) return <Navigate to="/admin/" replace />;

  function handleSubmit(e) {
    e.preventDefault();

    signin({ password, email });
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "40px 0" }}>
      <Card>
        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: 24 }}
        >
          Admin Login
        </Typography.Title>

        {signinError.length != 0 && (
          <Alert
            message={signinError[0]}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form layout="vertical" onSubmit={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
              loading={isLoading}
              block
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
