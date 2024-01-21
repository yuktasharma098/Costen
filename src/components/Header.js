import React, { useState,useEffect } from "react";
import "./header.css";
import {
  BellOutlined,
  UserOutlined,
  DownOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { Badge,Dropdown, Space, message } from "antd";
import PersonImage from "./PersonImage";
import { useNavigate } from "react-router-dom";
import { getNotification } from "../services/ApiService";
function Header(props) {
  // const [travelClick, setTravelClick] = useState(props.travel);
  // const [expenseClick, setExpenseClick] = useState(props.expense);
  const travelClick= props.travel;
  const expenseClick= props.expense;
  const userType = sessionStorage.getItem('userType')
  const[count,setCount]=useState()
  const employeeId=sessionStorage.getItem('employeeId')
  useEffect(()=>{
    getNotification(employeeId).then((res) => {
      if (res.responseCode === 200) {
     setCount(res.count)
      } else {
        message.error(res.responseMessage);
      }
    });
  },[count,props.parentState])

const navigate= useNavigate()
const handleTravelClick = () => {

  if(userType==="2"){
    navigate('/dashboard');

  }
  else if(userType==="1"){
    navigate('/dashboard-m');

  }
};

const handleExpenseClick = () => {
  
  navigate('/dashboard-expense');
};


  const items = [
    {
      label: <span onClick={()=>navigate('/profile')}>Profile</span>,
      key: "1",
      icon: <UserOutlined />,
    },
    {
      label: <span onClick={()=>navigate('/changepassword')}>Change Password</span>,
      key: "2",
      icon: <KeyOutlined />
      ,
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "row", marginTop: "1.5%",justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "247px",
          backgroundColor: "#F0F2F5",
          height: "54px",
          borderRadius: "32px",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          order:'1'
        }}
      >
        <div
          className={`btn ${travelClick ? "click" : ""}`}
          onClick={handleTravelClick}
        >
          {travelClick ? (
            <svg
              style={{ marginLeft: "10px" }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5.70833 14.2917L3.04167 12.8333L3.91667 11.9583L6 12.25L9.25 9L2.75 5.45833L3.91667 4.29167L11.875 6.33333L15.1458 3.10417C15.3819 2.86806 15.6772 2.75 16.0317 2.75C16.3861 2.75 16.6811 2.86806 16.9167 3.10417C17.1528 3.34028 17.2708 3.63556 17.2708 3.99C17.2708 4.34444 17.1528 4.63944 16.9167 4.875L13.6667 8.125L15.7083 16.0833L14.5417 17.25L11 10.75L7.75 14L8.04167 16.0833L7.16667 16.9583L5.70833 14.2917Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              style={{ marginLeft: "10px" }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5.70833 14.2917L3.04167 12.8333L3.91667 11.9583L6 12.25L9.25 9L2.75 5.45833L3.91667 4.29167L11.875 6.33333L15.1458 3.10417C15.3819 2.86806 15.6772 2.75 16.0317 2.75C16.3861 2.75 16.6811 2.86806 16.9167 3.10417C17.1528 3.34028 17.2708 3.63556 17.2708 3.99C17.2708 4.34444 17.1528 4.63944 16.9167 4.875L13.6667 8.125L15.7083 16.0833L14.5417 17.25L11 10.75L7.75 14L8.04167 16.0833L7.16667 16.9583L5.70833 14.2917Z"
                fill="#98A2B2"
              />
            </svg>
          )}
         <span style={{cursor:'pointer'}}>
         Travel
         </span>
        </div>
        <div
          className={`btn ${expenseClick ? "click" : ""}`}
          onClick={handleExpenseClick}   >
          {expenseClick ? (
            <svg
              style={{ marginLeft: "10px" }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.0163 2.5C8.1342 2.5 6.41962 3.12167 5.40503 3.62958C5.31337 3.67542 5.22795 3.72042 5.14837 3.76375C4.99087 3.84958 4.8567 3.92958 4.75003 4L5.9042 5.69917L6.44753 5.91542C8.57087 6.98667 11.4184 6.98667 13.5421 5.91542L14.1588 5.59542L15.25 4C15.024 3.85252 14.789 3.71935 14.5463 3.60125C13.5367 3.09875 11.8629 2.5 10.0167 2.5H10.0163ZM7.33212 4.42333C6.92341 4.34686 6.51975 4.24556 6.12337 4.12C7.07378 3.69792 8.49003 3.25 10.0163 3.25C11.0734 3.25 12.0729 3.465 12.8996 3.7375C11.9309 3.87375 10.8971 4.105 9.91212 4.38958C9.13712 4.61375 8.23128 4.58958 7.33212 4.42333ZM13.9821 6.53333L13.8796 6.585C11.5438 7.76333 8.44545 7.76333 6.10962 6.585L6.01253 6.53583C2.50337 10.3863 -0.175802 17.4988 10.0163 17.4988C20.2084 17.4988 17.4638 10.2533 13.9821 6.53333ZM9.58337 10C9.36235 10 9.15039 10.0878 8.99411 10.2441C8.83783 10.4004 8.75003 10.6123 8.75003 10.8333C8.75003 11.0543 8.83783 11.2663 8.99411 11.4226C9.15039 11.5789 9.36235 11.6667 9.58337 11.6667V10ZM10.4167 9.16667V8.75H9.58337V9.16667C9.14134 9.16667 8.71742 9.34226 8.40486 9.65482C8.09229 9.96738 7.9167 10.3913 7.9167 10.8333C7.9167 11.2754 8.09229 11.6993 8.40486 12.0118C8.71742 12.3244 9.14134 12.5 9.58337 12.5V14.1667C9.22087 14.1667 8.91212 13.9354 8.79712 13.6112C8.78005 13.5582 8.75253 13.5091 8.71617 13.4669C8.67981 13.4247 8.63536 13.3902 8.58543 13.3655C8.53551 13.3408 8.48114 13.3263 8.42552 13.3229C8.36991 13.3196 8.31419 13.3274 8.26166 13.346C8.20913 13.3645 8.16086 13.3935 8.1197 13.431C8.07853 13.4685 8.04532 13.514 8.02201 13.5646C7.99871 13.6152 7.98579 13.6699 7.98401 13.7256C7.98224 13.7813 7.99166 13.8368 8.0117 13.8888C8.12663 14.2137 8.33949 14.4951 8.62095 14.6941C8.90242 14.8931 9.23865 15 9.58337 15V15.4167H10.4167V15C10.8587 15 11.2826 14.8244 11.5952 14.5118C11.9078 14.1993 12.0834 13.7754 12.0834 13.3333C12.0834 12.8913 11.9078 12.4674 11.5952 12.1548C11.2826 11.8423 10.8587 11.6667 10.4167 11.6667V10C10.7792 10 11.0879 10.2312 11.2029 10.5554C11.22 10.6085 11.2475 10.6575 11.2839 10.6997C11.3203 10.742 11.3647 10.7764 11.4146 10.8012C11.4646 10.8259 11.5189 10.8404 11.5745 10.8437C11.6302 10.8471 11.6859 10.8392 11.7384 10.8207C11.7909 10.8021 11.8392 10.7732 11.8804 10.7357C11.9215 10.6981 11.9548 10.6527 11.9781 10.6021C12.0014 10.5515 12.0143 10.4967 12.0161 10.4411C12.0178 10.3854 12.0084 10.3299 11.9884 10.2779C11.8734 9.95293 11.6606 9.67156 11.3791 9.47255C11.0976 9.27354 10.7614 9.16667 10.4167 9.16667ZM10.4167 12.5V14.1667C10.6377 14.1667 10.8497 14.0789 11.006 13.9226C11.1622 13.7663 11.25 13.5543 11.25 13.3333C11.25 13.1123 11.1622 12.9004 11.006 12.7441C10.8497 12.5878 10.6377 12.5 10.4167 12.5Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              style={{ marginLeft: "10px" }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.0163 2.5C8.13417 2.5 6.41959 3.12167 5.405 3.62958C5.31334 3.67542 5.22792 3.72042 5.14834 3.76375C4.99084 3.84958 4.85667 3.92958 4.75 4L5.90417 5.69917L6.4475 5.91542C8.57084 6.98667 11.4183 6.98667 13.5421 5.91542L14.1588 5.59542L15.25 4C15.024 3.85252 14.7889 3.71935 14.5463 3.60125C13.5367 3.09875 11.8629 2.5 10.0167 2.5H10.0163ZM7.33209 4.42333C6.92338 4.34686 6.51972 4.24556 6.12334 4.12C7.07375 3.69792 8.49 3.25 10.0163 3.25C11.0733 3.25 12.0729 3.465 12.8996 3.7375C11.9308 3.87375 10.8971 4.105 9.91209 4.38958C9.13708 4.61375 8.23125 4.58958 7.33209 4.42333ZM13.9821 6.53333L13.8796 6.585C11.5438 7.76333 8.44542 7.76333 6.10959 6.585L6.0125 6.53583C2.50334 10.3863 -0.175832 17.4988 10.0163 17.4988C20.2083 17.4988 17.4638 10.2533 13.9821 6.53333ZM9.58334 10C9.36232 10 9.15036 10.0878 8.99408 10.2441C8.8378 10.4004 8.75 10.6123 8.75 10.8333C8.75 11.0543 8.8378 11.2663 8.99408 11.4226C9.15036 11.5789 9.36232 11.6667 9.58334 11.6667V10ZM10.4167 9.16667V8.75H9.58334V9.16667C9.14131 9.16667 8.71739 9.34226 8.40482 9.65482C8.09226 9.96738 7.91667 10.3913 7.91667 10.8333C7.91667 11.2754 8.09226 11.6993 8.40482 12.0118C8.71739 12.3244 9.14131 12.5 9.58334 12.5V14.1667C9.22084 14.1667 8.91209 13.9354 8.79709 13.6112C8.78002 13.5582 8.7525 13.5091 8.71614 13.4669C8.67978 13.4247 8.63532 13.3902 8.5854 13.3655C8.53548 13.3408 8.48111 13.3263 8.42549 13.3229C8.36988 13.3196 8.31416 13.3274 8.26163 13.346C8.2091 13.3645 8.16083 13.3935 8.11967 13.431C8.0785 13.4685 8.04529 13.514 8.02198 13.5646C7.99867 13.6152 7.98575 13.6699 7.98398 13.7256C7.98221 13.7813 7.99163 13.8368 8.01167 13.8888C8.1266 14.2137 8.33945 14.4951 8.62092 14.6941C8.90239 14.8931 9.23862 15 9.58334 15V15.4167H10.4167V15C10.8587 15 11.2826 14.8244 11.5952 14.5118C11.9077 14.1993 12.0833 13.7754 12.0833 13.3333C12.0833 12.8913 11.9077 12.4674 11.5952 12.1548C11.2826 11.8423 10.8587 11.6667 10.4167 11.6667V10C10.7792 10 11.0879 10.2312 11.2029 10.5554C11.22 10.6085 11.2475 10.6575 11.2839 10.6997C11.3202 10.742 11.3647 10.7764 11.4146 10.8012C11.4645 10.8259 11.5189 10.8404 11.5745 10.8437C11.6301 10.8471 11.6858 10.8392 11.7384 10.8207C11.7909 10.8021 11.8392 10.7732 11.8803 10.7357C11.9215 10.6981 11.9547 10.6527 11.978 10.6021C12.0013 10.5515 12.0142 10.4967 12.016 10.4411C12.0178 10.3854 12.0084 10.3299 11.9883 10.2779C11.8734 9.95293 11.6605 9.67156 11.3791 9.47255C11.0976 9.27354 10.7614 9.16667 10.4167 9.16667ZM10.4167 12.5V14.1667C10.6377 14.1667 10.8496 14.0789 11.0059 13.9226C11.1622 13.7663 11.25 13.5543 11.25 13.3333C11.25 13.1123 11.1622 12.9004 11.0059 12.7441C10.8496 12.5878 10.6377 12.5 10.4167 12.5Z"
                fill="#98A2B2"
              />
            </svg>
          )}
          <span style={{cursor:'pointer'}}>
          Expense
          </span>
        </div>
      </div>

{/* --------------------------------------------------------------------------------------------------------------------------------------------------- */}

      <div style={{display:'flex',justifyContent:'flex-end',alignContent:'flex-end',gap:'16px',order:'2',marginRight:'2%'}}>
        <div
        onClick={()=>navigate("/notification")}
          style={{
            display: "flex",
            height: "29px",
            width: "34px",
            padding: "13px",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            cursor:"pointer"
            // borderRadius: "55px",
            // backgroundColor: "#FFF",
            // boxShadow: "0px 4px 6px 0px rgba(0, 0, 0, 0.02)",
          }}
        >
          <Badge count={count}>
            <BellOutlined style={{ fontSize: "22px", color: "grey" }} />
          </Badge>
        </div>
        <div
          style={{
            borderRadius: "24px",
            display: "inline-block",
            padding: "10px",
            backgroundColor: "white",
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
          >
            <Space>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ textAlign: "center", marginRight: "15px" }}>
                    <PersonImage />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#292D32",
                    }}
                  >
                   {sessionStorage.getItem('username')}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#292D3270",
                    }}
                  >
                          {sessionStorage.getItem('designation')}
                  </span>
                </div>
              </div>
              <DownOutlined style={{ marginLeft: "10px",cursor:'pointer' }} />
            </Space>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Header;
