import { Button, Col, Form, Modal, Row, Switch, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  cancelRequest,
  getOtherExpense,
  postOtherExpense,
} from "../services/ApiService";
import { useNavigate } from "react-router-dom";

function OtherExpense({triggerParentEffect}) {
  const [form] = Form.useForm();
  const requestid = useSelector((state) => state.requestedid);
  const requestName = useSelector((state) => state.travelHeader.requestName);
  const [incident, setIncident] = useState(false);
  const [international, setInternational] = useState(false);
  const userType = sessionStorage.getItem("userType");
  const navigate = useNavigate();
  const isFirstRun = useRef(true);
  const [open, setOpen] = useState(false);
  const requestPolicy = useSelector((state) => state.travelHeader.requestPolicy);

  const internationRoamingVisibility = sessionStorage.getItem("T");
  const intRoamingVisibility = JSON.parse(
    sessionStorage.getItem("internationalRoaming")
  );
  const incidentChargesVisibility = JSON.parse(
    sessionStorage.getItem("incidentCharges")
  );
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (requestid) {
      getOtherExpense(requestid, "travel",requestPolicy)
        .then((res) => {
          if (res.responseCode === 200) {
            if (res.data) {
              setIncident(res.data.incidentExpense === 1 ? true : false);
              setInternational(
                res.data.internationalRoaming === 1 ? true : false
              );
              form.setFieldsValue({
                IncidentExpense: res.data.incidentExpense === 1 ? true : false,
                InternaitonalRoaming:
                  res.data.internationalRoaming === 1 ? true : false,
              });
            }
          } else {
            message.error(res.responseMessage);
          }
        })
        .catch((error) => {
          message.error(error);
        });
    } else {
      message.info("Please save Travel Header");
    }
  }, [form]);
  const onFinish = (value) => {

    let body = {
      requestId: requestid,
      internationalRoaming: value.InternaitonalRoaming ? 1 : 0,
      incidentExpense: value.IncidentExpense ? 1 : 0,
    };
    postOtherExpense(body,requestPolicy).then((res) => {
      if (res.responseCode === 200) {
        triggerParentEffect(body)
        message.success("Saved");
      } else {
        message.error(res.responseMessage);
      }
    });
  };
  const onCancel = () => {
    setOpen(true);
  };
  const onSubmit = () => {
    setOpen(false);
    let body = {
      requestId: requestid,
    };
    if (requestid) {
      cancelRequest(body).then((res) => {
        if (res.responseCode === 200) {
          message.success("Canceled the Request Successfully");

          if (userType == "1") {
            navigate("/dashboard-m");
          } else {
            navigate("/dashboard");
          }
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      if (userType == "1") {
        navigate("/dashboard-m");
      } else {
        navigate("/dashboard");
      }
      message.error("Data is not Saved Yet");
    }
  };
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
      <Form form={form} layout="horizontal" onFinish={onFinish}>
        <div
          style={{
            height: "54vh",
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

          <div style={{ marginTop: "3.5rem" }}>
            <span
              style={{
                padding: "0",
                margin: "0",
                fontWeight: "600",
                marginBottom: "0.2rem",
              }}
            >
              Other Expense
            </span>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <Row>
              {internationRoamingVisibility === "I" && intRoamingVisibility ? (
                <Col span={12}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Form.Item
                      name="InternaitonalRoaming" // Replace with your actual name for the Switch field
                      valuePropName="checked" // This ensures the value is a boolean
                    >
                      <Switch size="small" />
                    </Form.Item>
                    <span
                      style={{
                        color: "#7B809A",
                        marginTop: "0.4rem",
                        marginLeft: "0.7rem",
                      }}
                    >
                      International Roaming
                    </span>
                  </div>
                </Col>
              ) : (
                <></>
              )}
              {incidentChargesVisibility ? (
                <Col span={12}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Form.Item
                      name="IncidentExpense" // Replace with your actual name for the Switch field
                      valuePropName="checked" // This ensures the value is a boolean
                    >
                      <Switch size="small" />
                    </Form.Item>
                    <span
                      style={{
                        color: "#7B809A",
                        marginTop: "0.4rem",
                        marginLeft: "0.7rem",
                      }}
                    >
                      Incident Expense{" "}
                      <span style={{ fontSize: "12px", color: "#3052D0" }}>
                        {" "}
                        (*can only be checked if trip is more than 10 days)
                      </span>
                    </span>
                  </div>
                  {/* <Form.Item
      name="switchFieldName1" // Replace with your actual name for the Switch field
      valuePropName="checked" // This ensures the value is a boolean
    >
          <Switch style={{marginRight:'0.5rem'}} size="small"/>
            <span style={{color: "#7B809A"}}>Incident Expense</span>
            <span  style={{ fontSize: "12px", color:'#3052D0' }}> (*can only be checked if trip is more than 10 days)</span>
          </Form.Item> */}
                </Col>
              ) : (
                <></>
              )}
            </Row>
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

export default OtherExpense;
