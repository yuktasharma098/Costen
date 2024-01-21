import { Button, Col, Form, Input, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import "./login.css";
import { login } from "../services/ApiService";
import { LoadingOutlined } from "@ant-design/icons";
import Loading from "./Loading";

function Login() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loader, setLoader] = useState(false);
  const images = [
    "loginimg1.png",
    "loginimg3.png",
    "loginimg4.png",
    "loginimg5.png",
  ];
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };



  useEffect(() => {
    sessionStorage.clear()
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, []);

  const onFinish = (value) => {
    setLoader(true)
    const data = value.password;
    const hash = CryptoJS.SHA256(data).toString();
    const body = {
      email: value.email,
      password: hash,
    };
    login(body).then((res) => {
      if (res.responseCode === 200) {
        setLoader(false)
        if(res.data.is_new===1){
          sessionStorage.setItem("accessToken", res.data.accessToken);
          sessionStorage.setItem("emailId", res.data.emailId);
          navigate("/password-change");
        }
        else{
          sessionStorage.setItem("accessToken", res.data.accessToken);
          sessionStorage.setItem("refreshToken", res.data.refreshToken);
          sessionStorage.setItem("employeeId", res.data.employeeId);
          sessionStorage.setItem("designation", res.data.designation);
          sessionStorage.setItem("username", res.data.username);
          sessionStorage.setItem("userType", res.data.userType);
          sessionStorage.setItem("organization", res.data.organization);
          sessionStorage.setItem("emailId", res.data.emailId);
          sessionStorage.setItem("currency", res.data.currency);
          sessionStorage.setItem("costCenter", res.data.costCenter);
          sessionStorage.setItem("department", res.data.department);
   
            if (res.data.userType === 2) {
              navigate("/dashboard");
            } else if (res.data.userType === 1) {
              navigate("/dashboard-m");
            }
            else {
              message.error(res.responseMessage);
            }
 
        } 
        }
        else{
          setLoader(false)
            message.error(res.responseMessage);
          
        }
       
     
    });
  };
  return (
    <>
    {!loader? <Row>
        <Col lg={12}>
          <img
          alt="images"
            style={{ width: "6vw", left: "0", top: "0",marginLeft:'1rem',marginTop:'1rem'}}

            src="icon.png"
          />
          <div className="card-container" >
            <div >
              <Form layout="horizontal" onFinish={onFinish}>
                <span
                  style={{
                    display: "flex",
                    fontSize: "23px",
                    fontWeight: "700",
                    justifyContent: "flex-start",
                  }}
                >
                  Log in
                </span>
                <span
                  style={{
                    display: "flex",
                    fontSize: "15px",
                    justifyContent: "flex-start",
                    color: "#534ECC",
                    marginTop: "3%",
                  }}
                >
                  Welcome Back, Plesae login to your account
                </span>

                <div
                  style={{
                    marginTop: "5%",
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                    User Name
                  </label>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter User Name"
                      style={{ width: "300px" }}
                    />
                  </Form.Item>
                  <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                    Password
                  </label>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter Password"
                      style={{ width: "300px" }}
                    />
                  </Form.Item>
                </div>

                <Link
                  to="/forgot-password"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  Forgot password ?
                </Link>

                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "#3052D0",
                    color: "white",
                    marginTop: "4%",
                  }}
                  htmlType="submit"
                >
                  Login
                  {loader ? (
                      <LoadingOutlined style={{ color: "white" }} />
                    ) : (
                      <></>
                    )}
                </Button>
              </Form>
            </div>
          </div>
          <span
            style={{
              color: "#8A8A8A",
              bottom: "0",
              left: "0",
              position: "absolute",
              padding: "1rem",
            }}
          >
            © 2023 Costen All Rights Reserved
          </span>
        </Col>
        <Col span={12}>
          <img
            style={{
              maxWidth: "100%",
              height: "94vh",
              width: "95%",
              padding: "1rem 1rem 0.5rem",
              position: "relative",
            }}
            src={images[currentImageIndex]}
            alt={`Images${currentImageIndex + 1}`}
          />
          <div className="dot-container">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImageIndex ? "active" : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
      
        </Col>
      </Row>:<Loading/>}
     

    </>
  );
}

export default Login;