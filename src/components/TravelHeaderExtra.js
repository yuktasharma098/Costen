import { Button, Form, Input, Modal, Select, message } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { travelHeader, requesteid } from "../redux/actions";
import {
  cancelRequest,
  getTravelRequest,
  requestPolicy,
  travelRequest,
} from "../services/ApiService";
import "./datepicker.css";
import { useNavigate } from "react-router-dom";
function TravelHeaderExtra({ onDataUpdate }) {
  const dispatch = useDispatch();
  const requestid = useSelector((state) => state.requestedid);
const[open,setOpen]=useState(false)
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [requestId, setRequestId] = useState();
  const [requestName, setRequestName] = useState();
  const name = useSelector((state) => state.travelHeader.requestName);
  const [policy, setPolicy] = useState([]);
  const [otherExpenseVisible, setOtherExpenseVisible] = useState();
const userType=sessionStorage.getItem('userType')
const navigate=useNavigate()
  useEffect(() => {
    const datesArray = [];
    requestPolicy()
      .then((res) => {
        if (res.responseCode === 200) {
          setPolicy(res.data);
          if (requestid) {
            getTravelRequest(requestid,"travel").then((response) => {
              if (response.responseCode === 200) {
                let per = res.data?.filter(
                  (item) => item.label === response.responseData.requestPolicy
                );
                sessionStorage.setItem("cashAdvance", per[0].cashAdvance);
                sessionStorage.setItem(
                  "internationalRoaming",
                  per[0].internationRoaming
                );
                sessionStorage.setItem(
                  "incidentCharges",
                  per[0].incidentCharges
                );
                setPerDiemVisible(per[0].perDiem);
                setCashAdvanceVisible(per[0].cashAdvance);
                setOtherExpenseVisible(per[0].otherExpense);
                onDataUpdate(
                  per[0].perDiem,
                  per[0].cashAdvance,
                  per[0].otherExpense
                );

                form.setFieldsValue({
                  requestName: response.responseData.requestName,
                  requestPolicy: response.responseData.requestPolicy,
                  purpose: response.responseData.purpose,
                });
                setStartDate(new Date(response.responseData.startDate));
                setEndDate(new Date(response.responseData.endDate));
                const inputStartDate = new Date(response.responseData.startDate);

                const year = inputStartDate.getFullYear();
                const month = (inputStartDate.getMonth() + 1).toString().padStart(2, "0");
                const day = inputStartDate.getDate().toString().padStart(2, "0");
                const formattedStartDate = `${year}-${month}-${day}`;
                const inputEndDate = new Date(response.responseData.endDate);
            
                const yearend = inputEndDate.getFullYear();
                const monthend = (inputEndDate.getMonth() + 1).toString().padStart(2, "0");
                const dayend = inputEndDate.getDate().toString().padStart(2, "0");
                const formattedEndDate = `${yearend}-${monthend}-${dayend}`;
                sessionStorage.setItem("requestPolicy",response.responseData.requestPolicy)
                if(formattedStartDate&&formattedEndDate){
                    const currentDate = new Date(response.responseData.startDate);
              
                    while (currentDate <= new Date(response.responseData.endDate)) {
                      datesArray.push(currentDate.toISOString().split("T")[0]);
                      currentDate.setDate(currentDate.getDate() + 1);
                    }
                    
                }
              let  obj = {
                  requestName: response.responseData.requestName,
             
                  requestPolicy:response.responseData.requestPolicy,
                  startDate: new Date(response.responseData.startDate),
                  endDate:new Date(response.responseData.endDate),
                  purpose: response.responseData.purpose,
                  dates: datesArray,
                };
            
                dispatch(travelHeader(obj));
                //   setStartDate(formattedDate)
              } else {
              }
            });
          }
        } else {
          message.error(res.responseMessage);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  }, [form]);
  useEffect(() => {
    const travelName =
      sessionStorage.getItem("T") === "I"
        ? "IR"
        : sessionStorage.getItem("T") === "D"
        ? "DR"
        : "";

    const currentDate = new Date();
    const empid = sessionStorage.getItem("employeeId");
    const nameParts =
      sessionStorage.getItem("username") &&
      sessionStorage.getItem("username").split(" ");
    const first = nameParts && nameParts[0].charAt(0);
    const last = nameParts && nameParts.slice(1).join(" ").charAt(0);
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear()).slice(-2);
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    const formattedDateTime = `${day}${month}${year}${hours}${minutes}${seconds}`;
    const full = travelName + first + last + formattedDateTime;
    // const id = travelName + empid + formattedDateTime;
    setRequestId(full);
  }, []);
  // function disabledDate(current) {
  //   const currentDate = new Date().setHours(0, 0, 0, 0);
  //   return current && current.valueOf() < currentDate;
  // }

  const Saved = (value) => {
    const datesArray = [];

    const inputStartDate = new Date(startDate);

    const year = inputStartDate.getFullYear();
    const month = (inputStartDate.getMonth() + 1).toString().padStart(2, "0");
    const day = inputStartDate.getDate().toString().padStart(2, "0");
    const formattedStartDate = `${year}-${month}-${day}`;
    const inputEndDate = new Date(endDate);

    const yearend = inputEndDate.getFullYear();
    const monthend = (inputEndDate.getMonth() + 1).toString().padStart(2, "0");
    const dayend = inputEndDate.getDate().toString().padStart(2, "0");
    const formattedEndDate = `${yearend}-${monthend}-${dayend}`;
    let obj;
    sessionStorage.setItem("requestPolicy",value.requestPolicy)
    if(formattedStartDate&&formattedEndDate){
        const currentDate = new Date(startDate);
  
        while (currentDate <= endDate) {
          datesArray.push(currentDate.toISOString().split("T")[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
    }
    let body = {
      employeeId: sessionStorage.getItem("employeeId"),
      organization: sessionStorage.getItem("organization"),
      requestId: requestid ? requestid : requestId,
      requestName: value.requestName,
      requestPolicy: value.requestPolicy,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      purpose: value.purpose,
      status: "initiated",
    };
    obj = {
      requestName: requestName,
      requestName: value.requestName,
      requestPolicy: value.requestPolicy,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      purpose: value.purpose,
      dates: datesArray,
    };
    if(!requestid ||requestid==""){
      dispatch(requesteid(requestId));

    }
    if(      Object.values(body).some((value) => value !== null && value !== "" )){
      dispatch(travelHeader(obj));
      travelRequest(body).then((res) => {
        if (res.responseCode === 200) {
          message.success("Saved");
        } else {
          message.error(res.responseMessage);
        }
      });
    }
else{
  message.error("Please Enter all fields as all are important fields")
}

  };

  const [perDiemVisible, setPerDiemVisible] = useState();
  const [cashAdvanceVisible, setCashAdvanceVisible] = useState();
  const onChange = (e) => {
    let per = policy?.filter((item) => item.label === e);

    sessionStorage.setItem("cashAdvance", per[0].cashAdvance);
    sessionStorage.setItem("internationalRoaming", per[0].internationRoaming);
    sessionStorage.setItem("incidentCharges", per[0].incidentCharges);
    setPerDiemVisible(per[0].perDiem);
    setCashAdvanceVisible(per[0].cashAdvance);
    setOtherExpenseVisible(per[0].otherExpense);
    onDataUpdate(per[0].perDiem, per[0].cashAdvance, per[0].otherExpense);
  };

  // -----------------------------------------------------------------------

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const isFormValid = startDate !== null && endDate !== null;

  const today = new Date();
const onCancel=()=>{
  setOpen(true)
 
}
const onSubmit=()=>{
  setOpen(false)
  let body={
    
    requestId: requestid

}
if(requestid){
  cancelRequest(body).then((res)=>{
    if(res.responseCode===200){
      message.success("Canceled the Request Successfully")

      if(userType=="1"){
        navigate("/dashboard-m")
      }
      else{
        navigate("/dashboard")
      }

    }
    else{
      
  
      message.error(res.responseMessage)
    }
      })
}
else{
  
  if(userType=="1"){
    navigate("/dashboard-m")
  }
  else{
    navigate("/dashboard")
  }
  message.error("Data is not Saved Yet")
}

}
  return (
    <div
      style={{
        backgroundColor: "white",
        margin: "1.5rem 1.5rem 0 0",
        display: "flex",
        justifyContent: "flex-start",
        borderRadius: "5px",
        padding: "1rem 1rem 1rem 2rem",
        flexDirection: "column",
      }}
    >
      <Form form={form} onFinish={Saved} layout="horizontal">
        <div
          style={{
            height: "54vh",
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "5rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontWeight: "600" }}>Request ID :</span>
              <span style={{ color: "#3052D0", fontWeight: "500" }}>
                {requestid ? requestid : requestId}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontWeight: "600" }}>Request Name :</span>
              <span style={{ color: "#3052D0", fontWeight: "500" }}>
                {requestName || name ? requestName || name : ""}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "3rem" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                Request Name
              </label>
              <Form.Item
                name="requestName"
                rules={[
                  { required: true, message: "Please Enter Request Name" },
                ]}
              >
                <Input
                  value={name ? name : ""}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="Enter Request Name"
                />
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                Request Policy
              </label>
              <Form.Item
                name="requestPolicy"
                rules={[{ required: true, message: "Please Select Policy" }]}
              >
                <Select
                  onChange={(e) => onChange(e)}
                  style={{ width: "20vw" }}
                  placeholder="Select Request Policy"
                >
                  {policy?.map((option) => (
                    <Select.Option key={option.label} value={option.label}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                Start Date
              </label>
              <Form.Item
                rules={[
                  { required: true, message: "Please Enter Request Name" },
                ]}
              >
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  required
                  minDate={today} // Disable dates before today
                  className="form-control"
                  placeholderText="Select Start Date"
                />
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                End Date
              </label>
              <Form.Item
                rules={[{ required: true, message: "Please Enter End Date" }]}
              >
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  required
                  minDate={startDate || today} // Disable dates before start date or today
                  className="form-control"
                  placeholderText="Select End Date"
                />
              </Form.Item>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
              Purpose
            </label>
            <Form.Item
              name="purpose"
              rules={[{ required: true, message: "Please Enter Policy" }]}
            >
              <TextArea rows={4} placeholder="Please breif your Purpose" />
            </Form.Item>
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}
        >
          <Button
            style={{
              width: "8.5rem",
              backgroundColor: "#3052D0",
              border: "none",
              color: "white",
            }}
            htmlType="submit"
            disabled={!isFormValid}
          >
            Save
          </Button>
   
          <Button
            style={{
              width: "8.5rem",
              backgroundColor: "transparent",
              border: "1px solid red",
              color: "red",
            }}
            onClick={()=>onCancel()}
          >
            Cancel
          </Button>
        </div>
      </Form>
      <Modal
        open={open}
        title="Are you sure, want to Cancel the whole request"
         onCancel={() => setOpen()}
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

export default TravelHeaderExtra;
