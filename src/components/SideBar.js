import React, { cloneElement, useState } from "react";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";

function SideBar({ collapsed }) {
  const navigate = useNavigate();
  const [clickedItemId, setClickedItemId] = useState("1");
const userType= sessionStorage.getItem('userType')
  const handleItemClick = (itemId) => {
    setClickedItemId(itemId);
  };
  return (
    <>
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10%",
          }}
        >
          {collapsed ? (
            <img
              style={{ width: "48px", marginBottom: "1rem" }}
              src="proclozicon.png"
            />
          ) : (
            <img style={{ width: "160px" }} src="proclozlogo.png" />
          )}
        </div>
        <div
          style={{ marginLeft: "10%", marginBottom: "15%", cursor: "pointer" }}
        >
          {collapsed ? (
            <div
              onClick={() => {
                navigate("/add-request");
              }}
              style={{
                width: "33px",
                height: "33px",
                backgroundColor: "#3052D0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "24px",
                marginLeft: "22%",
                marginBottom: "30%",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 3C12.5523 3 13 3.44772 13 4V11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H13V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H11V4C11 3.44772 11.4477 3 12 3Z"
                  fill="white"
                />
              </svg>
            </div>
          ) : (
            <div
              onClick={() => {
                navigate("/add-request");
              }}
              style={{
                marginLeft: "2%",
                width: "150px",
                height: "35px",
                padding: "5px 20px 5px 7px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "#3052D0",
                borderRadius: "24px",
              }}
            >
              <div
                style={{
                  width: "33px",
                  height: "33px",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "24px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 3C12.5523 3 13 3.44772 13 4V11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H13V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H11V4C11 3.44772 11.4477 3 12 3Z"
                    fill="#3052D0"
                  />
                </svg>
              </div>
              <span style={{ color: "white" }}>Add a request</span>
            </div>
          )}
        </div>

        {collapsed ? (
          <ul className="menu-collapsed">
            <li
              id="1"
              onClick={() => {handleItemClick("1");userType==2?navigate('/dashboard'):navigate('/dashboard-m')}}
              className={"1" === clickedItemId ? "clicked" : ""}
              style={{
                marginLeft: "12%",
                marginBottom: "15%",
                marginTop: "40%",
              }}
            >
              {clickedItemId === "1" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M10 21H5C3.89543 21 3 20.1046 3 19V12.2969C3 11.7852 3.19615 11.2929 3.54809 10.9215L10.5481 3.53257C11.3369 2.69989 12.663 2.69989 13.4519 3.53257L20.4519 10.9215C20.8038 11.2929 21 11.7852 21 12.2969V19C21 20.1046 20.1046 21 19 21H14M10 21V15.5C10 15.2239 10.2239 15 10.5 15H13.5C13.7761 15 14 15.2239 14 15.5V21M10 21H14"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M10 21H5C3.89543 21 3 20.1046 3 19V12.2969C3 11.7852 3.19615 11.2929 3.54809 10.9215L10.5481 3.53257C11.3369 2.69989 12.663 2.69989 13.4519 3.53257L20.4519 10.9215C20.8038 11.2929 21 11.7852 21 12.2969V19C21 20.1046 20.1046 21 19 21H14M10 21V15.5C10 15.2239 10.2239 15 10.5 15H13.5C13.7761 15 14 15.2239 14 15.5V21M10 21H14"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </li>
            <li
              id="2"
              onClick={() => handleItemClick("2")}
              className={"2" === clickedItemId ? "clicked" : ""}
              style={{
                marginLeft: "12%",
                marginBottom: "15%",
                marginTop: "31%",
              }}
            >
              {clickedItemId === "2" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 16V12"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 16V10"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 16V8"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 16V12"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 16V10"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 16V8"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </li>
            <li
              id="3"
              onClick={() =>{  handleItemClick("3");setClickedItemId("3");navigate('/notification')}}
              className={"3" === clickedItemId ? "clicked" : ""}
              style={{
                marginLeft: "12%",
                marginBottom: "15%",
                marginTop: "30%",
              }}
            >
              {clickedItemId === "3" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7.2798 10.0666C7.48379 7.58099 9.58399 5.60569 12.0779 5.59042C14.5491 5.57528 16.5667 7.53275 16.8167 9.99132C16.9708 11.5062 17.3972 12.9016 18.2536 14.387C19.1227 15.8946 18.1938 18 16.4536 18H7.70451C5.95987 18 5.05178 15.842 5.93027 14.3347C6.77156 12.8912 7.15964 11.5309 7.2798 10.0666Z"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 3V5"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7.2798 10.0666C7.48379 7.58099 9.58399 5.60569 12.0779 5.59042C14.5491 5.57528 16.5667 7.53275 16.8167 9.99132C16.9708 11.5062 17.3972 12.9016 18.2536 14.387C19.1227 15.8946 18.1938 18 16.4536 18H7.70451C5.95987 18 5.05178 15.842 5.93027 14.3347C6.77156 12.8912 7.15964 11.5309 7.2798 10.0666Z"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 3V5"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </li>
          </ul>
        ) : (
          <ul className="menu">
            <li
              id="1"
              onClick={() => {handleItemClick("1");userType==2?navigate('/dashboard'):navigate('/dashboard-m')}}
              className={"1" === clickedItemId ? "clicked" : ""}
              
            >
              {clickedItemId === "1" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M10 21H5C3.89543 21 3 20.1046 3 19V12.2969C3 11.7852 3.19615 11.2929 3.54809 10.9215L10.5481 3.53257C11.3369 2.69989 12.663 2.69989 13.4519 3.53257L20.4519 10.9215C20.8038 11.2929 21 11.7852 21 12.2969V19C21 20.1046 20.1046 21 19 21H14M10 21V15.5C10 15.2239 10.2239 15 10.5 15H13.5C13.7761 15 14 15.2239 14 15.5V21M10 21H14"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M10 21H5C3.89543 21 3 20.1046 3 19V12.2969C3 11.7852 3.19615 11.2929 3.54809 10.9215L10.5481 3.53257C11.3369 2.69989 12.663 2.69989 13.4519 3.53257L20.4519 10.9215C20.8038 11.2929 21 11.7852 21 12.2969V19C21 20.1046 20.1046 21 19 21H14M10 21V15.5C10 15.2239 10.2239 15 10.5 15H13.5C13.7761 15 14 15.2239 14 15.5V21M10 21H14"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
              {!collapsed && (
                <span
                  id="1"
                  onClick={() => handleItemClick("1")}
                  className={"1" === clickedItemId ? "clicked" : ""}
                  style={{ fontSize: "16px", fontWeight: "400" }}
                >
                  Dashboard
                </span>
              )}
            </li>
            {/* <li
              id="2"
              onClick={() => handleItemClick("2")}
              className={"2" === clickedItemId ? "clicked" : ""}
            >
              {clickedItemId === "2" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 16V12"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 16V10"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 16V8"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 16V12"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 16V10"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 16V8"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {!collapsed && (
                <span
                  id="2"
                  onClick={() => handleItemClick("2")}
                  className={"2" === clickedItemId ? "clicked" : ""}
                  style={{ fontSize: "16px", fontWeight: "400" }}
                >
                  Insights
                </span>
              )}
            </li> */}
            <li
              id="3"
              onClick={() =>{  handleItemClick("3");setClickedItemId("3");navigate('/notification')}}
              className={"3" === clickedItemId ? "clicked" : ""}
            >
              {clickedItemId === "3" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7.2798 10.0666C7.48379 7.58099 9.58399 5.60569 12.0779 5.59042C14.5491 5.57528 16.5667 7.53275 16.8167 9.99132C16.9708 11.5062 17.3972 12.9016 18.2536 14.387C19.1227 15.8946 18.1938 18 16.4536 18H7.70451C5.95987 18 5.05178 15.842 5.93027 14.3347C6.77156 12.8912 7.15964 11.5309 7.2798 10.0666Z"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 3V5"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18"
                    stroke="#3052D0"
                    strokeWidth="1.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7.2798 10.0666C7.48379 7.58099 9.58399 5.60569 12.0779 5.59042C14.5491 5.57528 16.5667 7.53275 16.8167 9.99132C16.9708 11.5062 17.3972 12.9016 18.2536 14.387C19.1227 15.8946 18.1938 18 16.4536 18H7.70451C5.95987 18 5.05178 15.842 5.93027 14.3347C6.77156 12.8912 7.15964 11.5309 7.2798 10.0666Z"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 3V5"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18"
                    stroke="#1F1F22"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
              {!collapsed && (
                <span
                  id="3"
                  onClick={() =>{  handleItemClick("3");setClickedItemId("3");navigate('/notification')}}
                  className={"3" === clickedItemId ? "clicked" : ""}
                  style={{ fontSize: "16px", fontWeight: "400" }}
                >
                  Notifications
                </span>
              )}
            </li>
          </ul>
        )}
        <div style={{ marginTop: "85%", cursor: "pointer" }}>
          {!collapsed ? (
            <div
            onClick={()=>{navigate('/needhelp')}}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                pointer: "cursor",
                gap: "3%",
                marginBottom: "10%",
              }}
            >
              {/* <img style={{padding:'0',border:'0',margin:'0'}} src="needhelp.png"/> */}
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="34" height="34" rx="17" fill="#3052D0" />
                <path
                  d="M15.1771 14.9185C15.3239 14.5011 15.6137 14.1492 15.9952 13.925C16.3767 13.7008 16.8252 13.6188 17.2613 13.6936C17.6974 13.7684 18.0929 13.9952 18.3779 14.3337C18.6628 14.6722 18.8188 15.1006 18.8181 15.5431C18.8181 16.7921 16.9445 17.4167 16.9445 17.4167M16.9674 19.9167H16.9758M24.5 17C24.5 21.1421 21.1421 24.5 17 24.5C12.8579 24.5 9.5 21.1421 9.5 17C9.5 12.8579 12.8579 9.5 17 9.5C21.1421 9.5 24.5 12.8579 24.5 17Z"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span
                id="4"
                onClick={() => handleItemClick("4")}
                className={"4" === clickedItemId ? "clicked" : ""}
                style={{ fontSize: "16px", fontWeight: "400" }}
              >
                Need Help
              </span>
            </div>
          ) : (
            <div
                        onClick={()=>{navigate('/needhelp')}}

              style={{
                marginTop: "80%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="34" height="34" rx="17" fill="#3052D0" />
                <path
                  d="M15.1771 14.9185C15.3239 14.5011 15.6137 14.1492 15.9952 13.925C16.3767 13.7008 16.8252 13.6188 17.2613 13.6936C17.6974 13.7684 18.0929 13.9952 18.3779 14.3337C18.6628 14.6722 18.8188 15.1006 18.8181 15.5431C18.8181 16.7921 16.9445 17.4167 16.9445 17.4167M16.9674 19.9167H16.9758M24.5 17C24.5 21.1421 21.1421 24.5 17 24.5C12.8579 24.5 9.5 21.1421 9.5 17C9.5 12.8579 12.8579 9.5 17 9.5C21.1421 9.5 24.5 12.8579 24.5 17Z"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          {!collapsed ? (
            <div
            onClick={()=>navigate("/logout")}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                gap: "5%",
                marginTop: "10%",
                marginLeft: "25%",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10 12L19 12M19 12L17 10M19 12L17 14M15 16L15 19C15 20.1046 14.1046 21 13 21L7 21C5.89543 21 5 20.1046 5 19L5 5C5 3.89543 5.89543 3 7 3L13 3C14.1046 3 15 3.89543 15 5L15 8"
                  stroke="#E65F2B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span
                style={{
                  color: "#E65F2B",
                  fontSize: "16px",
                  marginLeft: "4%",
                }}
              >
                Logout
              </span>
            </div>
          ) : (
            <div
             onClick={()=>navigate("/logout")}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "17%",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10 12L19 12M19 12L17 10M19 12L17 14M15 16L15 19C15 20.1046 14.1046 21 13 21L7 21C5.89543 21 5 20.1046 5 19L5 5C5 3.89543 5.89543 3 7 3L13 3C14.1046 3 15 3.89543 15 5L15 8"
                  stroke="#E65F2B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SideBar;
