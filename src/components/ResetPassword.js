import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import SideBar from "./SideBar";
import Header from "./Header";
import "./dashboard.css";
import Footer from "./Footer";
import "./resetpassword.css";
import CryptoJS from "crypto-js";
import { LoadingOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { changePassword, refreshToken } from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import {
  amount,
  bus,
  carRental,
  cashAdvance,
  claimno,
  flight,
  hoteldata,
  perdiem,
  perdiemextra,
  requesteid,
  taxi,
  train,
  travelHeader,
} from "../redux/actions";
import { useDispatch } from "react-redux";
function ResetPassword() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  useEffect(() => {
    dispatch(bus({}));
    dispatch(cashAdvance({}));
    dispatch(carRental({}));
    dispatch(flight({}));
    dispatch(hoteldata({}));
    dispatch(perdiem({}));
    dispatch(perdiemextra({}));
    dispatch(taxi({}));
    dispatch(train({}));
    dispatch(travelHeader({}));
    dispatch(requesteid(""));
    dispatch(claimno(""));
    dispatch(amount(0));
    const checkScreenSize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);

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
        }
      });
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#F7F8FA" }}>
      <Row>
        <Col
          xs={!collapsed ? 19 : 11}
          sm={!collapsed ? 10 : 6}
          md={!collapsed ? 7 : 4}
          lg={!collapsed ? 6 : 5}
          xl={!collapsed ? 5 : 3}
        >
          <div
            style={{ position: "fixed", zIndex: "1" }}
            className={`toggle ${collapsed ? "collapsed" : ""}`}
            onClick={toggleSidebar}
          >
            <svg
              className={`arrow ${collapsed ? "collapsed" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.39635 2.69038C9.19753 2.49709 8.8752 2.49709 8.67638 2.69038L4.60366 6.64997C4.50818 6.74279 4.45455 6.86869 4.45455 6.99996C4.45455 7.13122 4.50818 7.25712 4.60366 7.34994L8.67638 11.3095C8.8752 11.5028 9.19753 11.5028 9.39635 11.3095C9.59516 11.1162 9.59516 10.8029 9.39635 10.6096L5.6836 6.99996L9.39635 3.39034C9.59516 3.19705 9.59516 2.88367 9.39635 2.69038Z"
                fill="black"
              />
            </svg>
          </div>
          <SideBar collapsed={collapsed} />
        </Col>

        <Col
          xs={!collapsed ? 5 : 13}
          sm={!collapsed ? 14 : 18}
          md={!collapsed ? 17 : 20}
          lg={!collapsed ? 18 : 19}
          xl={!collapsed ? 19 : 21}
        >
           <Header expense={false} travel={true} />
          <div>
            <div style={{ position: "relative" }}>
              <img
                src="changepassword.png"
                style={{
                  width: "97%",
                  marginRight: "1rem",
                  marginTop: "1rem",
                  height: "30vh",
                  borderRadius: "15px",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: "10rem",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  width: "85%",
                  display: "block",
                  marginRight: "1.5rem",
                  borderRadius: "20px",
                  padding: "1rem 1rem 1rem 2rem",
                  height: "60vh",
                  overflow: "hidden",
                }}
              >
                <Row justify="center" align="middle" style={{ height: "60vh" }}>
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
                                <EyeOutlined
                                  onClick={toggleNewPasswordVisibility}
                                />
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
                                <EyeOutlined
                                  onClick={toggleNewPasswordVisibility}
                                />
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
                                if (
                                  !value ||
                                  getFieldValue("newPassword") === value
                                ) {
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
                            type={
                              confirmNewPasswordVisible ? "text" : "password"
                            }
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
                  <Col
                    span={15}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <img src="changepassword1.png" style={{ width: "70%" }} />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  );
}

export default ResetPassword;
