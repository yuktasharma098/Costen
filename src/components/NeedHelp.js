import React, { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Row, message } from "antd";
import SideBar from "./SideBar";
import Header from "./Header";
import "./dashboard.css";
import Footer from "./Footer";
import { Select } from "antd";
import "./FaqSearch.css"; // Import your custom CSS file for styling
import { getNeedHelp, writeToUs } from "../services/ApiService";
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
  amount,
  claimno
} from "../redux/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const { Option } = Select;
const { TextArea } = Input;
function NeedHelp() {
  const [collapsed, setCollapsed] = useState(false);
const dispatch=useDispatch()
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
    dispatch(claimno(""));
    dispatch(amount(0));
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [data, setData] = useState([]);
  const [sortedquestions, setSortedQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const selectedFAQ = data?.find((item) => item.Question === value);
    setSelectedAnswer(selectedFAQ ? selectedFAQ.Answer : null);
  };
  useEffect(() => {
    getNeedHelp().then((res) => {
      if (res.responseCode === 200) {
        setData(res.data);
        const sortedQuestions = res.data.map((item) => item.Question).sort();
        setSortedQuestions(sortedQuestions);
      }
    });
  }, []);
  const handleModalOk = () => {
    // Handle form submission or any other logic here

    setModalVisible(false);
    let obj={ 
      employeeEmail: sessionStorage.getItem("emailId"),
      requestMessage: userQuestion
  }
  writeToUs(obj).then((res)=>{
    if(res.responseCode===200){
      message.success("Query registered successfully")
      setUserQuestion("")
    }
    else{
      message.error(res.requestMessage)
    }
  })
  };

  const handleModalCancel = () => {
    // Clear the user's question when the modal is canceled
    setUserQuestion("");
    setModalVisible(false);
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
          {/* <div style={{display:'flex',flexDirection:'column',gap:'0.9rem',marginTop:'3rem'}}>
            <label style={{fontSize:'15px',fontWeight:'600'}}>
                Expense Type
            </label>
            <div style={{display:'flex',flexDirection:'row',gap:'1.5rem'}}>
            <Input
            style={{height:'3rem',borderRadius:'30rem',width:'50vw'}}
        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)',fontSize:'20px',marginLeft:'1rem' }} />} // Add the icon as a prefix
        placeholder=" Enter your Queries here..."
      />
      <Button style={{height:'3rem',width:'7rem',borderRadius:'30rem',backgroundColor:'#3052D0',color:'white'}}>Search</Button>
            </div>
        </div> */}
      
            {/* <h1>FAQ</h1> */}
<Row style={{height:'60vh'}}>
<div>
            <Select
              showSearch
              style={{ marginTop: "2.5rem", height: "8vh", width: "70vw" }}
              // style={{ width: 300 }}
              placeholder="Search for a question..."
              optionFilterProp="children"
              onChange={handleSearchChange}
              value={searchTerm || undefined} // Use undefined to show the placeholder when searchTerm is empty
            >
              {sortedquestions?.map((question, index) => (
                <Option key={index} value={question}>
                  {question}
                </Option>
              ))}
            </Select>
            {selectedAnswer && (
              <div className="answer-container" style={{overflow:'auto'}}>

                <strong>{searchTerm}</strong>
                <p>{selectedAnswer}</p>
                </div>
            )}
            </div>
       
</Row>
<Row>
<div style={{marginTop:'10vh',marginLeft:'64vw'}}>
            <Link onClick={()=>setModalVisible(true)} style={{fontWeight:'700',fontSize:'15px',position:'absolute'}}>Write To Us ?</Link>
          </div>
</Row>
  
      
       

        </Col>
      </Row>
      <Footer />
      <Modal
        title="Write To Us"
        open={modalVisible}
        // onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <Button key="submit" type="primary" onClick={()=>handleModalOk()}>
            Send Email
          </Button>,
          <Button onClick={() =>handleModalCancel()}>Cancel</Button>,
        ]}
      >
        <p>Please type your query below:</p>
        <TextArea
             value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
            rows={4}
            placeholder="Write your query here..."
          />
     
      </Modal>

    </div>
  );
}

export default NeedHelp;
