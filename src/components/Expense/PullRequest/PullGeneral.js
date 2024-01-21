import { Button, Col, Form, Input, Modal, Row, Spin, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { general } from "../../../redux/actions";
import {
  ExpenseCancelRequest,
  cancelRequest,
  generalRequest,
  getExpenseGeneralData,
  getgeneralData,
  submitExpenseRequest,
  submitTravelRequest,
} from "../../../services/ApiService";
import "../../general.css";
import { useNavigate } from "react-router-dom";
function PullGeneral() {
  const requestid = useSelector((state) => state.requestedid);
  const requestName = useSelector((state) => state.travelHeader.requestName);
  const [objData, setObjData] = useState({});
  const [cost, setCost] = useState(undefined);
  const [open, setOpen] = useState(false);
  const userType = sessionStorage.getItem("userType");
  const isFirstRun = useRef(true);
  const [openCancel, setOpenCancel] = useState(false);
  const navigate = useNavigate();
  const[spinner,setSpinner]=useState(false)
  const requestPolicy = useSelector(
    (state) => state.travelHeader.requestPolicy
  );

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (requestid) {
      getExpenseGeneralData(requestid).then((res) => {
        if (res.responseCode === 200) {
          const data = res.data;
          setCost(data.cost_center);
          delete data["cost_center"];
          setObjData(data);
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      message.info("Please Save Travel Header");
    }
  }, [requestid]);
  const dispatch = useDispatch();
  const onSave = (value) => {
    let body = {
      requestId: requestid,
      costCenter: value.costCenter ? value.costCenter : cost,
    };
    generalRequest(body, requestPolicy).then((res) => {
      dispatch(general(value));
      if (res.responseCode === 200) {
        message.success("Saved");
      } else {
        message.error(res.responseMessage);
      }
    });
  };
  function convertToTitleCase(inputString) {
    return inputString
      .split("_")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  function KeyValueGrid({ data }) {
    return (
      <Row>
        {Object.keys(data).map((key) => (
          <Col span={8} key={key}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontWeight: "500" }}>
                {convertToTitleCase(key)}:
              </span>
              <span>{data[key]}</span>
            </div>
          </Col>
        ))}
      </Row>
    );
  }
  const isDefaultValue = cost;
  const onSubmit = () => {
    setOpen(false);
    setSpinner(true)
    submitExpenseRequest(requestid).then((res) => {
      if (res.responseCode === 200) {
        setSpinner(false)
        message.success("Thank You for Submitting the request");
        navigate("/dashboard-expense");
      } else {
        setSpinner(false)
        message.error(res.responseMessage);
      }
    });
  };
  const onCancel = () => {
    setOpenCancel(true);
  };
  const onSubmitCancel = () => {
    setOpenCancel(false);
    let body = {
      requestId: requestid,
    };
    if (requestid) {
      ExpenseCancelRequest(body).then((res) => {
        if (res.responseCode === 200) {
          message.success("Canceled the Request Successfully");
          navigate("/dashboard-expense");
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      navigate("/dashboard-expense");

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
      <Spin spinning={spinner} tip="Submitting" size="large">
      <Form onFinish={onSave} layout="horizontal">
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
              marginBottom: "0.6rem",
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

          <Form.Item
            name="costCenter"
            rules={[
              {
                required: !isDefaultValue,
                message: "Please Enter Cost Center",
              },
            ]}
          >
            {cost ? (
              <Input
                disabled
                placeholder="Enter Cost Center"
                style={{ width: "20%" }}
                defaultValue={cost}
              />
            ) : (
              <></>
            )}
          </Form.Item>

          <KeyValueGrid data={objData} />
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}
        >
          {/* <Button
            style={{
              width: "8.5rem",
              backgroundColor: "#3052D0",
              border: "none",
              color: "white",
            }}
            htmlType="submit"
          >
            Save
          </Button> */}
          <Button
            onClick={() => setOpen(true)}
            style={{
              width: "8.5rem",
              backgroundColor: "#1A932E",
              border: "none",
              color: "white",
            }}
          >
            Submit
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
      </Spin>
      <Modal
        open={open}
        title="Sure want to Submit"
        onCancel={() => setOpen()}
        footer={[
          <Button key="submit" type="primary" onClick={onSubmit}>
            Yes
          </Button>,
          <Button onClick={() => setOpen(false)}>No</Button>,
        ]}
      ></Modal>
      <Modal
        open={openCancel}
        title="Are you sure, want to Cancel the whole request"
        onCancel={() => setOpenCancel()}
        footer={[
          <Button key="submit" type="primary" onClick={onSubmitCancel}>
            Yes
          </Button>,
          <Button onClick={() => setOpenCancel(false)}>No</Button>,
        ]}
      ></Modal>
    </div>
  );
}

export default PullGeneral;
