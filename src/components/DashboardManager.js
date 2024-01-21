import React, { useEffect, useState } from "react";
import {Col,Row, message } from "antd";
import SideBar from "./SideBar";
import Header from "./Header";
import "./dashboard.css";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import {
  bus,
  carRental,
  cashAdvance,
  flight,
  hoteldata,
  perdiem,
  perdiemextra,
  requesteid,
  taxi,
  train,
  travelHeader,
  amount
} from "../redux/actions";
import { getBulletinBoard, getDashboardNumber } from "../services/ApiService";
import { useDispatch } from "react-redux";
function DashboardManager() {
  const [collapsed, setCollapsed] = useState(false);
  const [countData, setCountData] = useState();
  const employeeId = sessionStorage.getItem("employeeId");
const[bulletin,setBulletin]=useState()
  const dispatch = useDispatch();
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
    dispatch(amount(0));

    getDashboardNumber(employeeId).then((res) => {
      if (res.responseCode === 200) {
        setCountData(res.data);
      } else {
        message.error(res.responseMessage);
      }
    });
    getBulletinBoard().then((res)=>{
      if(res.responseCode===200){
        setBulletin(res.data.bulletinNote)
      }
      else{
        message.error(res.responseMessage)
      }
    })
  }, []);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
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
              display: "flex",
              flexDirection: "column",
              marginTop: "1.5%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "0.6rem",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "500" }}>
                Overview
              </span>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "1%",
                  borderRadius: "17px",
                  marginLeft: "70%",
                  display: "inline-block",
                }}
              >
                <span>Last 90 days</span>
              </div>
            </div>
            <div className="dashcard-container-m">
              <div className="dashcard-m">
                {/* <img style={{width:'46px',height:'46px'}} src="card1icon.png"/> */}
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 46 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="46" height="46" rx="23" fill="#F0C274" />
                  <path
                    d="M30.3333 34C32.3584 34 34 32.3584 34 30.3334C34 28.3083 32.3584 26.6667 30.3333 26.6667C28.3083 26.6667 26.6667 28.3083 26.6667 30.3334C26.6667 32.3584 28.3083 34 30.3333 34Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.6667 19.3333C17.6917 19.3333 19.3333 17.6917 19.3333 15.6667C19.3333 13.6416 17.6917 12 15.6667 12C13.6416 12 12 13.6416 12 15.6667C12 17.6917 13.6416 19.3333 15.6667 19.3333Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24.2222 15.6667H27.8889C28.5372 15.6667 29.1589 15.9242 29.6174 16.3826C30.0758 16.8411 30.3333 17.4628 30.3333 18.1111V26.6667M15.6667 19.3334V34"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    color: "#797979",
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  Total Request
                </span>
                <span style={{ fontSize: "25px", fontWeight: "600" }}>
                  {" "}
                  {countData ? countData.totalRequest : 0}
                </span>
                <Link
                  to="/total-request"
                  style={{ textDecoration: "underline", color: "#3052D0" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.06041 3.4939C5.06041 3.25227 5.25629 3.0564 5.49791 3.0564L10.5054 3.0564C10.6214 3.0564 10.7327 3.10249 10.8148 3.18454C10.8968 3.26659 10.9429 3.37786 10.9429 3.4939L10.9429 8.50139C10.9429 8.74302 10.747 8.93889 10.5054 8.93889C10.2638 8.93889 10.0679 8.74302 10.0679 8.50139L10.0679 3.9314L5.49791 3.9314C5.25629 3.9314 5.06041 3.73552 5.06041 3.4939Z"
                      fill="#3052D0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.1839 10.8155C3.01305 10.6446 3.01305 10.3676 3.1839 10.1967L10.1259 3.25472C10.2968 3.08387 10.5738 3.08387 10.7446 3.25472C10.9155 3.42558 10.9155 3.70259 10.7446 3.87344L3.80262 10.8155C3.63177 10.9863 3.35476 10.9863 3.1839 10.8155Z"
                      fill="#3052D0"
                    />
                  </svg>
                  Click here to vew details
                </Link>
              </div>
              <div className="dashcard-m">
                {/* <img
                  style={{ width: "46px", height: "46px" }}
                  src="card2icon.png"
                /> */}
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 46 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="46" height="46" rx="23" fill="#E89271" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.1757 18.2491C14.9874 17.2842 16.3789 16.8125 18.4167 16.8125H27.5833C29.6211 16.8125 31.0126 17.2842 31.8243 18.2491C32.628 19.2047 32.7045 20.4601 32.5756 21.6306L31.8878 28.9674C31.7868 29.9098 31.5502 30.943 30.7088 31.7117C29.8736 32.4748 28.5796 32.8542 26.6667 32.8542H19.3333C17.4204 32.8542 16.1264 32.4748 15.2912 31.7117C14.4497 30.943 14.2132 29.9098 14.1122 28.9674L14.1113 28.9583L13.4244 21.6306C13.2955 20.4601 13.372 19.2047 14.1757 18.2491ZM15.228 19.1342C14.7956 19.6483 14.6739 20.4208 14.7917 21.4852L14.7929 21.4967L15.4799 28.8254C15.5716 29.6773 15.7615 30.279 16.2186 30.6966C16.6828 31.1206 17.5613 31.4792 19.3333 31.4792H26.6667C28.4387 31.4792 29.3172 31.1206 29.7814 30.6966C30.2385 30.279 30.4284 29.6773 30.5201 28.8254L31.2082 21.4852C31.326 20.4208 31.2044 19.6483 30.772 19.1342C30.3461 18.6279 29.4597 18.1875 27.5833 18.1875H18.4167C16.5403 18.1875 15.6539 18.6279 15.228 19.1342Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.0609 15.7128C20.0219 16.0111 20.0208 16.3501 20.0208 16.7666V17.5C20.0208 17.8797 19.713 18.1875 19.3333 18.1875C18.9536 18.1875 18.6458 17.8797 18.6458 17.5L18.6458 16.7428C18.6458 16.3546 18.6458 15.9305 18.6974 15.5348C18.751 15.1248 18.8657 14.6895 19.1344 14.3007C19.6998 13.4827 20.7354 13.1458 22.2667 13.1458H23.7333C25.2646 13.1458 26.3002 13.4827 26.8656 14.3007C27.1343 14.6895 27.249 15.1248 27.3025 15.5348C27.3542 15.9305 27.3542 16.3546 27.3542 16.7428L27.3542 17.5C27.3542 17.8797 27.0464 18.1875 26.6667 18.1875C26.287 18.1875 25.9792 17.8797 25.9792 17.5V16.7666C25.9792 16.3501 25.9781 16.0111 25.9391 15.7128C25.901 15.4207 25.8324 15.2241 25.7344 15.0824C25.5664 14.8394 25.1354 14.5208 23.7333 14.5208H22.2667C20.8646 14.5208 20.4336 14.8394 20.2656 15.0824C20.1676 15.2241 20.099 15.4207 20.0609 15.7128Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.8549 23.6882C21.8542 23.7537 21.8542 23.8283 21.8542 23.9167V24.8608C21.8542 25.1189 21.8564 25.3087 21.8788 25.4698C21.9004 25.6246 21.9346 25.7 21.9636 25.7409C21.996 25.7865 22.1572 25.9792 23 25.9792C23.8466 25.9792 24.0059 25.7847 24.0376 25.7395C24.0668 25.6978 24.1009 25.6213 24.1221 25.4646C24.1441 25.3017 24.1458 25.111 24.1458 24.8517V23.9167C24.1458 23.8283 24.1458 23.7537 24.1451 23.6882C24.0797 23.6875 24.0051 23.6875 23.9167 23.6875H22.0833C21.9949 23.6875 21.9203 23.6875 21.8549 23.6882ZM22.0532 22.3125C22.0633 22.3125 22.0733 22.3125 22.0833 22.3125H23.9167C23.9267 22.3125 23.9367 22.3125 23.9468 22.3125C24.1495 22.3125 24.3549 22.3124 24.5225 22.331C24.6934 22.35 24.9772 22.4008 25.2049 22.6285C25.4326 22.8561 25.4833 23.1399 25.5023 23.3108C25.5209 23.4784 25.5209 23.6839 25.5208 23.8866C25.5208 23.8966 25.5208 23.9066 25.5208 23.9167V24.862C25.5208 25.1 25.5208 25.3817 25.4847 25.649C25.4472 25.9263 25.365 26.241 25.1639 26.5283C24.7349 27.1407 23.9775 27.3542 23 27.3542C22.0278 27.3542 21.2724 27.1435 20.8418 26.536C20.6394 26.2504 20.5556 25.9367 20.517 25.6593C20.4792 25.3881 20.4792 25.1024 20.4792 24.8608V23.9167C20.4792 23.9066 20.4792 23.8966 20.4792 23.8866C20.4791 23.6839 20.4791 23.4784 20.4977 23.3108C20.5167 23.1399 20.5674 22.8561 20.7951 22.6285C21.0228 22.4008 21.3066 22.35 21.4775 22.331C21.6451 22.3124 21.8505 22.3125 22.0532 22.3125Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.4018 21.6789C32.6252 21.986 32.5573 22.416 32.2502 22.6393C30.0354 24.2501 27.505 25.2081 24.9192 25.5337C24.5425 25.5812 24.1987 25.3143 24.1512 24.9375C24.1038 24.5608 24.3707 24.217 24.7474 24.1695C27.1117 23.8718 29.4213 22.9965 31.4415 21.5273C31.7485 21.304 32.1785 21.3719 32.4018 21.6789Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.8343 21.9425C14.0488 21.6292 14.4766 21.549 14.79 21.7635C16.7598 23.1117 18.9811 23.9243 21.2432 24.1776C21.6205 24.2198 21.8921 24.56 21.8499 24.9373C21.8076 25.3147 21.4675 25.5863 21.0902 25.544C18.6039 25.2657 16.1685 24.3733 14.0134 22.8982C13.7 22.6837 13.6199 22.2558 13.8343 21.9425Z"
                    fill="white"
                  />
                </svg>
                <span
                  style={{
                    color: "#797979",
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  Open Request
                </span>

                <span style={{ fontSize: "25px", fontWeight: "600" }}>
                  {countData ? countData.openRequest : 0}
                </span>
                <Link
                  to="/open-request"
                  style={{ textDecoration: "underline", color: "#3052D0" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.06041 3.4939C5.06041 3.25227 5.25629 3.0564 5.49791 3.0564L10.5054 3.0564C10.6214 3.0564 10.7327 3.10249 10.8148 3.18454C10.8968 3.26659 10.9429 3.37786 10.9429 3.4939L10.9429 8.50139C10.9429 8.74302 10.747 8.93889 10.5054 8.93889C10.2638 8.93889 10.0679 8.74302 10.0679 8.50139L10.0679 3.9314L5.49791 3.9314C5.25629 3.9314 5.06041 3.73552 5.06041 3.4939Z"
                      fill="#3052D0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.1839 10.8155C3.01305 10.6446 3.01305 10.3676 3.1839 10.1967L10.1259 3.25472C10.2968 3.08387 10.5738 3.08387 10.7446 3.25472C10.9155 3.42558 10.9155 3.70259 10.7446 3.87344L3.80262 10.8155C3.63177 10.9863 3.35476 10.9863 3.1839 10.8155Z"
                      fill="#3052D0"
                    />
                  </svg>
                  Click here to vew details
                </Link>
              </div>
              <div className="dashcard-m">
                {/* <img
                  style={{ width: "46px", height: "46px" }}
                  src="card3icon.png"
                /> */}
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 46 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="46" height="46" rx="23" fill="#70A1E6" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23 14.5208C18.3197 14.5208 14.5208 18.3197 14.5208 23C14.5208 27.6803 18.3197 31.4791 23 31.4791C27.6803 31.4791 31.4792 27.6803 31.4792 23C31.4792 18.3197 27.6803 14.5208 23 14.5208ZM13.1458 23C13.1458 17.5603 17.5603 13.1458 23 13.1458C28.4397 13.1458 32.8542 17.5603 32.8542 23C32.8542 28.4397 28.4397 32.8541 23 32.8541C17.5603 32.8541 13.1458 28.4397 13.1458 23Z"
                    fill="#F1F1F1"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22.6609 18.1967C23.0406 18.1967 23.3484 18.5045 23.3484 18.8842V22.6425C23.3484 22.7832 23.4021 22.9872 23.5216 23.1968C23.6411 23.4064 23.7893 23.5564 23.9097 23.6277L23.9115 23.6288L23.9115 23.6288L26.7532 25.3246C27.0792 25.5192 27.1858 25.9413 26.9912 26.2673C26.7966 26.5934 26.3746 26.6999 26.0485 26.5054L23.2087 24.8106C23.2084 24.8104 23.2081 24.8102 23.2077 24.81C22.8336 24.588 22.5329 24.2387 22.3272 23.878C22.1213 23.5169 21.9734 23.0792 21.9734 22.6425V18.8842C21.9734 18.5045 22.2812 18.1967 22.6609 18.1967Z"
                    fill="#F1F1F1"
                  />
                </svg>
                <span
                  style={{
                    color: "#797979",
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  Pending Request
                </span>

                <span style={{ fontSize: "25px", fontWeight: "600" }}>
                  {" "}
                  {countData ? countData.pendingRequest : 0}
                </span>
                <Link
                  to="/pending-request"
                  style={{ textDecoration: "underline", color: "#3052D0" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.06041 3.4939C5.06041 3.25227 5.25629 3.0564 5.49791 3.0564L10.5054 3.0564C10.6214 3.0564 10.7327 3.10249 10.8148 3.18454C10.8968 3.26659 10.9429 3.37786 10.9429 3.4939L10.9429 8.50139C10.9429 8.74302 10.747 8.93889 10.5054 8.93889C10.2638 8.93889 10.0679 8.74302 10.0679 8.50139L10.0679 3.9314L5.49791 3.9314C5.25629 3.9314 5.06041 3.73552 5.06041 3.4939Z"
                      fill="#3052D0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.1839 10.8155C3.01305 10.6446 3.01305 10.3676 3.1839 10.1967L10.1259 3.25472C10.2968 3.08387 10.5738 3.08387 10.7446 3.25472C10.9155 3.42558 10.9155 3.70259 10.7446 3.87344L3.80262 10.8155C3.63177 10.9863 3.35476 10.9863 3.1839 10.8155Z"
                      fill="#3052D0"
                    />
                  </svg>
                  Click here to vew details
                </Link>
              </div>
              <div className="dashcard-m">
                {/* <img
                  style={{ width: "46px", height: "46px" }}
                  src="card3icon.png"
                /> */}
                <svg
                  width="49"
                  height="46"
                  viewBox="0 0 49 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.75"
                    width="47.8233"
                    height="46"
                    rx="23"
                    fill="#1A932E"
                  />
                  <path
                    d="M27.044 31.0587C31.5359 31.0587 33.7824 31.0587 35.1773 29.6626C36.5734 28.2678 36.5734 26.0212 36.5734 21.5293C36.5734 17.0374 36.5734 14.7909 35.1773 13.396C33.7824 12 31.5359 12 27.044 12H22.2793C17.7874 12 15.5409 12 14.146 13.396C12.75 14.7909 12.75 17.0374 12.75 21.5293C12.75 26.0212 12.75 28.2678 14.146 29.6626C14.9239 30.4417 15.9662 30.7859 17.5147 30.9372"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.0882 21.5298L23.7683 23.9121L28.2352 19.1475"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M27.044 31.0582C25.5717 31.0582 23.9493 31.6538 22.4687 32.4221C20.0888 33.6574 18.8988 34.2756 18.3127 33.8813C17.7267 33.4882 17.8375 32.2673 18.0602 29.8266L18.1102 29.2715"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>

                <span
                  style={{
                    color: "#797979",
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  To Be Approved
                </span>
                <span style={{ fontSize: "25px", fontWeight: "600" }}>
                  {" "}
                  {countData ? countData.toBeApprovedRequest : 0}
                </span>
                <Link
                  to="/tobeapprove"
                  style={{ textDecoration: "underline", color: "#3052D0" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.06041 3.4939C5.06041 3.25227 5.25629 3.0564 5.49791 3.0564L10.5054 3.0564C10.6214 3.0564 10.7327 3.10249 10.8148 3.18454C10.8968 3.26659 10.9429 3.37786 10.9429 3.4939L10.9429 8.50139C10.9429 8.74302 10.747 8.93889 10.5054 8.93889C10.2638 8.93889 10.0679 8.74302 10.0679 8.50139L10.0679 3.9314L5.49791 3.9314C5.25629 3.9314 5.06041 3.73552 5.06041 3.4939Z"
                      fill="#3052D0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.1839 10.8155C3.01305 10.6446 3.01305 10.3676 3.1839 10.1967L10.1259 3.25472C10.2968 3.08387 10.5738 3.08387 10.7446 3.25472C10.9155 3.42558 10.9155 3.70259 10.7446 3.87344L3.80262 10.8155C3.63177 10.9863 3.35476 10.9863 3.1839 10.8155Z"
                      fill="#3052D0"
                    />
                  </svg>
                  Click here to vew details
                </Link>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "white",
                height: "40vh",
                marginTop: "1rem",
                borderRadius: "20px",
                width: "70vw",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "0.5rem 1rem 0.5rem 1.5rem",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h2>Notes</h2>
                  <div
                    style={{
                      border: "none",
                      backgroundColor: "#FAFAFC",
                      width: "40vw",
                      height: "25vh",
                      overflow: "auto",
                      // paddingLeft:'0.5rem'
                    }}
                  >
                  <div style={{margin:'0.5rem 0 0 0.5rem'}}>
                  <span >
                    {bulletin?bulletin:"  Bulletin Board..."}
                    
                    </span>
                  </div>
                
                  </div>

                  {/* <TextArea
                    placeholder="Add Notes here..."
                    rows={4}
                    style={{
                      border: "none",
                      backgroundColor: "#FAFAFC",
                      width: "40vw",
                    }}
                  /> */}
                  {/* <Button
                    style={{
                      marginTop: "1rem",
                      width: "130px",
                      borderRadius: "20px",
                      backgroundColor: "#4318FF",
                      color: "white",
                    }}
                  >
                    Send
                  </Button> */}
                </div>
                <img alt="images" style={{ width: "20vw" }} src="dashboardm.png" />
                <div></div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  );
}

export default DashboardManager;
