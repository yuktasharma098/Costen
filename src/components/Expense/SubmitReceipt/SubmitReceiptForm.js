import React, { useEffect, useRef, useState } from "react";
import Footer from "../../Footer";
import DatePicker from "react-datepicker";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Tag,
  message,
} from "antd";
import SideBar from "../../SideBar";
import Header from "../../Header";
import "../../datepicker.css";
import { submitexpenseadd } from "../../../redux/actions";

import { claimno } from "../../../redux/actions";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileTextOutlined } from "@ant-design/icons";
import {
  ClaimcancelRequest,
  PreviewFile,
  currencyList,
  exchangeRate,
  ocr,
  submitReceiptGet,
  submitReceiptPost,
} from "../../../services/ApiService";
const { TextArea } = Input;
function formatDate(date) {
  if (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return "";
}
function SubmitReceiptForm() {
 
  const { state } = useLocation();
  const id = state?.id;
  const categoryFromMain = state?.category?state.category:"";
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yourData = queryParams.get("data");
  const [claimNo, setClaimNo] = useState();
  const [modalFile, setModalFile] = useState(null);
  const [modalFileType, setModalFileType] = useState("");
  const [file, setFile] = useState(null);
  const [openpreview, setOpenpreview] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [billDate, setBillDate] = useState();
  const allowedFormats = ["pdf", "jpeg", "jpg", "heic", "png"];
  const [spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
const isFirstRun = useRef(true);
  const {getFieldValue, setFieldsValue } = form;
const categoryForTags=yourData?yourData:categoryFromMain
  const [currencyListData, setCurrencyListData] = useState();
const[receiptUploaded,setReceiptUploaded]= useState(false)
  const navigate = useNavigate();
  const reduxclaimno = useSelector((state) => state.claimno);
  const [billFile, setBillFile] = useState();
  const [billFileOriginal, setBillFileOriginal] = useState();
  const costCenterapp=sessionStorage.getItem("costCenter")

  useEffect(() => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear()).slice(-2);
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const formattedDateTime = `${day}${month}${year}${hours}${minutes}${seconds}`;
    const full = "CN" + formattedDateTime;
    if (!reduxclaimno) {
      dispatch(claimno(full));
    }
    setClaimNo(full);
    form.setFieldsValue({
      category: yourData ? yourData : categoryFromMain,
      department:sessionStorage.getItem("department"),
      costCenter:sessionStorage.getItem("costCenter")
    });
  }, []);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    Modal.info({
      content: (
        <span style={{ fontWeight: "600" }}>
          Please upload your receipt before filling any data, and
          system will fill the data on your behalf. Later you can
          validate the same
        </span>
      ),
      centered: true,
    });
    if (id) {
  
      submitReceiptGet(id).then((res) => {
        if (res.responseCode === 200) {
          setTags(res.data?.teamName)
          form.setFieldsValue({
            category: res.data.category,
            billAmount: res.data.billAmount,
            billCurrency: res.data.billCurrency,
            expenseType: res.data.expenseType,
            billNumber: res.data.billNumber,
            billDate:
              res.data.billDate !== null ? new Date(res.data.billDate) : null,
            exchangeRate: res.data.exchangeRate,
            finalAmount: res.data.finalAmount,
            establishmentName: res.data.establishmentName,
            department:res.data.department,
            costCenter:res.data.costCenter?res.data.costCenter:costCenterapp,
             remark: res.data.remark,
          });
       

          setBillDate(
            res.data.billDate !== null ? new Date(res.data.billDate) : null
          );
          setBillFile(res.data.fileName);
          setBillFileOriginal(res.data.originalFileName);
        } else {
          message.error(res.responseMessage);
        }
      });
    }
  }, [id]);
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const filterOption = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  const handleBillAmountChange = (value) => {
    const exchangeRate = getFieldValue("exchangeRate");
    const finalAmount = exchangeRate * value;
    setFieldsValue({ finalAmount });
  };
  const handleExchangeRateChange = (value) => {
    const billAmount = getFieldValue("billAmount");
    const finalAmount = billAmount * value;
    setFieldsValue({ finalAmount });
  };

  useEffect(() => {
    currencyList().then((res) => {
      if (res.responseCode === 200) {
        const arr = res.data;
        arr.push("Other");
        setCurrencyListData(arr);
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
  }, []);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  const handleDateChange = (date) => {
    setBillDate(date);
  };
  const onFileChange = (e) => {
    setReceiptUploaded(true)
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();

      if (allowedFormats.includes(fileType)) {
        const ocrform = new FormData();

        ocrform.append("file", selectedFile);

        setSpinner(true);
        ocr(ocrform)
          .then((res) => {
            if (res.responseCode === 200) {
              setSpinner(false);
              form.setFieldsValue({
                billAmount: res.fileData.billAmount,
                billDate:
                  res.fileData.billDate !== null
                    ? new Date(res.fileData?.billDate)
                    : null,
                billNumber: res.fileData.billNumber,
                establishmentName: res.fileData.establishmentName,
              });

              setBillDate(
                res.fileData.billDate !== null
                  ? new Date(res.fileData?.billDate)
                  : null
              );
            } else {
              setSpinner(false);
              message.error(res.responseMessage);
            }
          })
          .catch((error) => {
            setSpinner(false);
            message.error(error);
          });

        form.setFieldValue({
          file: selectedFile,
        });
        setFile(selectedFile);
        setModalFile(selectedFile);
        setModalFileType(fileType);
        // setFileType(fileType);
      } else {
        alert(
          "Invalid file format. Please upload a PDF, JPEG, JPG, or HEIC file."
        );
      }
    }
  };
  const previewStyle = {
    maxWidth: "100%",
    maxHeight: "400px",
    margin: "20px 0",
  };
  const onFinish = (value) => {
    value.billDate = formatDate(value.billDate);
    if (file) {
      value["file"] = file;
    } else if (billFile) {
      value["fileName"] = billFile;
      value["originalFileName"] = billFileOriginal;
    }
    if (tags.length > 0) {
      value["teamName"] = tags;
    }
    value["selfDeclaration"] = agreed === "false" ? 0 : 1;
    const formDatatry = new FormData();
    console.log(value)
    Object.entries(value).forEach(([key, value]) => {
      formDatatry.append(`${key}`, value);
    });
    if (id) {
      formDatatry.append("id", id);
    }
    formDatatry.append("claimNumber", reduxclaimno ? reduxclaimno : claimNo);
    formDatatry.append("empId", sessionStorage.getItem("employeeId"));
    submitReceiptPost(formDatatry).then((res) => {
      if (res.responseCode === 200) {
        message.success("Saved");
      } else {
        message.error(res.responseMessage);
      }
    });
    dispatch(submitexpenseadd([]));
  };
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }

    setInputVisible(false);
    setInputValue("");
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
  const handleTagClose = (removedTag) => {
    const updatedTags = tags.filter((tag) => tag !== removedTag);
    setTags(updatedTags);
  };
  const handleBillCurrency = (value) => {
    exchangeRate(value, sessionStorage.getItem("currency")).then((res) => {
      if (res.responseCode === 200) {
        form.setFieldsValue({
          exchangeRate: res.exchangeRate,
        });
        const billAmount = getFieldValue("billAmount");
        const finalAmount = res.exchangeRate * billAmount;
        setFieldsValue({ finalAmount });
      } else {
        message.error(res.responseMessage);
      }
    });
  };
  const handleDownloadClick = (backendLink) => {
    window.open(backendLink, "_blank");
  };
  console.log(declaration,receiptUploaded)
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "5rem",
                marginBottom: "0.5rem",
                marginTop: "1.3rem",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "0.5rem",
                  marginLeft: "1.4rem",
                }}
              >
                <span style={{ fontWeight: "600" }}>Claim No:</span>
                <span style={{ color: "#3052D0", fontWeight: "500" }}>
                  {reduxclaimno ? reduxclaimno : claimNo}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "0.3rem",
                  marginRight: "2.7rem",
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
            </div>
            <div
              style={{
                overflow: "auto",
                backgroundColor: "white",
                margin: "1rem 1.5rem 0 0",
                display: "flex",
                justifyContent: "flex-start",
                borderRadius: "5px",
                padding: "0.4rem 1rem 1rem 1rem",
                flexDirection: "column",
              }}
            >
              <Spin spinning={spinner} tip="Fetching Data ..." size="large">
                <Form onFinish={onFinish} form={form} layout="horizontal">
                  <div
                    style={{
                      marginTop: "0.5rem",
                      height: "65vh",
                    }}
                  >
                    <Row gutter={15}>
                      <Col lg={5}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label style={{ fontWeight: "600" }}>Category:</label>
                          <Form.Item name="category">
                            <Input disabled placeholder="Enter Category" />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label style={{ fontWeight: "600" }}>
                            Requested Currency:
                          </label>
                          {/* <Form.Item name="requestedCurrency"> */}
                          <Input
                            disabled
                            value={sessionStorage.getItem("currency")}
                            placeholder="Enter Requested Currency"
                          />
                          {/* </Form.Item> */}
                        </div>
                      </Col>
                      <Col lg={5}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label style={{ fontWeight: "600" }}>
                            Expense Type:
                          </label>
                          <Form.Item name="expenseType">
                            <Select placeholder="Select Expense Type">
                              <Select.Option key="cash" value="cash">
                                Cash
                              </Select.Option>
                              <Select.Option
                                key="cooperateCard"
                                value="cooperateCard"
                              >
                                Cooperate Card
                              </Select.Option>
                           
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label style={{ fontWeight: "600" }}>
                            Bill Number:
                          </label>
                          <Form.Item name="billNumber">
                            <Input placeholder="Enter Bill Number" />
                          </Form.Item>
                        </div>
                      </Col>{" "}
                      <Col lg={6}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label style={{ fontWeight: "600" }}>
                            Bill Date:
                          </label>
                          <Form.Item name="billDate">
                            <DatePicker
                              selected={billDate}
                              onChange={(date) => handleDateChange(date)}
                              // className="form-control"
                              placeholderText="Select Bill Date"
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={15}>
                      <Col lg={4}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label style={{ fontWeight: "600" }}>
                            Bill Currency:
                          </label>
                          <Form.Item name="billCurrency">
                            <Select
                              listItemHeight={10}
                              listHeight={200}
                              showSearch
                              onChange={(value) => handleBillCurrency(value)}
                              onSearch={onSearch}
                              filterOption={filterOption}
                              placeholder="Select Bill Currency"
                              virtual={true}
                            >
                              {currencyListData?.map((option) => (
                                <Select.Option key={option} value={option}>
                                  {option}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                      <Col lg={5}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label style={{ fontWeight: "600" }}>
                            Bill Amount:
                          </label>
                          <Form.Item name="billAmount">
                            <input
                              onChange={(e) =>
                                handleBillAmountChange(e.target.value)
                              }
                              className="inputclass"
                              type="number"
                              placeholder="Enter Bill Amount"
                            />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col lg={5}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label style={{ fontWeight: "600" }}>
                            Exchange Rate:
                          </label>
                          <Form.Item name="exchangeRate">
                            <Input   onChange={(e) =>
                                handleExchangeRateChange(e.target.value)
                              } placeholder="Enter Exchange Rate" />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col lg={5}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label style={{ fontWeight: "600" }}>
                            Final Amount:
                          </label>
                          <Form.Item name="finalAmount">
                            <Input disabled placeholder="Enter Final Amount" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col lg={5}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <label style={{ fontWeight: "600" }}>
                              Establishment Name:
                            </label>
                            <Form.Item name="establishmentName">
                              <Input placeholder="Enter Establishment Name" />
                            </Form.Item>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={15}>
                      <Col lg={6}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "1rem",
                          }}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <label style={{ fontWeight: "600" }}>Remark:</label>
                            <Form.Item
                              className="custom-form-item"
                              name="remark"
                            >
                              <TextArea
                                className="custom-radio-group"
                                rows={3}
                                placeholder="Please give remark if any"
                                autoSize={{ minRows: 2, maxRows: 3 }}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "1rem",
                          }}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <label style={{ fontWeight: "600" }}>Cost Center:</label>
                            <Form.Item
                              className="custom-form-item"
                              name="costCenter"
                            >
                              <Input
                                placeholder="Enter Cost Center"
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "1rem",
                          }}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <label style={{ fontWeight: "600" }}>Department:</label>
                            <Form.Item
                              className="custom-form-item"
                              name="department"
                            >
                              <Input
                              disabled
                                placeholder="Enter Department"
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </Col>
                      {categoryForTags?.split("-")[1] == "Team Lunch/Dinner" && (
                        <Col lg={6}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <label style={{ fontWeight: "600" }}>
                              Team/Employee Name 
                            </label>
                            <div style={{ marginTop: "0.5rem",height:'15vh',overflowY:'auto' }}>
                              {tags.map((tag, index) => (
                                <Tag
                                  key={index}
                                  closable
                                  onClose={() => handleTagClose(tag)}
                                >
                                  {tag}
                                </Tag>
                              ))}
                              {inputVisible && (
                                <Input
                                  type="text"
                                  size="middle"
                                  style={{ width: 90 }}
                                  value={inputValue}
                                  onChange={handleInputChange}
                                  onBlur={handleInputConfirm}
                                  onPressEnter={handleInputConfirm}
                                />
                              )}
                              {!inputVisible && (
                                <Button
                                  size="small"
                                  type="dashed"
                                  onClick={showInput}
                                >
                                  + Add Employee Name
                                </Button>
                              )}
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                    >
                      <label
                        style={{
                          width: "15%",
                          height: "33px",
                          backgroundColor: "#534ECC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="file"
                          accept=".pdf, .jpeg, .jpg, .heic, .png"
                          onChange={onFileChange}
                          style={{ display: "none" }}
                        />
                        <span style={{ color: "white" }}>Upload a Receipt</span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="icon/24px/account-edit">
                            <path
                              id="Vector"
                              d="M18.084 11.125L17.2507 11.9584L15.5423 10.25L16.3757 9.41671C16.5507 9.24171 16.8423 9.24171 17.0173 9.41671L18.084 10.4834C18.259 10.6584 18.259 10.95 18.084 11.125ZM10.0007 15.7834L15.0507 10.7334L16.759 12.4417L11.7173 17.5H10.0007V15.7834ZM10.0007 11.6667C6.31732 11.6667 3.33398 13.1584 3.33398 15V16.6667H8.33398V15.0917L11.6673 11.7584C11.1173 11.6917 10.559 11.6667 10.0007 11.6667ZM10.0007 3.33337C9.1166 3.33337 8.26875 3.68456 7.64363 4.30968C7.01851 4.93481 6.66732 5.78265 6.66732 6.66671C6.66732 7.55076 7.01851 8.39861 7.64363 9.02373C8.26875 9.64885 9.1166 10 10.0007 10C10.8847 10 11.7326 9.64885 12.3577 9.02373C12.9828 8.39861 13.334 7.55076 13.334 6.66671C13.334 5.78265 12.9828 4.93481 12.3577 4.30968C11.7326 3.68456 10.8847 3.33337 10.0007 3.33337Z"
                              fill="white"
                            />
                          </g>
                        </svg>
                      </label>
                      {file ? (
                        <div
                          onClick={() => {
                            setModalFile(file);
                            setModalFileType(
                              file?.name.split(".").pop().toLowerCase()
                            );
                            setOpenpreview(true);
                          }}
                          style={{
                            marginTop: "1.2rem",
                            display: "flex",
                            flexDirection: "row",
                            cursor: "pointer",
                          }}
                        >
                          <FileTextOutlined style={{ fontSize: "15px" }} />
                          <span> {file?.name}</span>
                        </div>
                      ) : billFile ? (
                        <div
                          onClick={() => {
                            PreviewFile(billFile).then((res) => {
                              handleDownloadClick(res.fileUrl);
                            });
                          }}
                          style={{
                            marginTop: "1.2rem",
                            display: "flex",
                            flexDirection: "row",
                            cursor: "pointer",
                          }}
                        >
                          <FileTextOutlined style={{ fontSize: "15px" }} />
                          <span> {billFileOriginal}</span>
                        </div>
                      ) : (
                        <></>
                      )}
                   
                    </div>
                    <Link
                      onClick={() => setDeclaration(true)}
                      style={{ color: "#E93B77", textDecoration: "underline" }}
                    >
                      *Click here in case of no bill
                    </Link>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      style={{
                        width: "8.5rem",
                        backgroundColor: "darkgray",
                        border: "none",
                        color: "white",
                        marginRight: "1.5rem",
                      }}
                      onClick={() => navigate("/main-page")}
                    >
                      Back
                    </Button>
                    <Button
                    disabled={agreed ? false:(receiptUploaded ? false:true)}
                      style={{
                        width: "8.5rem",
                        backgroundColor: "#3052D0",
                        border: "none",
                        color: "white",
                        marginRight: "1.5rem",
                      }}
                      htmlType="submit"
                    >
                      Save
                    </Button>

                    {/* <Button
                      style={{
                        width: "8.5rem",
                        backgroundColor: "transparent",
                        border: "1px solid red",
                        color: "red",
                      }}
                      onClick={()=>{onCancel()}}
                    >
                      Cancel
                    </Button> */}
                  </div>
                </Form>
              </Spin>
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
      <Modal
        bodyStyle={{ padding: "10px" }}
        centered={true}
        style={{ padding: "50px" }}
        open={declaration}
        onCancel={() => {
          setDeclaration(false);
          setAgreed(false);
        }}
        footer={[
          <>
            <Checkbox
              style={{ marginRight: "1rem", fontWeight: "500" }}
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            >
              I Agree
            </Checkbox>
            <Button
              style={{ backgroundColor: "#3052D0" }}
              disabled={!agreed}
              key="submit"
              type="primary"
              onClick={() => setDeclaration(false)}
            >
              Submit Declaration
            </Button>
          </>,
        ]}
      >
        <div>
          <span style={{ fontWeight: "500" }}>
            I am formally seeking a reimbursement for services that I have
            availed of, although I lack an accompanying invoice.
            <br /> I affirm unequivocally that I have made use of the services
            in accordance with the agreed terms, and I am confident regarding
            the precise amount eligible for reimbursement. Regrettably, a bill
            or receipt cannot be submitted alongside this request, as the vendor
            did not provide one.
            <br /> I accept full responsibility for ensuring that the requested
            amount was utilized solely for business-related purposes.
          </span>
        </div>
      </Modal>
      {openpreview ? (
        <Modal
          title={modalFile.name}
          centered={false}
          style={{ top: "0px" }}
          open={openpreview}
          onCancel={() => setOpenpreview(false)}
          footer={false}
          width={800}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              overflow: "auto",
            }}
          >
            {modalFileType === "pdf" ? (
              <iframe
                src={URL.createObjectURL(modalFile)}
                title="PDF Preview"
                width="100%"
                height="450px"
              />
            ) : (
              <img
                src={URL.createObjectURL(modalFile)}
                alt="Preview"
                style={previewStyle}
              />
            )}
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SubmitReceiptForm;
