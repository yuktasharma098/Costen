import React, { useEffect, useRef, useState } from "react";
import { Collapse, Space, Checkbox, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  getNotification,
  updateNotificationStatus,
} from "../services/ApiService";
import "./notification.css";
const { Panel } = Collapse;

function formatDate(inputDate) {
  const dateObject = new Date(inputDate);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

const DynamicCollapse = ({ updateParentState }) => {
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

  return (
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
  );
};

export default DynamicCollapse;
