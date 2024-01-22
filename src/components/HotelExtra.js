import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  message,
} from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hoteldata } from "../redux/actions";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
  cancelRequest,
  clearRequest,
  getHotelData,
  hotelRequest,
} from "../services/ApiService";
import { useNavigate } from "react-router-dom";
const initialFormData = {
  checkIn: null,
  checkOut: null,
  estimateCost: "",
  cityName: "",
};

function formatDate(date) {
  if (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return "";
}
function HotelExtra({ triggerParentEffect }) {
  const dispatch = useDispatch();
  const requestid = useSelector((state) => state.requestedid);
  const requestName = useSelector((state) => state.travelHeader.requestName);
  const [formData, setFormData] = useState([{ ...initialFormData, id: 0 }]);
  const [updatedData, setUpdatedData] = useState([
    { ...initialFormData, id: 0 },
  ]);
  const idCounter = useRef(1); // Use a ref to keep track of unique IDs
  const userType = sessionStorage.getItem("userType");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isFirstRun = useRef(true);
  const requestPolicy = useSelector(
    (state) => state.travelHeader.requestPolicy
  );

  const getNewForm = () => ({
    ...initialFormData,
    id: idCounter.current++, // Generate a unique ID
  });

  const handleAddForm = () => {
    if (formData.length < 5) {
      setFormData([...formData, getNewForm()]);
      setUpdatedData([...updatedData, getNewForm()]);
    }
  };

  const handleRemoveForm = (index) => {
    const newFormData = [...formData];
    newFormData.splice(index, 1);
    setFormData(newFormData);

    const newUpdatedData = [...updatedData];
    newUpdatedData.splice(index, 1);
    setUpdatedData(newUpdatedData);
  };

  const handleDateChange = (index, field, date) => {
    const newFormData = [...formData];
    newFormData[index][field] = date;
    setFormData(newFormData);

    const newUpdatedData = [...updatedData];
    newUpdatedData[index][field] = date;
    setUpdatedData(newUpdatedData);
  };

  const handleInputChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);

    const newUpdatedData = [...updatedData];
    newUpdatedData[index][field] = value;
    setUpdatedData(newUpdatedData);
  };

  const handleSave = () => {
    const formattedData = updatedData.map((data) => ({
      ...data,
      startDate: formatDate(data.checkIn),
      endDate: formatDate(data.checkOut),
      estimatedCost: parseInt(data.estimateCost, 10),
    }));
    const updatedArray = formattedData.map(
      ({ checkIn, checkOut, id, estimateCost, ...rest }) => rest
    );
    const filteredData = updatedArray.filter((obj) =>
      Object.values(obj).some(
        (value) => value !== null && value !== "" && !isNaN(value)
      )
    );
    let obj = {
      requestId: requestid,
      hotels: filteredData,
    };
    if (filteredData.length > 0) {
      hotelRequest(obj, requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          message.success("Saved");
          triggerParentEffect(obj);
        } else {
          message.error(res.responseMessage);
        }
      });
      const formattedDataRedux = updatedData.map((data) => ({
        ...data,
        startDate: formatDate(data.checkIn),
        endDate: formatDate(data.checkOut),
        estimateCost: parseInt(data.estimateCost, 10),
      }));
      const updatedArrayRedux = formattedDataRedux.map(
        ({ checkIn, checkOut, id, ...rest }) => rest
      );
      const filteredDataRedux = updatedArrayRedux.filter((obj) =>
        Object.values(obj).some(
          (value) => value !== null && value !== "" && !isNaN(value)
        )
      );
      const obj1 = { data: filteredDataRedux };
      dispatch(hoteldata(obj1));
    } else {
      message.error("Add full data for hotel to save");
    }
  };

  useEffect(() => {
    // if (isFirstRun.current) {
    //   isFirstRun.current = false;
    //   return;
    // }
    if (requestid) {
      getHotelData(requestid, "travel", requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          if (res.data) {
            if (res.data.length > 0) {
              const initialFormDataArray = res.data.map((obj) => ({
                checkIn: new Date(obj.startDate) || null,
                checkOut: new Date(obj.endDate) || null,
                estimateCost: obj.estimatedCost || "",
                cityName: obj.cityName || "",
              }));
              setFormData(initialFormDataArray);
              setUpdatedData(initialFormDataArray);
              let reduxobj = {
                data: initialFormDataArray,
              };
              dispatch(hoteldata(reduxobj));
            }
          }
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      message.info("Please save Travel Header");
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
      setFormData([{ ...initialFormData, id: 0 }]);
      setUpdatedData([{ ...initialFormData, id: 0 }]);
      let body = {
        requestId: requestid,
        requestType: "hotel",
      };
      clearRequest(body).then((res) => {
        if (res.responseCode === 200) {
          dispatch(hoteldata({}));
          triggerParentEffect(body);
          message.success("Data Cleared Successfully");
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      message.error("Please Save Travel Header");
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
      <Form layout="horizontal">
        <div style={{ height: "54vh" }}>
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
          <div
            style={{
              height: "46vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div>
              {formData.map((form, index) => (
                <div key={index}>
                  <Row gutter={15}>
                    <Col lg={5}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                        }}
                      >
                        <label style={{ fontWeight: "600" }}>
                          Check-in Date:
                        </label>
                        <DatePicker
                          selected={form.checkIn}
                          onChange={(date) =>
                            handleDateChange(index, "checkIn", date)
                          }
                          minDate={new Date()}
                          placeholderText="Select Check In Date"
                        />
                      </div>
                    </Col>
                    <Col lg={5}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                        }}
                      >
                        <label style={{ fontWeight: "600" }}>
                          Check-out Date:
                        </label>
                        <DatePicker
                          selected={form.checkOut}
                          onChange={(date) =>
                            handleDateChange(index, "checkOut", date)
                          }
                          minDate={form.checkIn || new Date()} // Set minDate to check-in date or today
                          maxDate={
                            form.checkIn
                              ? new Date(
                                  form.checkIn.getTime() +
                                    4 * 7 * 24 * 60 * 60 * 1000
                                )
                              : null
                          } // Max date is 4 weeks from check-in date
                          placeholderText="Select Check Out Date"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                        }}
                      >
                        <label style={{ fontWeight: "600" }}>
                          Estimate Cost:
                        </label>
                        <input
                          className="inputclass"
                          type="number"
                          value={form.estimateCost}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "estimateCost",
                              e.target.value
                            )
                          }
                          placeholder="Enter Amount"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                        }}
                      >
                        <label style={{ fontWeight: "600" }}>City Name:</label>
                        <input
                          className="inputclass"
                          type="text"
                          value={form.cityName}
                          onChange={(e) =>
                            handleInputChange(index, "cityName", e.target.value)
                          }
                          placeholder="Enter City Name"
                        />
                      </div>
                    </Col>
                    <Col lg={2}>
                      <CloseCircleOutlined
                        style={{
                          color: "red",
                          fontSize: "1.5rem",
                          marginTop: "2rem",
                        }}
                        onClick={() => handleRemoveForm(index)}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
              <div>
                {formData.length < 5 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      onClick={handleAddForm}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "row",
                        gap: "0.5rem",
                        boxShadow: "0px 2px 6px 0px rgba(151, 172, 198, 0.25)",
                        padding: "0.5rem",
                        width: "21%",
                        borderRadius: "60px",
                        marginTop: "1rem",
                        cursor: "pointer",
                      }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="Group 44">
                          <rect
                            id="bg - icon"
                            width="32"
                            height="32"
                            rx="16"
                            fill="#534ECC"
                          />
                          <path
                            id="Vector"
                            d="M19.6539 15.1538H15.8463V11.3462C15.8463 11.2543 15.8098 11.1663 15.7449 11.1014C15.68 11.0365 15.5919 11 15.5001 11C15.4083 11 15.3203 11.0365 15.2554 11.1014C15.1904 11.1663 15.154 11.2543 15.154 11.3462V15.1538H11.3464C11.2546 15.1538 11.1665 15.1903 11.1016 15.2552C11.0367 15.3201 11.0002 15.4082 11.0002 15.5C10.9985 15.545 11.0065 15.5898 11.0236 15.6315C11.0406 15.6731 11.0664 15.7106 11.0993 15.7415C11.1321 15.7723 11.1711 15.7957 11.2137 15.8102C11.2563 15.8247 11.3016 15.8299 11.3464 15.8254H15.154V19.6538C15.154 19.7457 15.1904 19.8337 15.2554 19.8986C15.3203 19.9635 15.4083 20 15.5001 20C15.5919 20 15.68 19.9635 15.7449 19.8986C15.8098 19.8337 15.8463 19.7457 15.8463 19.6538V15.8462H19.6539C19.7457 15.8462 19.8337 15.8097 19.8986 15.7448C19.9635 15.6799 20 15.5918 20 15.5C20 15.4082 19.9635 15.3201 19.8986 15.2552C19.8337 15.1903 19.7457 15.1538 19.6539 15.1538Z"
                            fill="white"
                          />
                        </g>
                      </svg>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.3rem",
                        }}
                      >
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            padding: "0",
                            cursor: "pointer",
                          }}
                        >
                          Add another city
                        </button>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#7B809A",
                            fontWeight: "500",
                          }}
                        >
                          *Max 5 city allowed at a time
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
            onClick={handleSave}
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

export default HotelExtra;
