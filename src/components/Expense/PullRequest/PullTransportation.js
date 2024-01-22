import { Form, Modal, Radio } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../transportation.css";
import { bus, carRental, flight, taxi, train } from "../../../redux/actions";

import {
  getExpenseTransport,
  getTransport,
} from "../../../services/ApiService";
import PullFlight from "./PullFlight";
import PullTrain from "./PullTrain";
import PullBus from "./PullBus";
import PullTaxi from "./PullTaxi";
import PullCarRental from "./PullCarRental";
import { InfoCircleOutlined } from "@ant-design/icons";
function PullTransportation({triggerParentEffect}) {
  const dispatch = useDispatch();
  const requestid = useSelector((state) => state.requestedid);
  const requestName = useSelector((state) => state.travelHeader.requestName);
  const [transportationMode, setTransportationMode] = useState();
  const [TripType, setTripType] = useState();
  const isFirstRun = useRef(true);
  const [estimateCost, setEstimateCost] = useState();
  // useEffect(() => {
  //   console.log("changes");
  // }, [transportationMode]);
  useEffect(() => {
    // if (isFirstRun.current) {
    //   isFirstRun.current = false;
    //   return;
    // }
    Modal.info({
      content: (
        <span style={{ fontWeight: "600" }}>
          Please upload your receipt before filling any data, and system will
          fill the data on your behalf. Later you can validate the same
        </span>
      ),
      centered: true,
    });
    getExpenseTransport(requestid).then((res) => {
      if (res.responseCode === 200) {
        if (res.data.length > 0) {
          setTripType(res.data[0].tripType);
          setTransportationMode(res.data[0].transportType);
        }
        let filterDatataxi = res.data?.filter(
          (item) => item.transportType === "taxi"
        );
        setEstimateCost(filterDatataxi[0]?.estimatedCost)
        // let filterDataflight = res.data?.filter(
        //   (item) => item.transportType === "flight"
        // );
        // if (filterDataflight.length > 0) {
        //   dispatch(flight(filterDataflight[0]));
        // }
        // let filterDatatrain = res.data?.filter(
        //   (item) => item.transportType === "train"
        // );
        // if (filterDatatrain.length > 0) {
        //   dispatch(train(filterDatatrain[0]));
        // }
        // let filterDatabus = res.data?.filter(
        //   (item) => item.transportType === "bus"
        // );
        // if (filterDatabus.length > 0) {
        //   dispatch(bus(filterDatabus[0]));
        // }

        // let filterDatataxi = res.data?.filter(
        //   (item) => item.transportType === "taxi"
        // );
        // if (filterDatataxi.length > 0) {
        //   dispatch(taxi(filterDatataxi[0]));
        // }
        // let filterDatacarRental = res.data?.filter(
        //   (item) => item.transportType === "carRental"
        // );
        // if (filterDatacarRental.length > 0) {
        //   dispatch(carRental(filterDatacarRental[0]));
        // }
      }
    });
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
      <div
        style={{
          height: "59vh",
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
            {transportationMode === "carRental" ? (
              <></>
            ) : transportationMode === "taxi" ? (
              <span style={{ marginTop: "1.6rem", fontWeight: "600" }}>
                Estimate Cost : {estimateCost}
              </span>
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
            <PullFlight TripType={TripType && TripType} triggerParentEffect={triggerParentEffect}/>
          ) : transportationMode === "train" && TripType ? (
            <PullTrain TripType={TripType && TripType} triggerParentEffect={triggerParentEffect}/>
          ) : transportationMode === "bus" && TripType ? (
            <PullBus TripType={TripType && TripType} triggerParentEffect={triggerParentEffect}/>
          ) : transportationMode === "taxi" ? (
            <PullTaxi triggerParentEffect={triggerParentEffect}/>
          ) : transportationMode === "carRental" ? (
            <PullCarRental triggerParentEffect={triggerParentEffect}/>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default PullTransportation;
