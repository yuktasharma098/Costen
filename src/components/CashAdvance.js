import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cashAdvance } from "../redux/actions";
import { cancelRequest, cashInAdvance, getCashInAdvance } from "../services/ApiService";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;
function CashAdvance({ triggerParentEffect }) {
  const [form] = Form.useForm();
  const requestid = useSelector((state) => state.requestedid);
  const requestName = useSelector((state) => state.travelHeader.requestName);
  const dispatch = useDispatch();

  const requestedid = useSelector((state) => state.requestedid);

  const userType = sessionStorage.getItem('userType')
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  // const isFirstRun = useRef(true);
  const requestPolicy = useSelector(
    (state) => state.travelHeader.requestPolicy
  );

  useEffect(() => {
    // if (isFirstRun.current) {
    //   isFirstRun.current = false;
    //   return;
    // }
    if (requestedid) {
      getCashInAdvance(requestid, "travel", requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          if (res.data) {
            form.setFieldsValue({
              cashAdvance: res.data?.cashInAdvance,
              reason: res.data?.reasonCashInAdvance,
            });
            let reduxobj = {
              cashAdvance: res.data?.cashInAdvance,
              reason: res.data?.reasonCashInAdvance,
            }
            dispatch(cashAdvance(reduxobj))
          }

        }


      })
    }
    else {
      message.info("Please Save Travel Header")
    }
  }, [])

  const onFinish = (value) => {
    let body = {
      requestId: requestedid,
      cash_in_advance: value.cashAdvance,
      reason_cash_in_advance: value.reason,
      employeeCode: value.employeeCountryCode,
      currency: value.currency,
    };
    if (Object.values(value).some((value) => value !== null && value !== "" && !isNaN(value))
    ) {
      cashInAdvance(body, requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          message.success("Saved");
          triggerParentEffect(body);
        } else {
          message.error(res.responseMessage);
        }
      });
      dispatch(cashAdvance(value));

    }
    else {
      message.error("Add full data for cash advance to save")
    }
  };
  const onCancel = () => {
    setOpen(true)

  }
  const onSubmit = () => {
    setOpen(false)
    let body = {

      requestId: requestid

    }
    if (requestid) {
      cancelRequest(body).then((res) => {
        if (res.responseCode === 200) {
          message.success("Canceled the Request Successfully")

          if (userType == "1") {
            navigate("/dashboard-m")
          }
          else {
            navigate("/dashboard")
          }

        }
        else {
          message.error(res.responseMessage)
        }
      })
    }
    else {
      if (userType == "1") {
        navigate("/dashboard-m");
      } else {
        navigate("/dashboard");
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
      <Form form={form} onFinish={onFinish} layout="horizontal">
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
                {requestid ? requestid : ""}
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
                {requestName ? requestName : ""}
              </span>
            </div>
          </div>
          <Row>
            <Col lg={8}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                  Cash Advance Amount
                </label>
                <Form.Item name="cashAdvance" rules={[{ required: true, message: "Please Enter Amount" }]}>
                  <InputNumber
                    style={{ width: "70%" }}
                    placeholder="Enter Amount"
                  />
                </Form.Item>
              </div>
            </Col>
            <Col lg={15}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                  Cash Advance Reason
                </label>
                <Form.Item name="reason" rules={[{ required: true, message: "Please Enter the reason" }]}>
                  <TextArea
                    rows={6}
                    placeholder="Describe the reason for cash advance"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div style={{ display: "flex", flexDirection: "row", gap: "3rem" }}>

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
            onClick={() => onCancel()}

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

export default CashAdvance;
