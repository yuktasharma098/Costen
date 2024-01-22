import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import "./carrental.css";
import { carRental } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { cancelRequest, clearRequest, postTransport} from "../services/ApiService";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
function formatDate(date) {
  if (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return "";
}
function CarRentals({triggerParentEffect}) {
  const requestid = useSelector((state) => state.requestedid);
  const [form] = Form.useForm();
  const userType=sessionStorage.getItem('userType')
  const navigate=useNavigate()
  const[open,setOpen]=useState(false)
  const carRentalData = useSelector((state) => state.carRental);
  const dispatch = useDispatch();
  const requestPolicy = useSelector((state) => state.travelHeader.requestPolicy);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const today = new Date();
  const onFinish = (value) => {
    let formatStartDate = formatDate(startDate);
    let formatEndDate = formatDate(endDate);

    let obj = {
      requestId: requestid,
      employeeId: sessionStorage.getItem("employeeId"),
      transportType: "carRental",
      estimateCost: value.estimateCostCarRental,
      comment: value.comment1,
      startDate: formatStartDate,
      endDate: formatEndDate,
    };
    if(Object.values(obj).some((value) => value !== null && value !== "" && value!==undefined && ! isNaN(value))){
      postTransport("carRental", obj,requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          message.success("Car Rental Data Saved Succesfully");
          triggerParentEffect(obj);

        
        } else {
          message.error(res.responseMessage);
        }
      });
      let reduxobj={
        transportType: "carRental",
        estimateCost: value.estimateCostCarRental,
        comment: value.comment1,
        startDate: formatStartDate,
        endDate: formatEndDate,
      }
      dispatch(carRental(reduxobj));
    }
   else{
    message.error("Add full data for car rental to save")
   }
  };

  useEffect(() => {
    if (Object.keys(carRentalData).length>0) {
      form.setFieldsValue({
        estimateCostCarRental: carRentalData.estimateCost,
        comment1: carRentalData.comment,
      });
      setStartDate(new Date(carRentalData.startDate));
      setEndDate(new Date(carRentalData.endDate));
    }
  }, []);
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
    if (userType == "1") {
      navigate("/dashboard-m");
    } else {
      navigate("/dashboard");
    }
    message.error("Data is not Saved Yet")
  }
  
  }
  const onClear=()=>{
    if (requestid) {
      form.resetFields();
      setStartDate(null);
      setEndDate(null);
      let body = {
        requestId: requestid,
        requestType: "transport",
        transportType: "carRental",
      };
      clearRequest(body).then((res) => {
        if (res.responseCode === 200) {
          dispatch(carRental({}));
          triggerParentEffect(body);
          message.success("Car Rental Data Cleared Successfully");
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      message.error("Please Save Travel Header Data");
    }
  }
  return (
    <Form form={form} onFinish={onFinish}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "3rem",
          flexWrap: "wrap",
        }}
      >
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
            rules={[{ required: true, message: "Please Enter Request Name" }]}
          >
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              // required
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
              // required
              minDate={startDate || today} // Disable dates before start date or today
              className="form-control"
              placeholderText="Select End Date"
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
            Estimate Cost for Car Rental
          </label>
          <Form.Item className="custom-form-item" name="estimateCostCarRental">
            <InputNumber
              style={{ width: "100%" }}
              className="custom-radio-group"
              placeholder="Enter Amount"
            />
          </Form.Item>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",

        }}
      >
        <label style={{ color: "#2F3D4C", fontWeight: "600" }}>Comment</label>
        <Form.Item className="custom-form-item" name="comment1">
          <TextArea
            className="custom-radio-group"
            rows={4}
            placeholder="Please describe the taxi cost details here"
          />
        </Form.Item>
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

            //   onClick={handleSave}
          >
            Save
          </Button>
          <Button
            style={{
              width: "8.5rem",
              backgroundColor: "red",
              border: "none",
              color: "white",
            }}
            onClick={onClear}
          >
            Clear
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
      </div>
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
    </Form>
  );
}

export default CarRentals;
