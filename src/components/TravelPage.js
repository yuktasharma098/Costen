import React, { useEffect, useState } from "react";
import { Col, Menu, Row, message } from "antd";
import SideBar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";
import "./travel.css";
import General from "./General";
import PerDiem from "./PerDiem";
import CashAdvance from "./CashAdvance";
import Transportation from "./Transportation";
import { useDispatch, useSelector } from "react-redux";
import OtherExpense from "./OtherExpense";
import HotelExtra from "./HotelExtra";
import TravelHeaderExtra from "./TravelHeaderExtra";
import { allTravelRequestDashboard } from "../services/ApiService";
import { amount } from "../redux/actions";

function TravelPage() {
  const [perDiemVisible, setPerDiemVisible] = useState();
  const [cashAdvanceVisible, setCashAdvanceVisible] = useState();
  const [otherExpenseVisible, setOtherExpenseVisible] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("travelHeader");
  const cashAdvance = useSelector((state) => state.cashAdvance.cashAdvance);
  const dates = useSelector((state) => state.travelHeader.dates);
  const amountfromredux = useSelector((state) => state.amount);
  const [someState, setSomeState] = useState('');
  const requestid = useSelector((state) => state.requestedid);
  const dispatch=useDispatch()
  const triggerParentEffect = (newValue) => {
    // Call this function from the child to trigger the parent's useEffect with a new value
    setSomeState(newValue);
  };
  useEffect(()=>{
    // if(state?.data==="open"){
      allTravelRequestDashboard(sessionStorage.getItem('employeeId')).then((res)=>{
        if(res.responseCode===200){
          const filteredData = res.data.openRequest.filter(item => item.request_id === requestid);
          if(filteredData.length>0){
            dispatch(amount(filteredData[0]?.total_amount))

          }
          else{
            dispatch(amount(0))
          }
        }
         
        else{
            message.error(res.responseMessage)
        }
    })
    // }

  },[someState])
  const sum = (arr) => {
    let sumOfEstimatedCost;
    if (Array.isArray(arr) && arr.length > 0) {
      sumOfEstimatedCost = arr.reduce((total, obj) => {
        if (obj && obj.estimateCost !== undefined) {
          return total + obj.estimateCost;
        } else {
          return total;
        }
      }, 0);
    } else {
      sumOfEstimatedCost = 0;
    }

    return sumOfEstimatedCost;
  };
  const train = sum(useSelector((state) => state.train.trips));
  const flight = sum(useSelector((state) => state.flight.trips));
  const bus = sum(useSelector((state) => state.bus.trips));
  const [amountfromtravel, setAmountFromTravel] = useState(0);
  const carRental = useSelector((state) => state.carRental.estimateCost);
  const taxi = useSelector((state) => state.taxi.estimateCost);
  const inputObject = useSelector((state) => state.hoteldata.data);
  const arrayOfObjects = [];
  useEffect(() => {
    const taxidata = taxi === undefined ? 0 : taxi;
    for (const key in inputObject) {
      if (key.includes("date") && inputObject[key]) {
        const index = key.match(/\d+/)[0];
        const startDate = new Date(inputObject[key][0]);
        const endDate = new Date(inputObject[key][1]);
        const formattedStartDate = `${startDate.getFullYear()}-${
          startDate.getMonth() + 1
        }-${startDate.getDate()}`;
        const formattedEndDate = `${endDate.getFullYear()}-${
          endDate.getMonth() + 1
        }-${endDate.getDate()}`;

        if (!arrayOfObjects[index]) {
          arrayOfObjects[index] = {};
        }

        arrayOfObjects[index].startDate = formattedStartDate;
        arrayOfObjects[index].endDate = formattedEndDate;
      } else {
        const index = key.match(/\d+/);
        const nonIndexedKey = key.replace(/\d+/g, "");

        if (!arrayOfObjects[index]) {
          arrayOfObjects[index] = {};
        }

        arrayOfObjects[index][nonIndexedKey] = inputObject[key];
      }
    }
    const hotel = sum(inputObject);
    const rental = carRental !== undefined ? carRental : 0;
    const taxiCondition = taxi !== undefined ? taxi : 0;
    const cashAdvanceCondition = cashAdvance !== undefined ? cashAdvance : 0;
    const hotelCondition = hotel !== undefined ? hotel : 0;
    const total =
      flight +
      train +
      bus +
      taxiCondition +
      rental +
      hotelCondition +
      cashAdvanceCondition;
    setAmountFromTravel(total);
  }, [flight, train, bus, taxi, carRental, inputObject, cashAdvance]);
  useEffect(() => {
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
  let items = [
    {
      label: "Travel Header",
      key: "travelHeader",
    },

    {
      label: "Transportation",
      key: "transportation",
    },
    {
      label: "Hotel",
      key: "hotel",
    },
    {
      label: "Per Diem",
      key: "perDiem",
    },
    {
      label: "Other Expense",
      key: "otherExpense",
    },
    {
      label: "Cash Advance",
      key: "cashAdvance",
    },
    {
      label: "General",
      key: "general",
    },
  ];
  

  if (!perDiemVisible) {
    items = items.filter((item) => item.key !== "perDiem");
  }
  if (!cashAdvanceVisible) {
    items = items.filter((item) => item.key !== "cashAdvance");
  }
  if (!otherExpenseVisible) {
    items = items.filter((item) => item.key !== "otherExpense");
  }
  if (
    sessionStorage.getItem("incidentCharges") == "false" &&
    sessionStorage.getItem("internationalRoaming") == "false"
  ) {
    items = items.filter((item) => item.key !== "otherExpense");
  }
  if (
    sessionStorage.getItem("internationalRoaming") == "false" &&
    dates?.length < 10
  )
    items = items.filter((item) => item.key !== "otherExpense");
  const handleDataUpdate = (perDiemData, cashAdvanceData, otherExpenseData) => {
    setCashAdvanceVisible(cashAdvanceData);
    setPerDiemVisible(perDiemData);
    setOtherExpenseVisible(otherExpenseData);
  };
  return (
    <div style={{ height: "100vh", backgroundColor: "#F7F8FA" }}>
      <Row>
        <Col
          xs={!collapsed ? 19 : 11}
          sm={!collapsed ? 10 : 6}
          md={!collapsed ? 7 : 4}
          lg={!collapsed ? 6 : 5}
          xl={!collapsed ? 4 : 2}
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
          xl={!collapsed ? 20 : 22}
        >
          <div style={{ marginLeft: "1.5rem" }}>
            <Header expense={false} travel={true} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: "1rem",
                margin: "0.5rem 4rem 0 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "0.3rem",
                }}
              >
                <span style={{ fontWeight: "700" }}>Status : </span>
                <div
                  style={{
                    color: "#4CAF50",
                    padding: "1px 3px 1px 3px",
                    borderRadius: "4px",
                    backgroundColor: " rgba(76, 175, 80, 0.2)",
                  }}
                >
                  Initiated
                </div>
              </div>

              <span style={{ fontWeight: "700" }}>
                Amount : {sessionStorage.getItem("currency")} {amountfromredux>0?amountfromredux:0}
        

              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "1rem 2rem 0 0",
              }}
            >
              <Menu
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                defaultSelectedKeys={["travelHeader"]}
                onClick={({ item, key }) => {
                  setSelectedKey(key);
                }}
              >
                {items.map((item) => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu>
           
            </div>
            <div>
              {selectedKey === "travelHeader" ? (
                <TravelHeaderExtra onDataUpdate={handleDataUpdate} />
              ) : selectedKey === "general" ? (
                <General />
              ) : selectedKey === "hotel" ? (
                <HotelExtra triggerParentEffect={triggerParentEffect} />
              ) : selectedKey === "perDiem" ? (
                <PerDiem triggerParentEffect={triggerParentEffect} />
              ) : selectedKey === "cashAdvance" ? (
                <CashAdvance triggerParentEffect={triggerParentEffect} />
              ) : selectedKey === "transportation" ? (
                <Transportation triggerParentEffect={triggerParentEffect}/>
              ) : selectedKey === "otherExpense" ? (
                <OtherExpense triggerParentEffect={triggerParentEffect} />
              ) : (
                <></>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  );
}

export default TravelPage;
