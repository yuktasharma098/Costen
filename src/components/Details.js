import { Button, Col, Input, Modal, Row, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation, useNavigate } from "react-router-dom";
import {
  approval,
  getApprovedetails,
  getCashInAdvance,
  getHotelData,
  getTransport,
  sendBackByManager,
} from "../services/ApiService";
import { InfoCircleOutlined } from "@ant-design/icons";
const { TextArea } = Input;

function Details() {
  const { state } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState();
  const [details, setDetails] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [comment, setComment] = useState();
  const status=state.status==="submitted"?"approved":(state.status==="approved"?"send for payment":"paid")
  const urlLinkPart= state.status==="submitted"?"manager-approve":(state.status==="approved"?"expense-admin-approve":"finance-approve")
  const navigate = useNavigate();
  const[spinner,setSpinner]=useState(false)
  const[total,setTotal]=useState()
  function camelToNormal(text) {
    return text.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
  }
  const convertDateFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const convertDatesInArray = (dataArray) => {
    return dataArray.map((item) => {
      const convertedItem = { ...item };
      if (item.startDate) {
        convertedItem.startDate = convertDateFormat(item.startDate);
      }
      if (item.endDate) {
        convertedItem.endDate = convertDateFormat(item.endDate);
      }
      if (item.departureDate) {
        convertedItem.departureDate = convertDateFormat(item.departureDate);
      }
      return convertedItem;
    });
  };
  const removeRequestIdFromArray = (dataArray) => {
    return dataArray.map(({ requestId, ...rest }) => rest);
  };

  const DynamicContentModal = ({ visible, onCancel, dataArray }) => {
    const calculateModalWidth = () => {
      const multiplier = 300;
      const maxWidth = 760;
      const totalKeyValuePairs = dataArray.reduce(
        (total, obj) => total + Object.keys(obj).length,
        0
      );
      return Math.min(totalKeyValuePairs * multiplier, maxWidth);
    };

    return (
      <Modal
        open={visible}
        onCancel={onCancel}
        footer={false}
        width={calculateModalWidth()}
      >
        <div>
          {dataArray.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              {Object.entries(item).map(([key, value]) => (
                <div key={key} style={{ marginLeft: "16px" }}>
                  <p
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.1rem",
                    }}
                  >
                    <strong>{camelToNormal(key)}: </strong>
                    <span style={{ fontWeight: "600" }}>{value}</span>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    getApprovedetails(state.id,"travel").then((res) => {
      if (res.responseCode === 200) {
        setData(res);
        setTotal(res?.totalCost)
        setDetails(res.data);
      }
    });
  }, []);
  useEffect(() => {
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

  const handleIconClick = (itemName) => {
    if (itemName.expenseType === "Cash In Advance") {
      
      getCashInAdvance(data.requestId,"travel",state.requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          let obj = {
            "Cash In Advance Amount": res?.data?.cashInAdvance,
            "Cash Advance Reason": res?.data?.reasonCashInAdvance,
          };
          let arr = [];
          arr.push(obj);
          setModalData(arr);
          setModalOpen(true);
        } else {
          message.error(res.responseMessage);
        }
      });
    } else if (itemName.expenseType === "Hotel Fare") {
      getHotelData(data.requestId, "travel", state.requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          setModalOpen(true);
          const convertedArray = convertDatesInArray(res.data);
          const newArrayWithoutRequestId =
            removeRequestIdFromArray(convertedArray);
          setModalData(newArrayWithoutRequestId);
        } else {
          message.error(res.responseMessage);
        }
      });
    } else if (itemName.expenseType === "Air Fare") {
      getTransport(data.requestId,"travel",state.requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          let filterDataflight = res.data?.filter(
            (item) => item.transportType === "flight"
          );
          setModalOpen(true);
          const convertedArray = convertDatesInArray(filterDataflight[0].trips);
          setModalData(convertedArray);
        } else {
          message.error(res.responseMessage);
        }
      });
    } else if (itemName.expenseType === "Bus Fare") {
      getTransport(data.requestId,"travel",state.requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          let busData = res.data?.filter(
            (item) => item.transportType === "bus"
          );
          setModalOpen(true);
          const convertedArray = convertDatesInArray(busData[0].trips);
          setModalData(convertedArray);
        } else {
          message.error(res.responseMessage);
        }
      });
    } else if (itemName.expenseType === "Train Fare") {
      getTransport(data.requestId,"travel",state.requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          let trainData = res.data?.filter(
            (item) => item.transportType === "train"
          );
          setModalOpen(true);
          const convertedArray = convertDatesInArray(trainData[0].trips);
          setModalData(convertedArray);
        } else {
          message.error(res.responseMessage);
        }
      });
    } else if (itemName.expenseType === "Car Rental") {
      getTransport(data.requestId,"travel",state.requestPolicy).then((res) => {

        if (res.responseCode === 200) {
          let carRentalData = res.data?.filter(
            (item) => item.transportType === "carRental"
          );
          setModalOpen(true);
          delete carRentalData[0].transportType;
          const convertedArray = convertDatesInArray(carRentalData);
          setModalData(convertedArray);
        } else {
          message.error(res.responseMessage);
        }
      });
    } else if (itemName.expenseType === "Taxi Fare") {
      getTransport(data.requestId,"travel",state.requestPolicy).then((res) => {

        if (res.responseCode === 200) {
          let taxiData = res.data?.filter(
            (item) => item.transportType === "taxi"
          );
          setModalOpen(true);
          delete taxiData[0].transportType;
          // const convertedArray = convertDatesInArray(taxiData);

          setModalData(taxiData);
        } else {
          message.error(res.responseMessage);
        }
      });
    }
  };
  const handleModalCancel = () => {
    setModalOpen(false);
  };
  const toApprove = () => {
    setSpinner(true)
    if (data.requestId) {
      let obj = {
        requestId: data ? data.requestId : "",
        status: status,
        comment: comment,
      };

      approval(obj,urlLinkPart).then((res) => {
        if (res.responseCode === 200) {
          setSpinner(false)
          message.success("Approved Successfully");
          navigate("/tobeapprove");
        } else {
          setSpinner(false)
          message.error(res.responseMessage);
        }
      });
    } else {
      message.error("Request ID not found");
    }
  };
  const onSendBack = () => {
    if (data.requestId) {
      let obj = {
        requestId: data ? data.requestId : "",
        status: "rejected",
        comment: comment,
      };
      sendBackByManager(obj).then((res) => {
        if (res.responseCode === 200) {
          message.success("Message have been Send Back Successfully");
          navigate("/tobeapprove");
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      message.error("Request ID not found");
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
          <div
            style={{
              backgroundColor: "white",
              display: "block",
              padding: "1rem",
              marginRight: "1.5rem",
              borderRadius: "15px",
              marginTop: "2rem",
              height: "73vh",
              overflow: "auto",
            }}
          >
                      <Spin spinning={spinner} tip="Approving..." size="large">

            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  marginLeft: "2rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "15px",
                      marginRight: "0.3rem",
                    }}
                  >
                    Request ID :
                  </span>
                  <span style={{ fontSize: "15px", color: "#3052D0" }}>
                    {data ? data.requestId : ""}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "15px",
                      marginRight: "0.3rem",
                    }}
                  >
                    Request Name :
                  </span>
                  <span style={{ fontSize: "15px", color: "#3052D0" }}>
                    {data ? data.requestName : ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1.5rem",
                  }}
                >
                  <Button
                    style={{
                      width: "8.5rem",
                      backgroundColor: "#3052D0",
                      border: "none",
                      color: "white",
                    }}
                    onClick={() => toApprove()}
                  >
                    Approve
                  </Button>
                  <Button
                    style={{
                      width: "8.5rem",
                      backgroundColor: "transparent",
                      border: "1px solid red",
                      color: "red",
                    }}
                    onClick={() => onSendBack()}
                  >
                    Send back
                  </Button>
                </div>
              </div>
              <div style={{ paddingLeft: "2rem", marginTop: "1rem" }}>
                {/* <Row>
                  <Col lg={10}>
                    <span style={{ fontWeight: "700" }}> Date</span>
                  </Col>
                  <Col lg={7}>
                    <span style={{ fontWeight: "700" }}>Expense Type</span>
                  </Col>
                  <Col lg={7}>
                    <span style={{ fontWeight: "700" }}>Amount</span>
                  </Col>
                </Row> */}
                <Row>
                  <Col lg={12}>
                    <span style={{ fontWeight: "700" }}>Expense Type</span>
                  </Col>
                  <Col lg={12}>
                    <span style={{ fontWeight: "700" }}>Amount</span>
                  </Col>
                </Row>
                <hr
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginRight: "10rem",
                  }}
                />
                <div
                  style={{
                    // marginTop: "1rem",
                    height: "33vh",
                    overflow: "auto",
                  }}
                >
                  {details?.map((item, index) => (
                    <Row style={{ marginTop: "0.7rem" }}>
                      {/* <Col lg={10}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div
                            style={{
                              width: "7px",
                              height: "7px",
                              backgroundColor: "#3052D0",
                              borderRadius: "50%",
                              marginTop: "0.4rem",
                              marginRight: "0.4rem",
                            }}
                          ></div>
                          <span> {index + 1}</span>
                        </div>
                      </Col> */}
                      <Col lg={12}>
                        <span>{item.expenseType}</span>
                        <span
                          role="img"
                          aria-label="Icon"
                          style={{ marginRight: "8px", cursor: "pointer" }}
                          onClick={() => handleIconClick(item)}
                        >
                        <InfoCircleOutlined style={{color:'blue',marginLeft:'0.3rem'}} />
                        </span>
                      </Col>
                      <Col lg={12}>
                        <span style={{ color: "#1A932E", fontWeight: "600" }}>
                          {item.amount}
                        </span>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
              
                  <Row style={{ marginLeft: "1.8rem" }}>
                    <Col lg={12}>
                      <span style={{ fontWeight: "600" }}>Total </span>
                    </Col>
                    <Col lg={12}>
                      {total < 0 ? (
                        <span style={{ color: "red", fontWeight: "600" }}>
                        {sessionStorage.getItem('currency')}&nbsp;

                          {total}
                        </span>
                      ) : (
                        <span style={{ color: "#1A932E", fontWeight: "600" }}>
                        {sessionStorage.getItem('currency')}&nbsp;

                          {total}
                        </span>
                      )}
                    </Col>
                  </Row>
              
              <div
                style={{
                  marginLeft: "1.7rem",
                  marginTop: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontWeight: "500", fontSize: "16px" }}>
                  Comment
                </span>
                <TextArea
                  style={{
                    width: "60vw",
                    backgroundColor: "#FAFAFC",
                    marginTop: "0.2rem",
                  }}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Please describe your comments here"
                />
              </div>
            </div>
            </Spin>
          </div>
        </Col>
      </Row>
      <Footer />

      <DynamicContentModal
        visible={modalOpen}
        onCancel={handleModalCancel}
        dataArray={modalData}
      />
    </div>
  );
}

export default Details;
