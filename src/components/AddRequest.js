import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import SideBar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import {
  amount,
  bus,
  carRental,
  cashAdvance,
  claimno,
  flight,
  hoteldata,
  perdiem,
  perdiemextra,
  requesteid,
  taxi,
  train,
  travelHeader,
} from "../redux/actions";
import { useDispatch } from "react-redux";

function AddRequest() {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    dispatch(bus({}));
    dispatch(cashAdvance({}));
    dispatch(carRental({}));
    dispatch(flight({}));
    dispatch(hoteldata({}));
    dispatch(perdiem({}));
    dispatch(perdiemextra({}));
    dispatch(taxi({}));
    dispatch(train({}));
    dispatch(travelHeader({}));
    dispatch(requesteid(""));
    dispatch(claimno(""));
    dispatch(amount(0));

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
  const navigate = useNavigate();
  return (
    <div style={{ height: "100vh", backgroundColor: "#F7F8FA" }}>
      <Row>
        <Col
          xs={!collapsed ? 19 : 11}
          sm={!collapsed ? 10 : 6}
          md={!collapsed ? 7 : 4}
          lg={!collapsed ? 4 : 5}
          xl={!collapsed ? 5 : 3}
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
          lg={!collapsed ? 20 : 19}
          xl={!collapsed ? 19 : 21}
        >
      <Header expense={false} travel={true} />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: "10%",
              marginTop: "10%",
              alignContent: "center",
              alignItems: "center",
              marginLeft: "10%",
            }}
          >
            <div
              onClick={() => {
                sessionStorage.setItem("T", "D");
                navigate("/travel-page");
              }}
              className="card"
              style={{
                overflow: "auto",

                maxWidth: "400px",
                borderRadius: "19px",
                backgroundColor: "white",
                cursor: "pointer",
                objectFit: "cover",
                height: "80%",
              }}
            >
              <img src="domestic.png" alt="Card" />
              <h4
                style={{
                  textAlign: "center",
                  color: "#1B2559",
                  padding: "0px",
                  fontSize: "20px",
                }}
              >
                Domestic Travel
              </h4>
            </div>
            <div
              onClick={() => {
                sessionStorage.setItem("T", "I");
                navigate("/travel-page");
              }}
              className="card"
              style={{
                overflow: "auto",

                maxWidth: "400px",
                borderRadius: "19px",
                backgroundColor: "white",
                cursor: "pointer",
                objectFit: "cover",
              }}
            >
              <img src="international.png" alt="Card" />
              <h4
                style={{
                  textAlign: "center",
                  color: "#1B2559",
                  padding: "0px",
                  fontSize: "20px",
                }}
              >
                International Travel
              </h4>
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  );
}

export default AddRequest;
