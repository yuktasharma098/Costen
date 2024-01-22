import React, { useEffect, useState } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import { Button, Col, Radio, Row, Table, message } from "antd";
import SideBar from "../../SideBar";
import "./mainpage.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ClaimcancelRequest,
  deleteClaims,
  submitClaimRequest,
  submitReceiptList,
} from "../../../services/ApiService";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
function MainPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [groupValue, setGroupValue] = useState(null);
  const [column, setColumn] = useState();
  const [apiCall, setApiCall] = useState();
  const navigate = useNavigate();
  const [cashExp, setCashExp] = useState();
  const [corpExp, setCorpExp] = useState();
  const [totalExp, setTotalExp] = useState();
  const reduxclaimno = useSelector((state) => state.claimno);
  const [data, setData] = useState([]);
  useEffect(() => {
    submitReceiptList(reduxclaimno).then((res) => {
      if (res.responseCode === 200) {
        setCashExp(res.cashTotal);
        setCorpExp(res.corporateTotal);
        setTotalExp(res.totalAmount);
        if (res.data.length > 0) {
          setData(res.data);
          const columns = Object.keys(res.data[0])
            .filter((key) => key !== "id") // Exclude 'id' column
            .map((key) => ({
              title: key.charAt(0).toUpperCase() + key.slice(1),
              dataIndex: key,
              key,
            }));

          // Add additional columns for the "Edit" and "Delete" buttons
          columns.push(
            {
              title: "Edit",
              key: "edit",
              render: (text, record) => (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(record.id, record.category)}
                >
                  Edit
                </Button>
              ),
            }
            // {
            //   title: 'Delete',
            //   key: 'delete',
            //   render: (text, record) => (
            //     <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleCheckboxChange(record)}>
            //       Delete
            //     </Button>
            //   ),
            // }
          );

          setColumn(columns);
        }
      } else {
        message.error(res.responseMessage);
      }
    });
    const checkScreenSize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [apiCall]);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  const handleRadioChange = (e, groupName) => {
    const { value } = e.target;
    setSelectedValue(value);
    setGroupValue(groupName);
  };
  // const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // const handleCheckboxChange = (row) => {
  //   const newSelectedRows = [...selectedRows];

  //   const existingIndex = newSelectedRows.findIndex(
  //     (selectedRow) => selectedRow.id === row.id
  //   );

  //   if (existingIndex !== -1) {
  //     // If already selected, remove from the list
  //     newSelectedRows.splice(existingIndex, 1);
  //   } else {
  //     // If not selected, add to the list
  //     newSelectedRows.push(row);
  //   }

  //   setSelectedRows(newSelectedRows);
  // };

  const handleEditClick = (id, category) => {
    navigate("/create-expense", { state: { id: id, category: category } });
  };

  const handleDeleteClick = () => {
    // Log the IDs of selected checkboxes
    const selectedIds = selectedRows.map((row) => row.id);
    let body = {
      id: selectedIds,
    };
    deleteClaims(body).then((res) => {
      if (res.responseCode === 200) {
        message.success("Deleted");
        setApiCall(body);
      } else {
        message.error(res.responseMessage);
      }
    });
  };
  const onSubmit = () => {
    let body = {
      claimNumber: reduxclaimno,
      status: "submitted",
    };
    submitClaimRequest(body).then((res) => {
      if (res.responseCode === 200) {
        message.success("Submitted Successfully");
        navigate("/dashboard-expense");
      } else {
        message.error(res.responseMessage);
      }
    });
  };
  const onCancel = () => {
    let body = {
      claimNumber: reduxclaimno,
    };
    ClaimcancelRequest(body).then((res) => {
      if (res.responseCode === 200) {
        message.success("Request Canceled Successfully");
        navigate("/dashboard-expense");
      } else {
        message.error(res.responseMessage);
      }
    });
  };
  console.log(data)
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
            <Header expense={true} travel={false} />
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button
              disabled={selectedValue?false:true}
                style={{
                  backgroundColor: "#E93B77",
                  color: "white",
                  marginTop: "1rem",
                }}
                onClick={() =>
                  navigate(
                    `/create-expense?data=${encodeURIComponent(
                      groupValue + "-" + selectedValue
                    )}`
                  )
                }
              >
                Create an Expense
              </Button>
            </div>

            <Row>
              <Col lg={7}>
                <div
                  className="scroll-container"
                  style={{
                    backgroundColor: "white",
                    height: "73vh",
                    marginTop: "0.5rem",
                    borderRadius: "17px",
                    padding: "0.5rem 0.5rem 0.5rem 0.5rem",
                  }}
                >
                  <Row>
                    <Col lg={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>Communication</span>
                        <Radio.Group
                          value={selectedValue}
                          onChange={(e) =>
                            handleRadioChange(e, "Communication")
                          }
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Radio value="Internet">Internet</Radio>
                            <Radio value="Mobile/Telephone">
                              Mobile/Telephone
                            </Radio>
                            <Radio value="Other Communication">Other</Radio>
                          </div>
                        </Radio.Group>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>
                          Travel Expense
                        </span>
                        <Radio.Group
                          value={selectedValue}
                          onChange={(e) =>
                            handleRadioChange(e, "Travel Expense")
                          }
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Radio value="Hotel">Hotel</Radio>
                            <Radio value="Laundry">Laundry</Radio>
                            <Radio value="Other Travel Expense">Other</Radio>
                          </div>
                        </Radio.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>
                          Transportations
                        </span>
                        <Radio.Group
                          value={selectedValue}
                          onChange={(e) =>
                            handleRadioChange(e, "Transportations")
                          }
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Radio value="Taxi">Taxi</Radio>
                            <Radio value="Client Transport">
                              Client Transport
                            </Radio>
                            <Radio value="Car Rental">Car Rental</Radio>
                            <Radio value="Train">Train</Radio>
                            <Radio value="Air Fare">Air Fare</Radio>{" "}
                            <Radio value="Bus">Bus</Radio>
                            <Radio value="Parking">Parking</Radio>
                            <Radio value="Other Transportation">Other</Radio>
                          </div>
                        </Radio.Group>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>Entertainment</span>
                        <Radio.Group
                          value={selectedValue}
                          onChange={(e) =>
                            handleRadioChange(e, "Entertainment")
                          }
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Radio value="Team Lunch/Dinner">
                              Team Lunch/Dinner
                            </Radio>
                            <Radio value="Client Lunch/Dinner">
                              Client Lunch/Dinner
                            </Radio>
                            <Radio value="Business Meal">Business Meal</Radio>
                            <Radio value="Other Entertainment">Other</Radio>
                          </div>
                        </Radio.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>Institutional</span>
                        <Radio.Group
                          value={selectedValue}
                          onChange={(e) =>
                            handleRadioChange(e, "Institutional")
                          }
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Radio value="Books">Books</Radio>
                            <Radio value="Degree Program">Degree Program</Radio>
                            <Radio value="Professional Certificate">
                              Professional Certificate
                            </Radio>
                            <Radio value="Other Institutional">Other</Radio>
                          </div>
                        </Radio.Group>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>Fees</span>
                        <Radio.Group
                          onChange={(e) => handleRadioChange(e, "Fees")}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Radio value="Entry Fees">Entry Fees</Radio>
                            <Radio value="Exhibit Fees">Exhibit Fees</Radio>
                            <Radio value="Passport/Visa Fees">
                              Passport/Visa Fees
                            </Radio>
                          </div>
                        </Radio.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>IT Assets</span>
                        <Radio.Group
                          onChange={(e) => handleRadioChange(e, "IT Assets")}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Radio value="Mouse/Keyboard">Mouse/Keyboard</Radio>
                            <Radio value="Computer Repair">
                              Computer Repair
                            </Radio>
                            <Radio value="Other IT Assets">Other</Radio>
                          </div>
                        </Radio.Group>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>Others</span>
                        <Radio.Group
                          onChange={(e) => handleRadioChange(e, "Others")}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Radio value="Miscellaneous">Miscellaneous</Radio>
                            <Radio value="Courier Charges">
                              Courier Charges
                            </Radio>
                            <Radio value="Fitness Reimbursement">
                              Fitness Reimbursement
                            </Radio>
                          </div>
                        </Radio.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={24}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>Credit Card</span>
                        <Radio.Group
                          onChange={(e) => handleRadioChange(e, "Credit Card")}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Radio value="Import Corporate Credit Card Statement">
                              Import Corporate Credit Card Statement
                            </Radio>
                          </div>
                        </Radio.Group>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col lg={17}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "0.5rem",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Claim No.:</span>
                    <span style={{ color: "#3052D0", fontWeight: "500" }}>
                      {reduxclaimno}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Cash Expense:</span>
                    <span style={{ color: "#3052D0", fontWeight: "500" }}>
                      {cashExp}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Corporate Card:</span>
                    <span style={{ color: "#3052D0", fontWeight: "500" }}>
                      {corpExp}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Total:</span>
                    <span style={{ color: "#3052D0", fontWeight: "500" }}>
                      {sessionStorage.getItem("currency")} {totalExp}
                    </span>
                  </div>
                  {/* <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Total:</span>
                    <span style={{ color: "#3052D0", fontWeight: "500" }}>
                      testing
                    </span>
                  </div> */}
                </div>
                <div
                  // className="scroll-container"
                  style={{
                    backgroundColor: "white",
                    height: "67vh",
                    marginTop: "0.5rem",
                    borderRadius: "17px",
                    padding: "0.5rem 0.5rem 0.5rem 0.5rem",
                    margin: "1rem 1rem 0 1rem",
                  }}
                >
                  <div className="scroll-container" style={{ height: "60vh" }}>
                    <Table
                      dataSource={data}
                      columns={column}
                      rowKey="id"
                      rowSelection={{
                        onChange: (_, selectedRows) => {
                          setSelectedRows(selectedRows);
                        },
                      }}
                      // scroll={{ y: true }}
                      sticky
                      pagination={false}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "6rem",
                    }}
                  >
                    <Link
                      style={{ color: "red", textDecorationLine: "underline" }}
                      type="primary"
                      onClick={handleDeleteClick}
                    >
                      <DeleteOutlined /> Delete Selected
                    </Link>
                    <Button
                    
                    disabled={data.length>0?false:true}
                      style={{ backgroundColor: "green", color: "white" }}
                      onClick={() => {
                        onSubmit();
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      style={{ backgroundColor: "red", color: "white" }}
                      onClick={() => {
                        onCancel();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  );
}

export default MainPage;
