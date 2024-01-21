import React, { useEffect, useState } from "react";
import { Button, Col,Input,Row, Select, Space, Table, message } from "antd";
import SideBar from "../SideBar";
import Header from "../Header";
import "../dashboard.css";
import Footer from "../Footer";
import "../tobeapproved.css";
import { useNavigate } from "react-router-dom";
import { allExpenseTravelRequestDashboard, allTravelRequestDashboard, getOpenRequest, getToBeApproved, getTotalRequest } from "../../services/ApiService";
import moment from "moment";
import { useDispatch } from "react-redux";
const formatColumnName = (columnName) => {
  const words = columnName.split('_');
  const formattedWords = words.map((word) =>
    word.charAt(0).toUpperCase() + word.slice(1)
  );
  return formattedWords.join(' ');
};

const { Option } = Select;
function ToBeApprovedExpense() {
  const [collapsed, setCollapsed] = useState(false);
  const [details,setDetails]=useState(false)
  const[id,setId]=useState()
  const[totalRequest,setTotalRequest]= useState([])
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
const navigate= useNavigate()
const dispatch= useDispatch()
  const empId=sessionStorage.employeeId
 useEffect(() => {
 
allExpenseTravelRequestDashboard(empId).then((res)=>{
    if(res.responseCode===200){
        const dataSource = res.data.toBeApproved.map(item => {
            if (item.bill_date) {
              item.bill_date = moment(item.bill_date).format('DD-MM-YYYY');
            }
            return item;
          });
          
        if (res.data.toBeApproved.length > 0) {
          // Assuming all objects in the data array have the same keys
          const columnKeys = Object.keys(res.data.toBeApproved[0]);
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
                <Button onClick={() => handleDetailClick(record)}>Details</Button>
              ),
            },
          ]);
          setData(res.data.toBeApproved);
        }
        else{
          setData([])
          setColumns([])
        }
          setTotalRequest(res.data.toBeApproved)

    }
    else{
        message.error(res.responseMessage)
    }
})
  }, []);
  const handleDetailClick = (record) => {
 navigate('/details-expense', { state: { id: record.request_id,status:record.status  } });

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
          <div style={{backgroundColor:'white',display:'block',padding:'1rem',marginRight:'1.5rem',borderRadius:"15px",marginTop:'2rem',overflow:'auto',height:'70vh'}}>
      
   
        {data ?<Table
        scroll={{x:280}}
        pagination={{ pageSize: 3 }}
         columns={columns} dataSource={data} rowKey="request_id" />:<></>}
          </div>
        
        </Col>
      </Row>
      <Footer />
    </div>
  );
}

export default ToBeApprovedExpense;
