import React, { useEffect, useState } from "react";
import { Button, Col,Modal,Row, Table, message } from "antd";
import SideBar from "./SideBar";
import Header from "./Header";
import "./dashboard.css";
import Footer from "./Footer";
import "./tobeapproved.css";
import { allTravelRequestDashboard, withdrawRequest } from "../services/ApiService";
import moment from "moment";
const formatColumnName = (columnName) => {
  // Convert snake_case to title case (e.g., request_id to Request Id)
  const words = columnName.split('_');
  const formattedWords = words.map((word) =>
    word.charAt(0).toUpperCase() + word.slice(1)
  );
  return formattedWords.join(' ');
};

function PendingRequest() {
  const [collapsed, setCollapsed] = useState(false);
  const[requestId,setRequestid]=useState()
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const[open,setOpen]=useState(false);
  const[apicall,setApicall]=useState()
  const empId=sessionStorage.employeeId
 useEffect(() => {
 setApicall(true)
 allTravelRequestDashboard(empId).then((res)=>{
    if(res.responseCode===200){
      res.data.pendingRequest.map(item => {
            // Format the "start_date" field to "dd-mm-yyyy"
            if (item.start_date) {
              item.start_date = moment(item.start_date).format('DD-MM-YYYY');
            }
            return item;
          });
          
        if (res.data.pendingRequest.length > 0) {
          // Assuming all objects in the data array have the same keys
          const columnKeys = Object.keys(res.data.pendingRequest[0]);
          const dynamicColumns = columnKeys.map((key) => ({
            title:  formatColumnName(key),
            dataIndex: key,
            key,
          }));

          setColumns([
            ...dynamicColumns,
            {
              title: 'Details',
              key: 'details',
              render: (text, record) => (
                <Button onClick={() => handleDetailClick(record)}>Withdraw</Button>
              ),
            },
          ]);
          setData(res.data.pendingRequest);
        }
        else{
          setData([])
          setColumns([])
        }

    }
    else{
        message.error(res.responseMessage)
    }
})
  }, [apicall]);
  const handleDetailClick = (record) => {
    setRequestid(record.request_id)

    setOpen(true)
  

  };
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
 const onSubmit=()=>{
  let body={
      
    requestId: requestId,
    status: "initiated"

}
setOpen(false)
withdrawRequest(body).then((res)=>{
  if(res.responseCode===200){
    message.success("Request Withdrawn successfully Please check the Request in Open Request Now")
    setApicall(body)

  }
  else{
    message.error(res.responseMessage)
  }
})
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
          <div style={{backgroundColor:'white',display:'block',padding:'1rem',marginRight:'1.5rem',borderRadius:"15px",marginTop:'2rem'}}>
      
        {/* {totalRequest?  <Table
                dataSource={totalRequest}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />:<></>} */}
        {data ?<Table pagination={{ pageSize: 3 }} columns={columns} dataSource={data} rowKey="request_id" />:<></>}
          </div>
        
        </Col>
      </Row>
      <Footer />
      {/* {details?<div style={{display:"none"}}><Details id={id}/></div>:<></>} */}
      <Modal
        open={open}
        title="Sure want to Withdraw the Request !!"
         onCancel={() => setOpen(false)}
        footer={[
          <Button key="submit" type="primary" onClick={onSubmit}>
            Yes
          </Button>,
          <Button onClick={() => setOpen(false)}>No</Button>,
        ]}
      ></Modal>
    </div>
  );
}

export default PendingRequest;
