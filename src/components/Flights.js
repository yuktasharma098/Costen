import { Button, Col, Form, Input, InputNumber,Modal, Row, message } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { flight } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from "@ant-design/icons";
import { postTransport,cancelRequest, clearRequest} from "../services/ApiService";
const initialFormData = {
  departureDate: null,
  estimateCost: "",
  from: "",
  to: "",
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

function Flights({TripType,triggerParentEffect}) {
  const[open,setOpen]=useState(false)
  const [onewayform, setOnewayform] = useState({
    departureDateoneway: null,
    estimateCostoneway: "",
    fromoneway: "",
    tooneway: "",
  });
  const [roundformData, setRoundFormData] = useState({
    departureDateroundway0: null,
    estimateCostroundway0: "",
    fromroundway0: "",
    toroundway0: "",
    departureDateroundway1: null,
    estimateCostroundway1: "",
    fromroundway1: "",
    toroundway1: "",
  });
  const userType=sessionStorage.getItem('userType')
  const navigate=useNavigate()
  const flightData = useSelector((state) => state.flight);
  const requestPolicy = useSelector((state) => state.travelHeader.requestPolicy);

  const triptype =TripType;
  const dispatch = useDispatch();
  const requestid = useSelector((state) => state.requestedid);
  const [departuredateoneway, setDepartureDateONeWay] = useState(null);
  const [departuredateroundway, setDepartureDateroundway] = useState(null);
  const [departuredateroundway1, setDepartureDateroundway1] = useState(null);
  const [formData, setFormData] = useState([{ ...initialFormData, id: 0 }]);
  const [updatedData, setUpdatedData] = useState([
    { ...initialFormData, id: 0 },
  ]);
  const idCounter = useRef(1);

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
    let updatedArray;
    if (triptype === "multiCity") {
      const formattedData = updatedData.map((data) => ({
        ...data,
        departureDate: formatDate(data.departureDate),
        estimateCost: parseInt(data.estimateCost, 10),
      }));
      updatedArray = formattedData.map(({ id, ...rest }) => rest);
    } else if (triptype === "oneway") {
      const modifiedObject = {};
      const array = [];
      onewayform["departureDateoneway"] = formatDate(departuredateoneway);
      for (const key in onewayform) {
        if (Object.prototype.hasOwnProperty.call(onewayform, key)) {
          const newKey = key.replace("oneway", ""); // Remove "oneway" from the key
          modifiedObject[newKey] = onewayform[key];
        }
      }
      array.push(modifiedObject);
      updatedArray = array;
    } else if (triptype === "round") {
      roundformData["departureDateroundway0"] = formatDate(
        departuredateroundway
      );
      roundformData["departureDateroundway1"] = formatDate(
        departuredateroundway1
      );
      const result = Object.keys(roundformData).reduce((acc, key) => {
        const [fieldName, index] = key.split("roundway");
        const dataIndex = parseInt(index, 10);

        if (!acc[dataIndex]) {
          acc[dataIndex] = {};
        }

        const newKey = fieldName.replace(/\d+$/, ""); // Remove trailing digits
        acc[dataIndex][newKey] = roundformData[key];

        return acc;
      }, []);
      updatedArray = result;
    }
    const filteredData = updatedArray.filter((obj) =>
      Object.values(obj).some((value) => value !== null && value !== ""  && ! isNaN(value))
    );
    filteredData.forEach(obj => {
      obj.estimateCost = parseInt(obj.estimateCost, 10);
    });

    let obj;
    if (filteredData.length > 0) {
      obj = {
        requestId: requestid,
        employeeId: sessionStorage.getItem("employeeId"),
        transports: {
          transportType: "flight",
          tripWay: triptype,
          trips: filteredData,
        },
      };
      postTransport("flight", obj,requestPolicy).then((res) => {
        if (res.responseCode === 200) {

          message.success("Flight Data Saved Succesfully");
          triggerParentEffect(obj);
        } else {
          message.error(res.responseMessage);
        }
      });
      let reduxobj = {
    
          transportType: "flight",
          tripType: triptype,
          trips: filteredData,
      
      };
      dispatch(flight(reduxobj));
    } else {
      message.error("Add full data for flight to save");
    }
  };
 
  useEffect(() => {
    if(Object.keys(flightData).length>0){    if(flightData.trips.length>0){
      if (flightData?.tripType === "multiCity") {
        if (flightData.trips.length > 0) {
          const initialFormDataArray = flightData.trips.map((obj) => ({
            departureDate: new Date(obj.departureDate) || null,
            estimateCost: obj.estimateCost || "",
            from: obj.from || "",
            to: obj.to || "",
          }));

          setFormData(initialFormDataArray);
          setUpdatedData(initialFormDataArray);
        
        }
        setRoundFormData({
          departureDateroundway0: null,
          estimateCostroundway0: "",
          fromroundway0: "",
          toroundway0: "",
          departureDateroundway1: null,
          estimateCostroundway1: "",
          fromroundway1: "",
          toroundway1: "",
        })
        setDepartureDateroundway(null)
        setDepartureDateroundway1(null)
        setOnewayform({
          departureDateoneway: null,
          estimateCostoneway: "",
          fromoneway: "",
          tooneway: "",
        })
        setDepartureDateONeWay(null)
      }
      if (flightData?.tripType === "oneway") {
        setDepartureDateONeWay(
          new Date(flightData.trips[0].departureDate)
        );

        if (flightData.trips[0]) {
          const initialFormDataArray = {
            departureDateoneway:
              new Date(flightData.trips[0].departureDate) || null,
            estimateCostoneway: flightData.trips[0].estimateCost || "",
            fromoneway: flightData.trips[0].from || "",
            tooneway: flightData.trips[0].to || "",
          };
          setOnewayform(initialFormDataArray);
    
        }
        setRoundFormData({
          departureDateroundway0: null,
          estimateCostroundway0: "",
          fromroundway0: "",
          toroundway0: "",
          departureDateroundway1: null,
          estimateCostroundway1: "",
          fromroundway1: "",
          toroundway1: "",
        })
        setDepartureDateroundway(null)
        setDepartureDateroundway1(null)
        setFormData([{ ...initialFormData, id: 0 }]);
        setUpdatedData([{ ...initialFormData, id: 0 }]);
      }
      if (flightData?.tripType === "round") {
        setDepartureDateroundway(
          new Date(flightData.trips[0].departureDate)
        );
        setDepartureDateroundway1(
          new Date(flightData.trips[1].departureDate)
        );
        if (flightData.trips[0]) {
          const initialFormDataArray = {
            departureDateroundway0:
              new Date(flightData.trips[0].departureDate) || null,
            estimateCostroundway0: flightData.trips[0].estimateCost || "",
            fromroundway0: flightData.trips[0].from || "",
            toroundway0: flightData.trips[0].to || "",
            departureDateroundway1:
              new Date(flightData.trips[1].departureDate) || null,
            estimateCostroundway1: flightData.trips[1].estimateCost || "",
            fromroundway1: flightData.trips[1].from || "",
            toroundway1: flightData.trips[1].to || "",
          };
          setRoundFormData(initialFormDataArray);
          // const formattedData = {
          //   ...filterData[0],
          //   trips: filterData[0].trips.map((trip) => ({
          //     ...trip,
          //     departureDate: formatDateforuseeffect(trip.departureDate),
          //   })),
          // };
          // const objredux = {
          //   ...formattedData,
          //   ["tripWay"]: formattedData["tripType"],
          // };
          // delete objredux["tripType"];
          // dispatch(flight(objredux));
          //   setUpdatedData(initialFormDataArray);
        }
        setOnewayform({
          departureDateoneway: null,
          estimateCostoneway: "",
          fromoneway: "",
          tooneway: "",
        })
        setDepartureDateONeWay(null)
        setFormData([{ ...initialFormData, id: 0 }]);
        setUpdatedData([{ ...initialFormData, id: 0 }]);
      }
    }}

  
  }, [triptype]);
  const today = new Date();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOnewayform({ ...onewayform, [name]: value });
  };
  const handleStartDateChange = (date) => {
    setDepartureDateONeWay(date);
  };
  const handleChangeRound = (e) => {
    const { name, value } = e.target;
    setRoundFormData({ ...roundformData, [name]: value });
  };
  const handleStartDateChangeRound = (date) => {
    setDepartureDateroundway(date);
  };
  const handleStartDateChangeRound1 = (date) => {
    setDepartureDateroundway1(date);
  };
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
    if(requestid){
      setDepartureDateONeWay(null);
      setDepartureDateroundway(null);
         setDepartureDateroundway1(null);
       setFormData([{ ...initialFormData, id: 0 }]);
         setUpdatedData([
           { ...initialFormData, id: 0 },
         ]);
        setOnewayform({
           departureDateoneway: null,
           estimateCostoneway: "",
           fromoneway: "",
           tooneway: "",
         });
         setRoundFormData({
           departureDateroundway0: null,
           estimateCostroundway0: "",
           fromroundway0: "",
           toroundway0: "",
           departureDateroundway1: null,
           estimateCostroundway1: "",
           fromroundway1: "",
           toroundway1: "",
         });
         let body={
           requestId: requestid,
           requestType: "transport",
           transportType: "flight"
       }
       clearRequest(body).then((res)=>{
         if(res.responseCode===200){
           dispatch(flight({}))
           triggerParentEffect(body);
           message.success("Flight Data Cleared Successfully")
         }
         else{
           message.error(res.responseMessage)
         }
       })
    }
   else{
    message.error("Please Save Travel Header Data")
   }
  }
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
      <div
        style={{
          height: "40vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {triptype === "multiCity" ? (
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
                      <label style={{ fontWeight: "600" }}>From</label>
                      <input
                        className="inputclass"
                        type="text"
                        value={form.from}
                        onChange={(e) =>
                          handleInputChange(index, "from", e.target.value)
                        }
                        placeholder="Enter From"
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
                      <label style={{ fontWeight: "600" }}>To</label>
                      <input
                        className="inputclass"
                        type="text"
                        value={form.to}
                        onChange={(e) =>
                          handleInputChange(index, "to", e.target.value)
                        }
                        placeholder="Enter To"
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
                        Departure Date
                      </label>
                      <DatePicker
                        selected={form.departureDate}
                        onChange={(date) =>
                          handleDateChange(index, "departureDate", date)
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

                  <Col lg={4}>
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
        ) : triptype === "oneway" ? (
          <form>
            <Row gutter={15}>
              <Col lg={5}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                  }}
                >
                  <label style={{ fontWeight: "600" }}>From</label>
                  <input
                    className="inputclass"
                    type="text"
                    name="fromoneway"
                    value={onewayform.fromoneway}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    placeholder="Enter From"
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
                  <label style={{ fontWeight: "600" }}>To</label>
                  <input
                    className="inputclass"
                    type="text"
                    name="tooneway"
                    value={onewayform.tooneway}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    placeholder="Enter To"
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
                  <label style={{ fontWeight: "600" }}>Departure Date</label>
                  <DatePicker
                    selected={departuredateoneway}
                    onChange={handleStartDateChange}
                    required
                    minDate={today} // Disable dates before today
                    className="form-control"
                    placeholderText="Select Start Date"
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
                  <label style={{ fontWeight: "600" }}>Estimate Cost:</label>
                  <input
                    className="inputclass"
                    name="estimateCostoneway"
                    type="number"
                    value={onewayform.estimateCostoneway}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    placeholder="Enter Amount"
                  />
                </div>
              </Col>
            </Row>
          </form>
        ) : triptype === "round" ? (
          <form>
            <Row gutter={15}>
              <Col lg={5}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                  }}
                >
                  <label style={{ fontWeight: "600" }}>From</label>
                  <input
                    className="inputclass"
                    type="text"
                    name="fromroundway0"
                    value={roundformData.fromroundway0}
                    onChange={(e) => {
                      handleChangeRound(e);
                    }}
                    placeholder="Enter From"
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
                  <label style={{ fontWeight: "600" }}>To</label>
                  <input
                    className="inputclass"
                    type="text"
                    name="toroundway0"
                    value={roundformData.toroundway0}
                    onChange={(e) => {
                      handleChangeRound(e);
                    }}
                    placeholder="Enter To"
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
                  <label style={{ fontWeight: "600" }}>Departure Date</label>
                  <DatePicker
                    name="departureDateroundway0"
                    selected={departuredateroundway}
                    onChange={handleStartDateChangeRound}
                    required
                    minDate={today} // Disable dates before today
                    className="form-control"
                    placeholderText="Select Start Date"
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
                  <label style={{ fontWeight: "600" }}>Estimate Cost:</label>
                  <input
                    className="inputclass"
                    name="estimateCostroundway0"
                    type="number"
                    value={roundformData.estimateCostroundway0}
                    onChange={(e) => {
                      handleChangeRound(e);
                    }}
                    placeholder="Enter Amount"
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={15}>
              <Col lg={5}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                  }}
                >
                  <label style={{ fontWeight: "600" }}>From</label>
                  <input
                    className="inputclass"
                    type="text"
                    name="fromroundway1"
                    value={roundformData.fromroundway1}
                    onChange={(e) => {
                      handleChangeRound(e);
                    }}
                    placeholder="Enter From"
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
                  <label style={{ fontWeight: "600" }}>To</label>
                  <input
                    className="inputclass"
                    type="text"
                    name="toroundway1"
                    value={roundformData.toroundway1}
                    onChange={(e) => {
                      handleChangeRound(e);
                    }}
                    placeholder="Enter To"
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
                  <label style={{ fontWeight: "600" }}>Departure Date</label>
                  <DatePicker
                    name="departureDateroundway1"
                    selected={departuredateroundway1}
                    onChange={handleStartDateChangeRound1}
                    required
                    minDate={today} // Disable dates before today
                    className="form-control"
                    placeholderText="Select Start Date"
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
                  <label style={{ fontWeight: "600" }}>Estimate Cost:</label>
                  <input
                    className="inputclass"
                    name="estimateCostroundway1"
                    type="number"
                    value={roundformData.estimateCostroundway1}
                    onChange={(e) => {
                      handleChangeRound(e);
                    }}
                    placeholder="Enter Amount"
                  />
                </div>
              </Col>
            </Row>
          </form>
        ) : (
          <></>
        )}
      </div>
      {/* </div> */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
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
          onClick={()=>onCancel()}

        >
          Cancel
        </Button>
      </div>
      {/* </Form> */}
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

export default Flights;
