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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { taxi } from "../redux/actions";
import {
  cancelRequest,
  clearRequest,
  postTransport,
} from "../services/ApiService";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;
function Taxis({triggerParentEffect}) {
  const userType = sessionStorage.getItem("userType");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const requestid = useSelector((state) => state.requestedid);
  const taxiData = useSelector((state) => state.taxi);
  const requestPolicy = useSelector((state) => state.travelHeader.requestPolicy);

  const onFinish = (value) => {

    let obj = {
      requestId: requestid,
      employeeId: sessionStorage.getItem("employeeId"),
      transportType: "taxi",
      estimateCost: value.estimateCost,
      comment: value.comment,
    };

    if (
      Object.values(obj).some(
        (value) =>
          value !== null && value !== "" && value !== undefined && !isNaN(value)
      )
    ) {
      postTransport("taxi", obj,requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          message.success("Taxi Data Saved Succesfully");
          triggerParentEffect(obj);
        } else {
          message.error(res.responseMessage);
        }
      });
      let reduxobj = {
        transportType: "taxi",
        estimateCost: value.estimateCost,
        comment: value.comment,
      };
      dispatch(taxi(reduxobj));
    } else {
      message.error("Add full data for taxi to save");
    }
  };

  useEffect(() => {
    if (Object.keys(taxiData).length > 0) {
      form.setFieldsValue({
        estimateCost: taxiData.estimateCost,
        comment: taxiData.comment,
      });
    }
  }, []);
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
  const onClear = () => {
    if (requestid) {
      form.resetFields();
      let body = {
        requestId: requestid,
        requestType: "transport",
        transportType: "taxi",
      };
      clearRequest(body).then((res) => {
        if (res.responseCode === 200) {
          dispatch(taxi({}));
          triggerParentEffect(body);
          message.success("Taxi Data Cleared Successfully");
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      message.error("Please Save Travel Header Data");
    }
  };
  return (
    <div
      style={{
        backgroundColor: "white",
        display: "flex",
        justifyContent: "flex-start",
        borderRadius: "5px",
        flexDirection: "column",
      }}
    >
      <Form form={form} onFinish={onFinish}>
        <div
          style={{
            height: "40vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Row style={{ marginTop: "1rem" }}>
            <Col span={10}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginLeft: "2rem",
                }}
              >
                <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                  Estimate Cost for Taxi
                </label>
                <Form.Item name="estimateCost">
                  <InputNumber
                    style={{ width: "65%" }}
                    placeholder="Enter Amount"
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={14}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                  Comment
                </label>
                <Form.Item required name="comment">
                  <TextArea
                    rows={4}
                    placeholder="Please describe the taxi cost details here"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
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

export default Taxis;
