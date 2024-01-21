import { Checkbox, Col, Collapse, Row, Space, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import Footer from "./Footer";
// import DynamicCollapse from "./DynamicCollapse";
import "./notification.css";
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
import { DeleteOutlined } from "@ant-design/icons";
import { getNotification, updateNotificationStatus } from "../services/ApiService";
const { Panel } = Collapse;

function formatDate(inputDate) {
  const dateObject = new Date(inputDate);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}
function Notification() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch=useDispatch()
  const [activeKey, setActiveKey] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const employeeId = sessionStorage.getItem("employeeId");
  const [data, setData] = useState([]);
  const isFirstRun = useRef(true);

  const [apicall, setApiCall] = useState();
  const handlePanelChange = (keys) => {
    if (keys.length == 1) {
      setApiCall(keys[0]);
      let body = {
        currentStatus: 0,
        notificationId: parseInt(keys[0]),
      };
      updateParentState(keys);
      updateNotificationStatus(body).then((res) => {
      });
    }
    setActiveKey(keys);
  };
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    getNotification(employeeId).then((res) => {
      if (res.responseCode === 200) {
        const formattedData = res.data.map((data) => ({
          ...data,
          created_date: formatDate(data.created_date),
        }));
        setData(formattedData);
      } else {
        message.error(res.responseMessage);
      }
    });
  }, [apicall]);
  const handleCheckboxChange = (key) => {
    const updatedSelectedKeys = selectedKeys.includes(key)
      ? selectedKeys.filter((selectedKey) => selectedKey !== key)
      : [...selectedKeys, key];
    setSelectedKeys(updatedSelectedKeys);
  };

  const handleSelectAll = () => {
    const allPanelKeys = data.map((item) => item.id);
    setSelectedKeys(
      selectedKeys.length === allPanelKeys.length ? [] : allPanelKeys
    );
  };

  const handleDeleteSelected = () => {
    setActiveKey(activeKey.filter((key) => !selectedKeys.includes(key)));
    setSelectedKeys([]);
    setApiCall(selectedKeys);
    const integers = selectedKeys.map((strNumber) => parseInt(strNumber, 10));

    let body = {
      notificationId: integers,
    };
    updateNotificationStatus(body).then((res) => {
      if(res.responseCode===200){
        setApiCall(body);
      }
      else{
        message.error(res.responseMessage)
      }
    });
  };

  useEffect(()=>{
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
  },[])
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  const [parentState, setParentState] = useState();

  // Callback function to update the state in the parent component
  const updateParentState = (newState) => {
    setParentState(newState);
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
          <Header  expense={false} travel={true} parentState={parentState} />
          {/* <DynamicCollapse updateParentState={updateParentState} /> */}
          <div style={{ marginTop: "0.7rem" }}>
      <div
        style={{
          textAlign: "right",
          marginRight: "3rem",
          marginBottom: "0.5rem",
        }}
      >
        <Checkbox
          indeterminate={
            selectedKeys.length > 0 && selectedKeys.length < data.length
          }
          checked={selectedKeys.length === data?.length}
          onChange={handleSelectAll}
        >
          Select All
        </Checkbox>

        <DeleteOutlined
          onClick={handleDeleteSelected}
          style={{ color: "red" }}
        />
      </div>
      <Collapse
        className="scroll-container"
        style={{ width: "95%" }}
        accordion
        activeKey={activeKey}
        onChange={handlePanelChange}
      >
        {data?.map(
          ({ id, request_id, message, created_date, current_status }) => (
            <Panel
              key={id}
              header={
                <Space style={{ display: "flex" }}>
                  <Checkbox
                    onChange={() => handleCheckboxChange(id)}
                    checked={selectedKeys.includes(id)}
                  />

                  <span style={{ textAlign: "left" }}>
                    Request ID: {request_id}
                  </span>
                  <span style={{ textAlign: "right" }}>
                    Created Date: {created_date}
                  </span>
                </Space>
              }
              style={{
                background: current_status === "1" ? "#EEF5FF" : "white",
              }}
            >
              {message}
            </Panel>
          )
        )}
      </Collapse>

      
    </div>

        </Col>
      </Row>
      <Footer />
    </div>
  );
}

export default Notification;
