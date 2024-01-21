import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import "./dashboard.css";
import Footer from "./Footer";
import "./resetpassword.css";
import CryptoJS from "crypto-js";
import { LoadingOutlined } from "@ant-design/icons";

import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { changePassword, refreshToken } from "../services/ApiService";
import { useNavigate } from "react-router-dom";
function FirstTimePasswordChange() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [form] = Form.useForm();
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] =
    useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setConfirmNewPasswordVisible(!confirmNewPasswordVisible);
  };

  const onFinish = (values) => {
    setLoader(true);
    const { currentPassword, newPassword, confirmNewPassword } = values;
    const hashCurrentPassword = CryptoJS.SHA256(currentPassword).toString();
    const hashConfirmPassword = CryptoJS.SHA256(confirmNewPassword).toString();

    if (newPassword !== confirmNewPassword) {
      message.error("New password and confirm password do not match.");
    } else {
      let body = {
        oldPassword: hashCurrentPassword,
        newPassword: hashConfirmPassword,
        emailId: sessionStorage.getItem("emailId"),
      };

      changePassword(body).then((res) => {
        if (res.responseCode === 200) {
          setLoader(false);
          message.success("Password Changed Successfully");
          form.resetFields();
          navigate("/login");
        } else if (res.responseCode === 1) {
          setLoader(false);

          refreshToken().then((res) => {
            if (res.responseCode === 1) {
              setLoader(false);
            }
          });
        } else if (res.responseCode === 2) {
          setLoader(false);
        } else if (res.responseCode === 3) {
          setLoader(false);

          navigate("/login");
        } else {
          setLoader(false);
          message.error(res.responseMessage);
        }
      });
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <div>
        <Row style={{ marginTop: "5rem", marginLeft: "4rem" }} align="middle">
          <Col span={9}>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              Reset Password
            </span>

            <Form
              form={form}
              name="changePassword"
              onFinish={onFinish}
              layout="vertical"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.1rem",
                }}
              >
                <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                  Current Password
                </label>
                <Form.Item
                  className="custom-form-item"
                  name="currentPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your current password.",
                    },
                  ]}
                >
                  <Input.Password
                    className="custom-radio-group"
                    type={currentPasswordVisible ? "text" : "password"}
                    iconRender={(visible) =>
                      visible ? (
                        <EyeOutlined onClick={toggleNewPasswordVisibility} />
                      ) : (
                        <EyeInvisibleOutlined
                          onClick={toggleNewPasswordVisibility}
                        />
                      )
                    }
                  />
                </Form.Item>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.1rem",
                }}
              >
                <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                  New Password
                </label>

                <Form.Item
                  className="custom-form-item"
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a new password.",
                    },
                  ]}
                >
                  <Input.Password
                    className="custom-radio-group"
                    type={newPasswordVisible ? "text" : "password"}
                    iconRender={(visible) =>
                      visible ? (
                        <EyeOutlined onClick={toggleNewPasswordVisibility} />
                      ) : (
                        <EyeInvisibleOutlined
                          onClick={toggleNewPasswordVisibility}
                        />
                      )
                    }
                  />
                </Form.Item>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.1rem",
                }}
              >
                <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                  Confirm New Password
                </label>

                <Form.Item
                  className="custom-form-item"
                  name="confirmNewPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your new password.",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "New password and confirm password do not match."
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    className="custom-radio-group"
                    type={confirmNewPasswordVisible ? "text" : "password"}
                    iconRender={(visible) =>
                      visible ? (
                        <EyeOutlined
                          onClick={toggleConfirmNewPasswordVisibility}
                        />
                      ) : (
                        <EyeInvisibleOutlined
                          onClick={toggleConfirmNewPasswordVisibility}
                        />
                      )
                    }
                  />
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "#3052D0",
                    color: "white",
                    marginTop: "1rem",
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Change Password
                  {loader ? (
                    <LoadingOutlined style={{ color: "white" }} />
                  ) : (
                    <></>
                  )}
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={15} style={{ display: "flex", justifyContent: "center" }}>
            <img alt="images" src="changepassword1.png" style={{ width: "50%" }} />
          </Col>
        </Row>
      </div>

      <Footer />
    </div>
  );
}

export default FirstTimePasswordChange;
