import React, { useEffect, useState } from "react";
import { Button, Col, Row, Select, Table, message } from "antd";
import SideBar from "../../SideBar";
import Header from "../../Header";
import "../../dashboard.css";
import Footer from "../../Footer";
import "../../tobeapproved.css";
import { useNavigate } from "react-router-dom";
import { allTravelRequestDashboard, pull, pullRequestList } from "../../../services/ApiService";
import moment from "moment";
import { requesteid } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { faL } from "@fortawesome/free-solid-svg-icons";
const formatColumnName = (columnName) => {
  const words = columnName.split("_");
  const formattedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return formattedWords.join(" ");
};

const { Option } = Select;
function ListOfPullRequest() {
  const [collapsed, setCollapsed] = useState(false);

  const [totalRequest, setTotalRequest] = useState([]);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const empId = sessionStorage.employeeId;
  useEffect(() => {
  
     pullRequestList(empId).then((res) => {
      if (res.responseCode === 200) {
        const dataSource = res.data.approvedRequest.map((item) => {
          if (item.start_date) {
            item.start_date = moment(item.start_date).format("DD-MM-YYYY");
          }
          return item;
        });

        if (res.data.approvedRequest.length > 0) {
          const columnKeys = Object.keys(res.data.approvedRequest[0]);
          const dynamicColumns = columnKeys.map((key) => ({
            title: formatColumnName(key),
            dataIndex: key,
            key,
          }));

          setColumns([
            ...dynamicColumns,
            {
              title: "Pull Request",
              key: "pullRequest",
              render: (text, record) => (
                <Button onClick={() => handlePullClick(record)}>Pull</Button>
              ),
            },
          ]);
          setData(res.data.approvedRequest);
        }
        setTotalRequest(res.data.approvedRequest);
      } else {
        message.error(res.responseMessage);
      }
    });
  }, []);
  const handlePullClick = (record) => {
    let body={
      requestId:record.request_id,
      employeeId:empId
    }
    pull(body).then((res)=>{
     if(res.responseCode===200){
      if (record.request_id.charAt(0) == "D") {
        sessionStorage.setItem("T", "D");
        dispatch(requesteid(record.request_id));
        navigate("/pull-travel-page");
      } else if (record.request_id.charAt(0) == "I") {
        sessionStorage.setItem("T", "I");
        dispatch(requesteid(record.request_id));
        navigate("/pull-travel-page");
      }
     }
     else{
      message.error(res.responseMessage)
     }
    })
   
  };
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
          <Header expense={true} travel={false} />
          <div
            style={{
              backgroundColor: "white",
              display: "block",
              padding: "1rem",
              marginRight: "1.5rem",
              borderRadius: "15px",
              marginTop: "1rem",
              overflow: "auto",
            }}
          >
            {data ? (
                <Table
              
                  columns={columns}
                  dataSource={data}
                  rowKey="request_id"
                  scroll={{y:280}}
                />
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  );
}

export default ListOfPullRequest;
