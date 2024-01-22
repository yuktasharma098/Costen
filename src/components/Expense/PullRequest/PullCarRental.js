import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../datepicker.css";
import "../../carrental.css";
import { carRental } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  ExpenseCancelRequest,
  PreviewFile,
  cancelRequest,
  clearRequest,
  currencyList,
  exchangeRate,
  expenseClear,
  expensetransport,
  getExpenseTransport,
  getTransport,
  ocr,
  postTransport,
  transport,
} from "../../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { FileTextOutlined, UploadOutlined } from "@ant-design/icons";

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
function PullCarRental({ triggerParentEffect }) {
  const [disabledExchange, setDisabledExchange] = useState(true);
  const [openpreview, setOpenpreview] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [billdate, setBillDate] = useState(null);
  const [form, setform] = useState({
    estimateCost: "",
    startDate: "",
    endDate: "",
    billCurrency: "",
    billAmount: "",
    billDate: null,
    billNumber: "",
    establishmentName: "",
    file: "",
    exchangeRate: "",
    finalAmount: "",
    billFile: "",
    billFileOriginal: "",
    expenseType: "",
    comment: "",
  });
  const allowedFormats = ["pdf", "jpeg", "jpg", "heic", "png"];

  const requestid = useSelector((state) => state.requestedid);
  const userType = sessionStorage.getItem("userType");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const carRentalData = useSelector((state) => state.carRental);
  const dispatch = useDispatch();
  const [modalFile, setModalFile] = useState(null);
  const [modalFileType, setModalFileType] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currencyListData, setCurrencyListData] = useState([]);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const today = new Date();
  const handleSave = () => {
    form["startDate"] = formatDate(startDate);
    form["endDate"] = formatDate(endDate);
    form["billDate"] = formatDate(billdate);
    for (let key in form) {
      if (typeof form[key] === "number" && isNaN(form[key])) {
        form[key] = 0;
      }
    }

    for (const key in form) {
      if (form["billFile"] === "" || form["billFileOriginal"] === "") {
        delete form["billFile"];
        delete form["billFileOriginal"];
      } else if (form["file"] === "") {
        delete form["file"];
      }
    }
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(`${key}`, value);
    });
    formData.append("requestId", requestid);
    formData.append("employeeId", sessionStorage.getItem("employeeId"));
    // console.log(formData);
    // let obj = {
    //   requestId: requestid,
    //   employeeId: sessionStorage.getItem("employeeId"),
    //   transportType: "carRental",
    //   estimateCost: value.estimateCostCarRental,
    //   comment: value.comment1,
    //   startDate: formatStartDate,
    //   endDate: formatEndDate,
    // };
    // if (
    //   Object.values(obj).some(
    //     (value) =>
    //       value !== null && value !== "" && value !== undefined && !isNaN(value)
    //   )
    // ) {
    //   postTransport("carRental", obj).then((res) => {
    //     if (res.responseCode === 200) {
    //       message.success("Car Rental Data Saved Succesfully");
    //     } else {
    //       message.error(res.responseMessage);
    //     }
    //   });
    //   let reduxobj = {
    //     transportType: "carRental",
    //     estimateCost: value.estimateCostCarRental,
    //     comment: value.comment1,
    //     startDate: formatStartDate,
    //     endDate: formatEndDate,
    //   };
    //   dispatch(carRental(reduxobj));
    // } else {
    //   message.error("Add full data for car rental to save");
    // }
    expensetransport(formData, "carRental").then((res) => {
      if (res.responseCode === 200) {
        triggerParentEffect(formData);
        message.success("Car Rental Save Successfully");
      } else {
        message.error(res.responseMessage);
      }
    });
    // console.log(form);
  };
  const handleDownloadClick = (backendLink) => {
    window.open(backendLink, "_blank");
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const filterOption = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  const previewStyle = {
    maxWidth: "100%",
    maxHeight: "400px",
    margin: "20px 0",
  };

  const handleFinalAmountCalculation = () => {
    const exchangeRate = parseFloat(form.exchangeRate);
    const billAmount = parseFloat(form.billAmount);

    if (!isNaN(exchangeRate) && !isNaN(billAmount)) {
      const finalAmount = exchangeRate * billAmount;
      setform((prevForm) => ({
        ...prevForm,
        finalAmount: finalAmount.toFixed(2), // Adjust the decimal places as needed
      }));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  };
  const handleBillDateChange = (date) => {
    setBillDate(date);
  };
  const handleBillCurrency = (value) => {
    setform({ ...form, ["billCurrency"]: value });

    if (value === "Other") {
      setDisabledExchange(false);
    } else {
      setDisabledExchange(true);
      exchangeRate(value, sessionStorage.getItem("currency")).then((res) => {
        if (res.responseCode === 200) {
          setform({
            ...form,
            ["exchangeRate"]: res.exchangeRate,
            ["billCurrency"]: value,
          });
        } else {
          message.error(res.responseMessage);
        }
      });
    }
  };
  useEffect(() => {
    handleFinalAmountCalculation();
  }, [form.exchangeRate, form.billAmount]);
  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();

      if (allowedFormats.includes(fileType)) {
        const ocrform = new FormData();

        ocrform.append("file", selectedFile);
        // if (
        //   form["billAmount"] !== "" &&
        //   form["billDate"] !== null &&
        //   form["billNumber"] !== "" &&
        //   form["establishmentName"] !== ""
        // ) {
        //   console.log(
        //     onewayform["billAmountoneway"],
        //     onewayform["billDateoneway"],
        //     onewayform["billNumberoneway"],
        //     onewayform["establishmentNameoneway"]
        //   );
        // } else {
        setSpinner(true);
        ocr(ocrform)
          .then((res) => {
            if (res.responseCode === 200) {
              setSpinner(false);
              form["billAmount"] = res.fileData.billAmount;
              form["billDate"] =
                res.fileData.billDate !== null
                  ? new Date(res.fileData?.billDate)
                  : null;
              form["billNumber"] =
                res.fileData.billNumber !== null ? res.fileData.billNumber : "";
              form["establishmentName"] = res.fileData.establishmentName;
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
        // }

        form["billFile"] = "";
        form["billFileOriginal"] = "";

        form["file"] = selectedFile;
        setModalFile(selectedFile);
        setModalFileType(fileType);
      } else {
        alert(
          "Invalid file format. Please upload a PDF, JPEG, JPG, or HEIC file."
        );
      }
    }
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
    getExpenseTransport(requestid).then((res) => {
      if (res.responseCode === 200) {
        if (res.data.length > 0) {
          let getCarRentalData = res.data?.filter(
            (item) => item.transportType === "carRental"
          );
          if (getCarRentalData.length > 0) {
            setStartDate(
              new Date(
                getCarRentalData[0].startDate !== null
                  ? new Date(getCarRentalData[0]?.startDate)
                  : null
              )
            );
            setEndDate(
              getCarRentalData[0].endDate !== null
                ? new Date(getCarRentalData[0]?.endDate)
                : null
            );
            setBillDate(
              getCarRentalData[0].billDate !== null
                ? new Date(getCarRentalData[0]?.billDate)
                : null
            );
            const initialFormDataArray = {
              startDate:
                getCarRentalData[0].startDate !== null
                  ? new Date(getCarRentalData[0]?.startDate)
                  : null,
              endDate:
                getCarRentalData[0].endDate !== null
                  ? new Date(getCarRentalData[0]?.endDate)
                  : null,
              billAmount: getCarRentalData[0].billAmount || "",
              establishmentName: getCarRentalData[0].establishmentName,
              billCurrency: getCarRentalData[0].billCurrency,
              billNumber: getCarRentalData[0].billNumber,
              exchangeRate: getCarRentalData[0].exchangeRate,
              expenseType: getCarRentalData[0].expenseType,
              billFile: getCarRentalData[0].billFile,
              billFileOriginal: getCarRentalData[0].billFileOriginalName,
              finalAmount: getCarRentalData[0].finalAmount,
              billDate:
                getCarRentalData[0].billDate !== null
                  ? new Date(getCarRentalData[0]?.billDate)
                  : null,
            };
            setform(initialFormDataArray);
          }
        }
      } else {
        message.error(res.responseMessage);
      }
    });
    // if (Object.keys(carRentalData).length > 0) {
    //   form.setFieldsValue({
    //     estimateCostCarRental: carRentalData.estimateCost,
    //     comment1: carRentalData.comment,
    //   });
    //   setStartDate(new Date(carRentalData.startDate));
    //   setEndDate(new Date(carRentalData.endDate));
    // }
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
      ExpenseCancelRequest(body).then((res) => {
        if (res.responseCode === 200) {
          message.success("Canceled the Request Successfully");
          navigate("/dashboard-expense");
          // if (userType == "1") {
          //   navigate("/dashboard-m");
          // } else {
          //   navigate("/dashboard");
          // }
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      navigate("/dashboard-expense");

      message.error("Data is not Saved Yet");
    }
  };
  const onClear = () => {
    if (requestid) {
      setStartDate(null);
      setEndDate(null);
      setBillDate(null);
      setform({
        estimateCost: "",
        startDate: "",
        endDate: "",
        billCurrency: "",
        billAmount: "",
        billDate: null,
        billNumber: "",
        establishmentName: "",
        file: "",
        exchangeRate: "",
        finalAmount: "",
        billFile: "",
        billFileOriginal: "",
        expenseType: "",
        comment: "",
      });
      let body = {
        requestId: requestid,
        requestType: "transport",
        transportType: "carRental",
      };
      expenseClear(body).then((res) => {
        if (res.responseCode === 200) {
          triggerParentEffect(body);
          message.success("Car Rental Data Cleared Successfully");
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      message.error("Please Save Travel Header Data");
    }
  };
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
          // overflowX: "hidden",
        }}
      >
      <Spin spinning={spinner} tip="Fetching Data ..." size="large">
    
      <div className="scroll-container-pull">
          <form
            // onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexWrap: "nowrap",
              padding: "20px",
              width: "40vw",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                Start Date
              </label>

              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                // required
                minDate={today} // Disable dates before today
                className="form-control"
                placeholderText="Select Start Date"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ color: "#2F3D4C", fontWeight: "600" }}>
                End Date
              </label>

              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                // required
                minDate={startDate || today} // Disable dates before start date or today
                className="form-control"
                placeholderText="Select End Date"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Estimate Cost</label>
              <input
                disabled
                style={{ width: "9vw" }}
                className="inputclass"
                name="estimateCost"
                type="number"
                value={form.estimateCost}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter Amount"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Establishment Name</label>
              <input
                className="inputclass"
                name="establishmentName"
                type="text"
                value={form.establishmentName}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter Establishment Name"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Bill Date</label>
              <DatePicker
                selected={billdate}
                onChange={handleBillDateChange}
                // className="form-control"
                placeholderText="Select Bill Date"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Bill Currency</label>
              <Select
                value={form.billCurrency}
                listItemHeight={10}
                listHeight={200}
                showSearch
                onChange={(value) => handleBillCurrency(value)}
                onSearch={onSearch}
                filterOption={filterOption}
                placeholder="Select Bill Currency"
                style={{ width: 200 }}
                virtual={true}
              >
                {currencyListData?.map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Bill Amount</label>
              <input
                className="inputclass"
                name="billAmount"
                type="number"
                value={form.billAmount}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter Bill Amount"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Bill Number</label>
              <input
                className="inputclass"
                name="billNumber"
                type="text"
                value={form.billNumber}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter Bill Number"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Requested Currency</label>
              <input
                className="inputclass"
                name="requestedCurrency"
                type="text"
                value={sessionStorage.getItem("currency")}
                disabled
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Exchange Rate</label>
              <input
                // disabled={disabledExchange}
                className="inputclass"
                name="exchangeRate"
                type="text"
                value={form.exchangeRate}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter Exchange Rate"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Final Amount</label>
              <input
                className="inputclass"
                name="finalAmount"
                type="text"
                value={form.finalAmount}
                disabled

                // placeholder="Enter Exchange Rate"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                marginRight: "0.4rem",
              }}
            >
              <label style={{ fontWeight: "600" }}>Expense Type</label>
              <Select
                value={form.expenseType}
                onChange={(e) => {
                  setform({ ...form, ["expenseType"]: e });
                  // onewayform["expenseTypeoneway"] = e;
                }}
                style={{ width: "13vw" }}
                placeholder="Select Expense Type"
              >
                <Select.Option key="cash" value="cash">
                  Cash
                </Select.Option>
                <Select.Option key="cooperateCard" value="cooperateCard">
                Corporate Card
                </Select.Option>
                <Select.Option key="personalExpense" value="personalExpense">
                  Personal Expense
                </Select.Option>
              </Select>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",

                gap: "0.2rem",
                marginLeft: "0.5rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label
                  style={{
                    fontWeight: "600",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf, .jpeg, .jpg, .heic, .png"
                    onChange={onFileChange}
                    style={{ display: "none" }}
                  />
                  Upload
                  <UploadOutlined
                    style={{
                      marginLeft: "1rem",
                      marginTop: "0.4rem",
                      fontSize: "20px",
                      cursor: "pointer",
                      color: "#E93B77",
                    }}
                  />
                </label>

                {form.file ? (
                  <div
                    onClick={() => {
                      setModalFile(form.file);
                      setModalFileType(
                        form?.file?.name.split(".").pop().toLowerCase()
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
                    <span> {form.file?.name}</span>
                  </div>
                ) : form.billFile ? (
                  <div
                    onClick={() => {
                      PreviewFile(form.billFile).then((res) => {
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
                    <span> {form.billFileOriginal}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </form>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <label style={{ color: "#2F3D4C", fontWeight: "600" }}>Comment</label>
          <TextArea
            onChange={(e) => {
              form["comment"] = e.target.value;
            }}
            className="custom-radio-group"
            autoSize={{
              minRows: 2,
              maxRows: 3,
            }}
            placeholder="Please describe the taxi cost details here"
          />
        
        </div>
 
     
   
      </Spin>
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
      {openpreview ? (
        <Modal
          title={modalFile.name}
          centered={false}
          style={{ top: "0px" }}
          open={openpreview}
          // title="Are you sure, want to Cancel the whole request"
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

export default PullCarRental;
