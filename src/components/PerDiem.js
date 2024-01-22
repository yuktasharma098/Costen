import { Button, Col, Form, Modal, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { perdiem} from "../redux/actions";
import {
  cancelRequest,
  clearRequest,
  getPerDiem,
  perDiemRequest,
} from "../services/ApiService";
import { useNavigate } from "react-router-dom";

function PerDiem({triggerParentEffect}) {
  const requestid = useSelector((state) => state.requestedid);
  const requestName = useSelector((state) => state.travelHeader.requestName);
  const dates = useSelector((state) => state.travelHeader.dates);
  const dispatch = useDispatch();
  const [array, setArray] = useState([]);
  const userType = sessionStorage.getItem("userType");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const requestPolicy = useSelector(
    (state) => state.travelHeader.requestPolicy
  );

  useEffect(() => {
    getPerDiem(requestid, "travel",requestPolicy).then((res) => {
      if (res.responseCode === 200) {
        if (res.data) {
          if (res.data.length > 0) {
            const convertedArray = res.data.map((obj) => {
              const date = new Date(obj.date);
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, "0");
              const dd = String(date.getDate()).padStart(2, "0");

              return {
                date: `${yyyy}-${mm}-${dd}`,
                breakfast: obj.breakfast,
                lunch: obj.lunch,
                dinner: obj.dinner,
              };
            });
            setArray(convertedArray);
          } else {
            const arrayOfObjects = dates?.map((date) => ({
              date,
              breakfast: 0,
              lunch: 0,
              dinner: 0,
            }));
            setArray(arrayOfObjects);
          }
        }
      } else {
        message.error(res.responseMessage);
      }
    });
  }, []);
  const onFinish = (value) => {
    let body = {
      requestId: requestid,
      // international_roaming: value.InternaitonalRoaming
      //   ? parseInt(value.InternaitonalRoaming)
      //   : parseInt(0),
      // incident_expense: value.IncidentExpense
      //   ? parseInt(value.IncidentExpense)
      //   : parseInt(0),
      diems: array,
    };
    // dispatch(perdiemextra(value));
    // dispatch(perdiem(checkboxStates));
    perDiemRequest(body,requestPolicy).then((res) => {
      if (res.responseCode === 200) {
        triggerParentEffect(body);
        message.success("Saved");
      } else {
        message.error(res.responseMessage);
      }
    });
  };

  const handleCheckboxChange = (event, rowIndex, propertyName) => {
    const updatedData = [...array];
    updatedData[rowIndex][propertyName] = event.target.checked ? 1 : 0;
    setArray(updatedData);
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
  const onClear = () => {
    if (requestid) {
      const updatedData = array.map((item) => ({
        ...item,
        breakfast: 0,
        lunch: 0,
        dinner: 0,
      }));
      setArray(updatedData);
      let body = {
        requestId: requestid,
        requestType: "perdiem",
      };
      clearRequest(body).then((res) => {
        if (res.responseCode === 200) {
          dispatch(perdiem({}));
          triggerParentEffect(body);

          message.success("Data Cleared Successfully");
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      message.info("Please Save Travel Header Data");
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
      <Form onFinish={onFinish} layout="horizontal">
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
          <div style={{ display: "flex", flexDirection: "row", gap: "0.3rem" }}>
            <span style={{ fontWeight: "600" }}>Per Diem</span>
            <span style={{ fontSize: "12px", color: "#7B809A" }}>
              (*check mark only those box where it was paid by Company)
            </span>
          </div>
          <div>
            {dates && (
              <Row style={{ marginBottom: "0.3rem" }}>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                  span={6}
                >
                  Date
                </Col>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                  span={6}
                >
                  Breakfast
                </Col>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                  span={6}
                >
                  Lunch
                </Col>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                  span={6}
                >
                  Dinner
                </Col>
              </Row>
            )}
            <div style={{ height: "38vh", overflow: "auto" }}>
              {array?.map((item, index) => (
                <Row style={{ marginBottom: "0", paddingBottom: "0" }}>
                  <Col
                    style={{ display: "flex", justifyContent: "center" }}
                    span={6}
                  >
                    {item.date}
                  </Col>
                  <Col
                    style={{ display: "flex", justifyContent: "center" }}
                    span={6}
                  >
                    <input
                      type="checkbox"
                      checked={item.breakfast === 1}
                      onChange={(e) =>
                        handleCheckboxChange(e, index, "breakfast")
                      }
                    />
                  </Col>
                  <Col
                    style={{ display: "flex", justifyContent: "center" }}
                    span={6}
                  >
                    <input
                      type="checkbox"
                      checked={item.lunch === 1}
                      onChange={(e) => handleCheckboxChange(e, index, "lunch")}
                    />
                  </Col>
                  <Col
                    span={6}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <input
                      type="checkbox"
                      checked={item.dinner === 1}
                      onChange={(e) => handleCheckboxChange(e, index, "dinner")}
                    />
                  </Col>
                </Row>
              ))}
            </div>
          </div>
          {/* {dates && (
            <Row style={{ marginBottom: "0.3rem" }}>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "700",
                }}
                span={6}
              >
                Date
              </Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "700",
                }}
                span={6}
              >
                Breakfast
              </Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "700",
                }}
                span={6}
              >
                Lunch
              </Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "700",
                }}
                span={6}
              >
                Dinner
              </Col>
            </Row>
          )}

          <div
            style={{ marginTop: "1rem", height: "8.7rem", overflow: "auto" }}
          >
            {dates &&
              dates.map((item, index) => (
                <Row style={{ marginBottom: "0", paddingBottom: "0" }}>
                  <Col
                    style={{ display: "flex", justifyContent: "center" }}
                    span={6}
                  >
                    {item}
                  </Col>
                  <Col
                    style={{ display: "flex", justifyContent: "center" }}
                    span={6}
                  >
                    <input
                      key={"breakfast" + index}
                      type="checkbox"
                      id={"breakfast" + index}
                      checked={checkboxStates["breakfast" + index] || false}
                      onChange={() => handleCheckboxChange("breakfast" + index)}
                    />
                  </Col>
                  <Col
                    style={{ display: "flex", justifyContent: "center" }}
                    span={6}
                  >
                    <input
                      key={"lunch" + index}
                      type="checkbox"
                      id={"lunch" + index}
                      checked={checkboxStates["lunch" + index] || false}
                      onChange={() => handleCheckboxChange("lunch" + index)}
                    />
                  </Col>
                  <Col
                    span={6}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <input
                      key={"dinner" + index}
                      type="checkbox"
                      id={"dinner" + index}
                      checked={checkboxStates["dinner" + index] || false}
                      onChange={() => handleCheckboxChange("dinner" + index)}
                    />
                  </Col>
                </Row>
              ))}
          </div> */}
          {/* <div>
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
          </div> */}
          {/* <div>
            <Row>
              {internationRoamingVisibility==="I" && intRoamingVisibility?
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
              </Col>:<></>
              
              
              }
        {
          incidentChargesVisibility?  <Col span={12}>
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
                <Form.Item
        name="switchFieldName1" // Replace with your actual name for the Switch field
        valuePropName="checked" // This ensures the value is a boolean
      >
            <Switch style={{marginRight:'0.5rem'}} size="small"/>
              <span style={{color: "#7B809A"}}>Incident Expense</span>
              <span  style={{ fontSize: "12px", color:'#3052D0' }}> (*can only be checked if trip is more than 10 days)</span>
            </Form.Item>
              </Col>:<></>
        }

            
            </Row>
          </div> */}
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
              backgroundColor: "red",
              border: "none",
              color: "white",
            }}
            onClick={() => onClear()}
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

export default PerDiem;
