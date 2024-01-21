import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import SideBar from "./SideBar";
import Header from "./Header";
import "./dashboard.css";
import Footer from "./Footer";
import "./resetpassword.css";
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
import PersonImage from "./PersonImage";
import { EditOutlined } from "@ant-design/icons";
import { getprofileData } from "../services/ApiService";
import { useDispatch } from "react-redux";
function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
  });
  const [objData, setObjData] = useState({});
  const [cost, setCost] = useState(undefined);
  const[data,setData]= useState({})
  const [edit, setEdit] = useState(false);
  const [personaledit, setpersonalEdit] = useState(false);
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
  useEffect(() => {
    getprofileData().then((res) => {
      if (res.responseCode === 200) {
        setData(res.data)
        const data = res.data;
        setCost(data.cost_center);
        delete data["cost_center"];
        setObjData(data);
      }
      else{
        message.error(res.responseMessage)
      }
    });
  }, []);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  function convertToTitleCase(inputString) {
    return inputString
      .split("_")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  function KeyValueGrid({ data }) {
    return (
      <Row>
        {Object.keys(data).map((key) => (
          <Col span={8} key={key}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // gap: "1rem",  
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontWeight: "700" }}>
                {convertToTitleCase(key)}:
              </span>
              <span>{data[key]}</span>
            </div>
          </Col>
        ))}
      </Row>
    );
  }
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
                  padding: "1rem 1rem 1rem 1rem",
                  height: "65vh",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.7rem",
                      }}
                    >
                      <PersonImage />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700", fontSize: "17px" }}>
                          {sessionStorage.getItem("username")}
                        </span>
                        <span style={{ color: "#DA1F63", fontSize: "13px" }}>
                          {sessionStorage.getItem("designation")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginTop: "1rem" }}>
                    <div style={{marginBottom:'1rem'}}>
                    <span style={{ fontSize: "16px", fontWeight: "700" }}>
                            Profile Information
                          </span>
                    </div>
                  
                    <KeyValueGrid data={objData} />

                      {/* <Row gutter={20}>
                        <Col lg={9}>
                          <span style={{ fontSize: "16px", fontWeight: "700" }}>
                            Profile Information
                          </span>
                          <EditOutlined
                            style={{
                                cursor: "pointer",
                                marginLeft: "0.8rem",
                              }}
                            type="icon-name"
                            id="my-icon"
                            onClick={() => setEdit(true)}
                          />
                          {edit ? (
                            <Form style={{ marginTop: "0.5rem" }}>
                              <Row gutter={12}>
                                <Col lg={12}>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Full Name:
                                    </label>
                                    <Form.Item
                                      className="custom-form-item"
                                      name="fullName"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter Full Name",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="Enter Full Name"
                                        // style={{width:'67%'}}
                                        className="custom-radio-group"
                                      />
                                    </Form.Item>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Employee ID:
                                    </label>
                                    <Form.Item
                                      className="custom-form-item"
                                      name="employeeId"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter Employee ID",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="Enter Employee ID"
                                        // style={{width:'67%'}}
                                        className="custom-radio-group"
                                      />
                                    </Form.Item>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Mobile:
                                    </label>
                                    <Form.Item
                                      className="custom-form-item"
                                      name="mobile"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter Mobile No.",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="Enter Mobile No."
                                        // style={{width:'67%'}}
                                        className="custom-radio-group"
                                      />
                                    </Form.Item>
                                  </div>
                                </Col>
                                <Col lg={12}>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Email:
                                    </label>
                                    <Form.Item
                                      className="custom-form-item"
                                      name="email"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter Email ID",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="Enter Email"
                                        // style={{width:'67%'}}
                                        className="custom-radio-group"
                                      />
                                    </Form.Item>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Location:
                                    </label>
                                    <Form.Item
                                      className="custom-form-item"
                                      name="location"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter Location",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="Enter Location"
                                        // style={{width:'67%'}}
                                        className="custom-radio-group"
                                      />
                                    </Form.Item>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Extension:
                                    </label>
                                    <Form.Item
                                      className="custom-form-item"
                                      name="extension"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter Extension",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="Enter Extension"
                                        // style={{width:'67%'}}
                                        className="custom-radio-group"
                                      />
                                    </Form.Item>
                                  </div>
                                </Col>
                              </Row>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "1rem",
                                  marginTop: "2rem",
                                  justifyContent: "center",
                                }}
                              >
                                <Form.Item>
                                  <Button type="primary" htmlType="submit">
                                    Save
                                  </Button>
                                </Form.Item>
                                <Button type="primary" onClick={()=>setEdit(false)}>Cancel</Button>
                              </div>
                            </Form>
                          ) : (
                            <Form style={{ marginTop: "0.5rem" }}>
                              <Row gutter={12}>
                                <Col lg={12}>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      First Name:
                                    </label>
                                    <span>
                                      {sessionStorage.getItem("username")}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Middle Name:
                                    </label>
                                    <span>
                                      {sessionStorage.getItem("username")}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Last Name:
                                    </label>
                                    <span>
                                      {sessionStorage.getItem("username")}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Employee ID:
                                    </label>
                                    <span>
                                      {sessionStorage.getItem("employeeId")}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Mobile:
                                    </label>
                                    <span>+91 1234567890</span>
                                  </div>
                                </Col>
                                <Col lg={12}>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Email:
                                    </label>
                                    <span>ysharma@procloz.com</span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Location:
                                    </label>
                                    <span>India</span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <label
                                      style={{
                                        color: "#2F3D4C",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Extension:
                                    </label>
                                    <span></span>
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          )}
                        </Col>

                        <Col lg={15}>
                          <span style={{ fontSize: "16px", fontWeight: "700" }}>
                            Personal Information
                            <EditOutlined
                              onClick={() => 
                                setpersonalEdit(true)
                              }
                              style={{
                                cursor: "pointer",
                                marginLeft: "0.8rem",
                              }}
                            />
                            {personaledit ? (
                              <Form style={{ marginTop: "0.5rem" }}>
                                <Row gutter={20}>
                                  <Col lg={8}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Blood Group:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="bloodGroup"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter Blood Group",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Blood Group"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Marital Status:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="maritalStatus"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Please enter Marital Status",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Marital Status"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Place of Birth:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="placeofbirth"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Please enter Place of Birth.",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Place of Birth"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Religion:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="religion"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter Religion",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Religion"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                  <Col lg={8}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Date of Birth:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="dateofbirth"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter DOB",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter DOB"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Marital Date:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="maritaldate"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Please enter Marital Date",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Marital Date"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Residential Status:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="residentialstatus"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Please enter Residential Status",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Residential Status"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Pysically Challenged:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="physicalchallenge"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter data",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Yes/No "
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                  <Col lg={8}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Nationality:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="nationality"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter Nationality",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Nationaltiy"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Spouse:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="spouse"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter Spouse",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Spouse"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Father's Name:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="fathername"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Please enter Father Name.",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Father Name"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        International Employee:
                                      </label>
                                      <Form.Item
                                        className="custom-form-item"
                                        name="internationalemployee"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter data",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter Yes/No"
                                          // style={{width:'67%'}}
                                          className="custom-radio-group"
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                </Row>

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "1rem",
                                    marginTop: "2rem",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                      Save
                                    </Button>
                                  </Form.Item>
                                  <Button type="primary" onClick={()=>setpersonalEdit(false)}>Cancel</Button>
                                </div>
                              </Form>
                            ) : (
                              <Form style={{ marginTop: "0.5rem" }}>
                                <Row gutter={20}>
                                  <Col lg={8}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Blood Group:
                                      </label>
                                      <span style={{fontWeight:'400'}}>O+</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Marital Status:
                                      </label>
                                      <span style={{fontWeight:'400'}}>Single</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Place of Birth:
                                      </label>
                                      <span style={{fontWeight:'400'}}>Rewari</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Religion:
                                      </label>
                                      <span style={{fontWeight:'400'}}>Hindu</span>
                                    </div>
                                  </Col>
                                  <Col lg={8}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Date of Birth:
                                      </label>
                                      <span style={{fontWeight:'400'}}> 31 Oct 2000</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Marital Date:
                                      </label>
                                      <span style={{fontWeight:'400'}}>NA</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Residential Status:
                                      </label>
                                      <span style={{fontWeight:'400'}}>India</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Pysically Challenged:
                                      </label>
                                      <span style={{fontWeight:'400'}}>No</span>
                                    </div>
                                  </Col>
                                  <Col lg={8}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Nationality:
                                      </label>
                                      <span style={{fontWeight:'400'}}>India</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Spouse:
                                      </label>
                                      <span style={{fontWeight:'400'}}>NA</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Father's Name:
                                      </label>
                                      <span style={{fontWeight:'400'}}>Jagmohan Sharma</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label
                                        style={{
                                          color: "#2F3D4C",
                                          fontWeight: "700",
                                        }}
                                      >
                                        International Employee:
                                      </label>
                                      <span style={{fontWeight:'400'}}>No</span>
                                    </div>
                                  </Col>
                                </Row>

                         
                              </Form>
                            )}
                          </span>
                        </Col>
                      </Row> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  );
}

export default Profile;
