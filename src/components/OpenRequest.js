import React, { useEffect, useState } from "react";
import { Button, Col, Row,Table, message } from "antd";
import SideBar from "./SideBar";
import Header from "./Header";
import "./dashboard.css";
import Footer from "./Footer";
import "./tobeapproved.css";
import { useNavigate } from "react-router-dom";
import { allTravelRequestDashboard } from "../services/ApiService";
import moment from "moment";
import { amount, requesteid } from "../redux/actions";
import { useDispatch } from "react-redux";
const formatColumnName = (columnName) => {
  // Convert snake_case to title case (e.g., request_id to Request Id)
  const words = columnName.split("_");
  const formattedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return formattedWords.join(" ");
};

// const { Option } = Select;
function OpenRequest() {
  const [collapsed, setCollapsed] = useState(false);
  // const [totalRequest, setTotalRequest] = useState([]);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const empId = sessionStorage.employeeId;
  useEffect(() => {
    allTravelRequestDashboard(empId).then((res) => {
      if (res.responseCode === 200) {
        res.data.openRequest.map((item) => {
          if (item.start_date) {
            item.start_date = moment(item.start_date).format("DD-MM-YYYY");
          }
          return item;
        });

        if (res.data.openRequest.length > 0) {
          // Assuming all objects in the data array have the same keys
          const columnKeys = Object.keys(res.data.openRequest[0]);
          const dynamicColumns = columnKeys.map((key) => ({
            title: formatColumnName(key),
            dataIndex: key,
            key,
          }));

          setColumns([
            ...dynamicColumns,
            {
              title: "Details",
              key: "details",
              render: (text, record) => (
                <Button onClick={() => handleDetailClick(record)}>
                  View Details
                </Button>
              ),
            },
          ]);
          setData(res.data.openRequest);
        }
        // setTotalRequest(res.data.openRequest);
      } else {
        message.error(res.responseMessage);
      }
    });
  }, []);
  const handleDetailClick = (record) => {
    if (record.request_id.charAt(0) == "D") {
      sessionStorage.setItem("T", "D");

      dispatch(requesteid(record.request_id));
      dispatch(amount(record.total_amount));
      navigate("/travel-page", { state: { data: "open" } });
    } else if (record.request_id.charAt(0) == "I") {
      sessionStorage.setItem("T", "I");

      dispatch(requesteid(record.request_id));
      navigate("/travel-page", { state: { data: "open" } });
    }
  };
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // if (totalRequest.length > 0) {
  //   // Create columns dynamically based on the keys of the first object in the data array
  //   const firstDataItem = totalRequest[0];
  //   for (const key in firstDataItem) {
  //     if (firstDataItem.hasOwnProperty(key)) {
  //       columns.push({
  //         title: key.toUpperCase().replace("_"," "),
  //         dataIndex: key,
  //         key: key,
  //       });
  //     }
  //   }
  // }

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
            }}
          >
            {/* {totalRequest?  <Table
                dataSource={totalRequest}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />:<></>} */}
            {data ? (
              <Table
                columns={columns}
                dataSource={data}
                rowKey="request_id"
                pagination={{ pageSize: 3 }}
              />
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
      <Footer />
      {/* {details?<div style={{display:"none"}}><Details id={id}/></div>:<></>} */}
    </div>
  );
}

export default OpenRequest;
