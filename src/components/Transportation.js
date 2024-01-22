import { Form, Radio, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./transportation.css";
import { bus, carRental, flight, taxi, train } from "../redux/actions";

import Flights from "./Flights";
import Trains from "./Trains";
import Buss from "./Buss";
import CarRentals from "./CarRentals";
import Taxis from "./Taxis";
import { getTransport } from "../services/ApiService";
function Transportation({triggerParentEffect}) {
  const dispatch = useDispatch();
  const requestid = useSelector((state) => state.requestedid);
  const requestName = useSelector((state) => state.travelHeader.requestName);
  const requestPolicy = useSelector((state) => state.travelHeader.requestPolicy);
  const [transportationMode, setTransportationMode] = useState();
  const [TripType, setTripType] = useState();
  const isFirstRun = useRef(true);

  // const flightData = useSelector((state) => state.flight);
  // const trainData = useSelector((state) => state.train);
  // const busData = useSelector((state) => state.bus);
  // const taxiData = useSelector((state) => state.taxi);
  // const carRentalData = useSelector((state) => state.carRental);
  // const transportation=[]

  // const onFinish = (value) => {
  //   if (transportationMode === "flight") {
  //     const arrayOfObjects = [];
  //     const inputObject = value;
  //     let maxIndex = 0;
  //     for (const key in inputObject) {
  //       const match = key.match(/\d+/);
  //       if (match) {
  //         maxIndex = Math.max(maxIndex, parseInt(match[0]));
  //       }
  //     }

  //     for (let index = 0; index <= maxIndex; index++) {
  //       const roundObject = {};

  //       let hasDefinedValue = false;
  //       for (const key in inputObject) {
  //         if (key.endsWith(index.toString())) {
  //           const keyWithoutRound = key.replace(TripType, "");
  //           const keyWithoutIndex = keyWithoutRound.replace(/\d/g, "");

  //           if (inputObject[key] !== undefined) {
  //             hasDefinedValue = true;
  //             if (keyWithoutIndex.startsWith("date")) {

  //               const date = new Date(inputObject[key]);
  //               const year = date.getFullYear();
  //               const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to the month because it's zero-based
  //               const day = date.getDate().toString().padStart(2, '0');
  //               const formattedDate = `${year}-${month}-${day}`
  //               roundObject[keyWithoutIndex] = formattedDate;
  //             } else {
  //               roundObject[keyWithoutIndex] = inputObject[key];
  //             }
  //           }
  //         }
  //       }

  //       if (hasDefinedValue) {
  //         arrayOfObjects.push(roundObject);
  //       }
  //     }
  //     const flightObject = {
  //       transportType: transportationMode,
  //       tripWay: TripType,
  //       trips: arrayOfObjects,
  //     };
  //     message.success("Flight Data Saved");

  //     dispatch(flight(flightObject));
  //   } else if (transportationMode === "train") {
  //     const arrayOfObjects = [];
  //     const inputObject = value;
  //     let maxIndex = 0;
  //     for (const key in inputObject) {
  //       const match = key.match(/\d+/);
  //       if (match) {
  //         maxIndex = Math.max(maxIndex, parseInt(match[0]));
  //       }
  //     }

  //     for (let index = 0; index <= maxIndex; index++) {
  //       const roundObject = {};

  //       let hasDefinedValue = false;
  //       for (const key in inputObject) {
  //         if (key.endsWith(index.toString())) {
  //           const keyWithoutRound = key.replace("train" + TripType, "");
  //           const keyWithoutIndex = keyWithoutRound.replace(/\d/g, "");

  //           if (inputObject[key] !== undefined) {
  //             hasDefinedValue = true;
  //             if (keyWithoutIndex.startsWith("date")) {
  //               const date = new Date(inputObject[key]);
  //               const year = date.getFullYear();
  //               const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to the month because it's zero-based
  //               const day = date.getDate().toString().padStart(2, '0');
  //               const formattedDate = `${year}-${month}-${day}`
  //               roundObject[keyWithoutIndex] = formattedDate;
  //             } else {
  //               roundObject[keyWithoutIndex] = inputObject[key];
  //             }
  //           }
  //         }
  //       }

  //       if (hasDefinedValue) {
  //         arrayOfObjects.push(roundObject);
  //       }
  //     }
  //     const trainObject = {
  //       transportType: transportationMode,
  //       tripWay: TripType,
  //       trips: arrayOfObjects,
  //     };
  //     message.success("Train Data Saved");

  //     dispatch(train(trainObject));
  //   } else if (transportationMode === "bus") {
  //     const arrayOfObjects = [];
  //     const inputObject = value;
  //     let maxIndex = 0;
  //     for (const key in inputObject) {
  //       const match = key.match(/\d+/);
  //       if (match) {
  //         maxIndex = Math.max(maxIndex, parseInt(match[0]));
  //       }
  //     }

  //     for (let index = 0; index <= maxIndex; index++) {
  //       const roundObject = {};

  //       let hasDefinedValue = false;
  //       for (const key in inputObject) {
  //         if (key.endsWith(index.toString())) {
  //           const keyWithoutRound = key.replace("bus" + TripType, "");
  //           const keyWithoutIndex = keyWithoutRound.replace(/\d/g, "");

  //           if (inputObject[key] !== undefined) {
  //             hasDefinedValue = true;
  //             if (keyWithoutIndex.startsWith("date")) {
  //               const date = new Date(inputObject[key]);
  //               const year = date.getFullYear();
  //               const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to the month because it's zero-based
  //               const day = date.getDate().toString().padStart(2, '0');
  //               const formattedDate = `${year}-${month}-${day}`
  //               roundObject[keyWithoutIndex] = formattedDate;
  //             } else {
  //               roundObject[keyWithoutIndex] = inputObject[key];
  //             }
  //           }
  //         }
  //       }

  //       if (hasDefinedValue) {
  //         arrayOfObjects.push(roundObject);
  //       }
  //     }
  //     const busObject = {
  //       transportType: transportationMode,
  //       tripWay: TripType,
  //       trips: arrayOfObjects,
  //     };
  //     message.success("Bus Data Saved");

  //     dispatch(bus(busObject));
  //   } else if (transportationMode === "taxi") {
  //     let taxiObject = {
  //       transportType: transportationMode,
  //       estimateCost: value.estimateCost,
  //       comment: value.comment,
  //     };
  //     message.success("Taxi Data Saved");

  //     dispatch(taxi(taxiObject));
  //   } else if (transportationMode === "carRental") {
  //     const dateArray = value.date;

  //     const formattedDates = dateArray.map((dateString) => {
  //       const date = new Date(dateString);
  //       const year = date.getFullYear();
  //       const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to the month because it's zero-based
  //       const day = date.getDate().toString().padStart(2, '0');
  //       const formattedDate = `${year}-${month}-${day}`

  //       return formattedDate;
  //     });

  //     const startDate = formattedDates[0];
  //     const endDate = formattedDates[1];
  //     let carRentalObject = {
  //       transportType: transportationMode,
  //       estimateCost: value.estimateCostCarRental,
  //       comment: value.comment1,
  //       startDate: startDate,
  //       endDate: endDate,
  //     };
  //     message.success("Car Rental Data Saved");

  //     dispatch(carRental(carRentalObject));
  //   }
  // };
  // function isObjectEmpty(obj) {
  //   return Object.keys(obj).length === 0;
  // }
  // const SaveAll=()=>{
  //   if (!isObjectEmpty(flightData)) {
  //         transportation.push(flightData);
  //       }

  //       if (!isObjectEmpty(trainData)) {
  //         transportation.push(trainData);
  //       }
  //       if (!isObjectEmpty(busData)) {
  //         transportation.push(busData);
  //       }
  //       if (!isObjectEmpty(taxiData)) {
  //         transportation.push(taxiData);
  //       }
  //       if (!isObjectEmpty(carRentalData)) {
  //         transportation.push(carRentalData);
  //       }
  //       let body={
  //         requestId:requestid,
  //         transports:transportation
  //       }

  //   transport(body).then((res)=>{
  //     if(res.responseCode===200){
  //       message.success('All Tranport Data Saved Successfully')
  //     }
  //     else{
  //       message.error(res.responseMessage)

  //     }
  //   })
  // }
  useEffect(() => {
    console.log("changes");
  }, [transportationMode]);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if(requestid){
      getTransport(requestid,"travel",requestPolicy).then((res) => {
        if (res.responseCode === 200) {
          if (res.data.length > 0) {
            setTripType(res.data[0].tripType);
            setTransportationMode(res.data[0].transportType);
          }
          let filterDataflight = res.data?.filter(
            (item) => item.transportType === "flight"
          );
          if(filterDataflight.length>0){
         dispatch(flight(filterDataflight[0]))
          }
          let filterDatatrain = res.data?.filter(
            (item) => item.transportType === "train"
          );
          if(filterDatatrain.length>0){
         dispatch(train(filterDatatrain[0]))
          }
          let filterDatabus = res.data?.filter(
            (item) => item.transportType === "bus"
          );
          if(filterDatabus.length>0){
         dispatch(bus(filterDatabus[0]))
          }
  
          let filterDatataxi = res.data?.filter(
            (item) => item.transportType === "taxi"
          );
          if(filterDatataxi.length>0){
         dispatch(taxi(filterDatataxi[0]))
          }
          let filterDatacarRental = res.data?.filter(
            (item) => item.transportType === "carRental"
          );
          if(filterDatacarRental.length>0){
         dispatch(carRental(filterDatacarRental[0]))
          }
    
        }
      });
    }
    else{
      message.info("Please save Travel Header")
    }
   
  }, []);
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
      {/* <Form onFinish={onFinish} layout="horizontal"> */}
      <div
        style={{
          height: "59vh",
          // overflow: "auto",
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
        <Form>
          <div style={{ display: "flex", flexDirection: "row", gap: "6rem" }}>
            <div>
              <span style={{ fontWeight: "700" }}>Mode of Transportation</span>
              <Form.Item
                className="custom-form-item"
                initialValue={transportationMode}
              >
                <Radio.Group
                  value={transportationMode}
                  className="custom-radio-group"
                  onChange={(e) => setTransportationMode(e.target.value)}
                >
                  <Radio value="flight"> Flight </Radio>
                  <Radio value="train"> Train </Radio>
                  <Radio value="bus"> Bus </Radio>
                  <Radio value="taxi"> Taxi </Radio>
                  <Radio value="carRental">Car Rental </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            {transportationMode === "taxi" ||
            transportationMode === "carRental" ? (
              <></>
            ) : (
              <div>
                <span style={{ fontWeight: "700" }}>Type of Trip</span>
                <Form.Item className="custom-form-item">
                  <Radio.Group
                    value={TripType}
                    className="custom-radio-group"
                    onChange={(e) => setTripType(e.target.value)}
                  >
                    <Radio value="oneway"> One way </Radio>
                    <Radio value="round"> Round Trip </Radio>
                    <Radio value="multiCity">Multi city </Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            )}
          </div>
        </Form>

        <div>
          {transportationMode === "flight" && TripType ? (
            <Flights TripType={TripType && TripType} triggerParentEffect={triggerParentEffect} />
          ) : transportationMode === "train" && TripType ? (
            <Trains TripType={TripType && TripType} triggerParentEffect={triggerParentEffect} />
          ) : transportationMode === "bus" && TripType ? (
            <Buss TripType={TripType && TripType} triggerParentEffect={triggerParentEffect} />
          ) : transportationMode === "taxi" ? (
            <Taxis triggerParentEffect={triggerParentEffect} />
          ) : transportationMode === "carRental" ? (
            <CarRentals triggerParentEffect={triggerParentEffect} />
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* <div
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
              backgroundColor: "green",
              border: "none",
              color: "white",
            }}
            onClick={()=>SaveAll()}
          >
          Done
          </Button>
          <Button
            style={{
              width: "8.5rem",
              backgroundColor: "transparent",
              border: "1px solid red",
              color: "red",
            }}
          >
            Cancel
          </Button>
        </div> */}
      {/* </Form> */}
    </div>
  );
}

export default Transportation;
