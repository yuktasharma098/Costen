import { Button, Form, Modal, Select, Spin, message } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../datepicker.css";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hoteldata } from "../../../redux/actions";
import {
  CloseCircleOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./pullHotel.css";
import "./form.css";
import {
  ExpenseCancelRequest,
  PreviewFile,
  cancelRequest,
  clearRequest,
  currencyList,
  exchangeRate,
  expenseClear,
  expensegethotel,
  expensehotel,
  expensetransport,
  getHotelData,
  hotelRequest,
  ocr,
} from "../../../services/ApiService";
import { useNavigate } from "react-router-dom";
const initialFormData = {
  checkIn: null,
  checkOut: null,
  estimateCost: "",
  cityName: "",
  billCurrency: "",
  billAmount: "",
  billDate: null,
  billNumber: "",
  establishmentName: "",
  file: "",
  exchangeRate: "",
  finalAmount: "",
  expenseType: "",
  billFile: "",
  billFileOriginal: "",
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
function PullHotel({ triggerParentEffect }) {
  const dispatch = useDispatch();
  const[openSave,setOpenSave]=useState(false)
  const requestid = useSelector((state) => state.requestedid);
  const requestName = useSelector((state) => state.travelHeader.requestName);
  const [formData, setFormData] = useState([{ ...initialFormData, id: 0 }]);
  const [updatedData, setUpdatedData] = useState([
    { ...initialFormData, id: 0 },
  ]);
  const [openpreview, setOpenpreview] = useState(false);

  const [modalFile, setModalFile] = useState(null);
  const [modalFileType, setModalFileType] = useState("");

  const allowedFormats = ["pdf", "jpeg", "jpg", "heic", "png"];
  const idCounter = useRef(1);
  const userType = sessionStorage.getItem("userType");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [disabledExchange, setDisabledExchange] = useState(false);
  const isFirstRun = useRef(true);
  const [currencyListData, setCurrencyListData] = useState();
  const requestPolicy = useSelector(
    (state) => state.travelHeader.requestPolicy
  );
  const [request, setRequest] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const getNewForm = () => ({
    ...initialFormData,
    id: idCounter.current++,
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
    setDisabledExchange(true);
    if (field === "billCurrency") {
      if (value === "Other") {
        setDisabledExchange(false);
      }
      exchangeRate(value, sessionStorage.getItem("currency")).then((res) => {
        if (res.responseCode === 200) {
          newFormData[index]["exchangeRate"] = res.exchangeRate;
          newFormData[index]["finalAmount"] =
            newFormData[index].billAmount * newFormData[index].exchangeRate;
          setFormData(newFormData);

          const newUpdatedData = [...updatedData];
          newUpdatedData[index]["exchangeRate"] = res.exchangeRate;
          newUpdatedData[index]["finalAmount"] =
            newUpdatedData[index].billAmount *
            newUpdatedData[index].exchangeRate;
          setUpdatedData(newUpdatedData);
        }
      });
    }
    newFormData[index][field] = value;
    newFormData[index]["finalAmount"] =
      newFormData[index].billAmount * newFormData[index].exchangeRate;
    setFormData(newFormData);

    const newUpdatedData = [...updatedData];
    newUpdatedData[index][field] = value;
    newUpdatedData[index]["finalAmount"] =
      newUpdatedData[index].billAmount * newUpdatedData[index].exchangeRate;
    setUpdatedData(newUpdatedData);
  };

  const handleSave = () => {
    setOpenSave(false)
    const formattedData = updatedData.map((data) => ({
      ...data,
      startDate: formatDate(data.checkIn),
      endDate: formatDate(data.checkOut),
      billDate: formatDate(data.billDate),
      estimatedCost: parseInt(data.estimateCost, 10),
      billAmount: parseFloat(data.billAmount),
      finalAmount: parseFloat(data.finalAmount),
    }));
    const updatedArray = formattedData.map(
      ({ checkIn, checkOut, id, estimateCost, ...rest }) => rest
    );
    updatedArray.map(obj => {
    
      // Copy non-empty values to the new object
      for (const key in obj) {
        if (obj['billFile'] === '' || obj['billFileOriginal'] === '' ) {
          delete obj['billFile']
          delete obj['billFileOriginal']
        }
        else if(obj['file'] === ''){
          delete obj['file']

        }
      }
    
    });
    
    const filteredData = updatedArray.filter((obj) =>
      Object.values(obj).some(
        (value) => value !== null && value !== "" && !isNaN(value)
      )
    );
   
    const formDatatry = new FormData();

  
    // let obj = {
    //   requestId: requestid,
    //   hotels: filteredData,
    // };
    if (filteredData.length > 0) {
      filteredData.forEach((obj, index) => {
        Object.entries(obj).forEach(([key, value]) => {
          formDatatry.append(`objects[${index}][${key}]`, value);
        });
      });
      formDatatry.append("requestId", requestid);
      formDatatry.append("count", filteredData.length);
      expensehotel(formDatatry).then((res) => {
        if (res.responseCode === 200) {
          message.success("Saved");
          triggerParentEffect(formDatatry);

        } else {
          message.error(res.responseMessage);
        }
      });
      // hotelRequest(obj, requestPolicy).then((res) => {
      //   if (res.responseCode === 200) {
      //     message.success("Saved");
      //     triggerParentEffect(obj);
      //   } else {
      //     message.error(res.responseMessage);
      //   }
      // });
      const formattedDataRedux = updatedData.map((data) => ({
        ...data,
        startDate: formatDate(data.checkIn),
        endDate: formatDate(data.checkOut),
        endDate: formatDate(data.billDate),

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

    currencyList().then((res) => {
      if (res.responseCode === 200) {
        const arr = res.data;
        arr.push("Other");
        setCurrencyListData(arr);
      } else {
        message.error(res.responseMessage);
      }
    });
    if (requestid) {
      expensegethotel(requestid).then((res) => {
        if (res.responseCode === 200) {
          if (res.data) {
            if (res.data.length > 0) {
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
              const initialFormDataArray = res.data.map((obj) => ({
                checkIn:
                  obj.startDate !== null ? new Date(obj?.startDate) : null,
                checkOut: obj.endDate !== null ? new Date(obj?.endDate) : null,
                estimateCost: obj.estimatedCost || "",
                cityName: obj.cityName || "",
                billAmount: obj.billAmount || "",
                establishmentName: obj.establishmentName,
                billCurrency: obj.billCurrency,
                billNumber: obj.billNumber,
                exchangeRate: obj.exchangeRate,
                expenseType: obj.expenseType,
                billFile: obj.billFile,
                billFileOriginal: obj.billFileOriginalName,
                finalAmount: obj.finalAmount,
                billDate:
                  obj.billDate !== null ? new Date(obj?.billDate) : null,
              }));
              setFormData(initialFormDataArray);
              setUpdatedData(initialFormDataArray);
              let reduxobj = {
                data: initialFormDataArray,
              };
              dispatch(hoteldata(reduxobj));
            } else {
              setRequest(true);
              Modal.info({
                content: (
                  <span style={{ fontWeight: "600" }}>
                    Hotel details can not be edited as it was not requeted in
                    the initial request. Please make a new travel request or
                    Expense the hotel directly using Costen portal
                  </span>
                ),
                centered: true,
              });
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
      ExpenseCancelRequest(body).then((res) => {
        if (res.responseCode === 200) {
          message.success("Canceled the Request Successfully");
          navigate("/dashboard-expense")
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
      setFormData([{ ...initialFormData, id: 0 }]);
      setUpdatedData([{ ...initialFormData, id: 0 }]);
      let body = {
        requestId: requestid,
        requestType: "hotel",
      };
      expenseClear(body).then((res)=>{
        if (res.responseCode === 200) {
          setRequest(true)
              dispatch(hoteldata({}));
              triggerParentEffect(body);
              message.success("Data Cleared Successfully");
            } else {
              message.error(res.responseMessage);
            }
      })
      // clearRequest(body).then((res) => {
      //   if (res.responseCode === 200) {
      //     dispatch(hoteldata({}));
      //     // triggerParentEffect(body);
      //     message.success("Data Cleared Successfully");
      //   } else {
      //     message.error(res.responseMessage);
      //   }
      // });
    } else {
      message.error("Please Save Travel Header");
    }
  };
  const onFileChangeMulti = (index, field, e) => {
    const selectedFile = e.target.files[0];

    const ocrform = new FormData();

    ocrform.append("file", selectedFile);
    // if (
    //   formData[index]["billAmount"] !== "" &&
    //   formData[index]["billDate"] !== null &&
    //   formData[index]["billNumber"] !== "" &&
    //   formData[index]["establishmentName"] !== ""
    // ) {
    //   console.log(
    //     formData[index]["billAmount"],
    //     formData[index]["billDate"],
    //     formData[index]["billNumber"],
    //     formData[index]["establishmentName"]
    //   );
    // } else {
      setSpinner(true);
      ocr(ocrform)
        .then((res) => {
          if (res.responseCode === 200) {
            setSpinner(false);
            const newFormData = [...formData];
            newFormData[index]["billAmount"] = res.fileData.billAmount;
            newFormData[index]["billDate"] =
              res.fileData.billDate !== null
                ? new Date(res.fileData?.billDate)
                : null;
            newFormData[index]["billNumber"] = res.fileData.billNumber !==null?res.fileData.billNumber:"";
            newFormData[index]["establishmentName"] =
              res.fileData.establishmentName;
              newFormData[index]["finalAmount"] =
              newFormData[index].billAmount * newFormData[index].exchangeRate;
            setFormData(newFormData);

            const newUpdatedData = [...updatedData];
            newUpdatedData[index]["billAmount"] = res.fileData.billAmount;
            newUpdatedData[index]["billDate"] =
              res.fileData.billDate !== null
                ? new Date(res.fileData?.billDate)
                : null;
            newUpdatedData[index]["billNumber"] = res.fileData.billNumber !==null?res.fileData.billNumber:"";
            newUpdatedData[index]["establishmentName"] =
              res.fileData.establishmentName;
              newUpdatedData[index]["finalAmount"] =
              newUpdatedData[index].billAmount * newUpdatedData[index].exchangeRate;
            setUpdatedData(newUpdatedData);
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

    const newFormData = [...formData];
    newFormData[index][field] = selectedFile;
    newFormData[index]["billFile"] = "";
    newFormData[index]["billFileOriginal"] = "";

    setFormData(newFormData);

    const newUpdatedData = [...updatedData];
    newUpdatedData[index][field] = selectedFile;
    newUpdatedData[index]["billFile"] = "";
    newUpdatedData[index]["billFileOriginal"] = "";
    setUpdatedData(newUpdatedData);
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();

      if (allowedFormats.includes(fileType)) {
        formData["file"] = selectedFile;
        setModalFile(selectedFile);
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
  // const onChange = (value) => {
  //   const newFormData = [...formData];
  //   newFormData[index][field] = date;
  //   setFormData(newFormData);

  //   const newUpdatedData = [...updatedData];
  //   newUpdatedData[index][field] = date;
  //   setUpdatedData(newUpdatedData);
  //   console.log(`selected ${value}`);
  // };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const filterOption = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  const handleDownloadClick = (backendLink) => {
    window.open(backendLink, "_blank");
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
      {!request ? (
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
              <Spin spinning={spinner} tip="Fetching Data ..." size="large">
                <div style={{ marginTop: "1rem" }}>
                  <div className="scroll-container-pull">
                    {formData.map((form, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.2rem",
                            marginRight: "0.4rem",
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
                            // minDate={new Date()}
                            placeholderText="Select Check In Date"
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
                          <label style={{ fontWeight: "600" }}>
                            Check-out Date:
                          </label>
                          <DatePicker
                            selected={form.checkOut}
                            onChange={(date) =>
                              handleDateChange(index, "checkOut", date)
                            }
                            minDate={form.checkIn || new Date()}
                            maxDate={
                              form.checkIn
                                ? new Date(
                                    form.checkIn.getTime() +
                                      4 * 7 * 24 * 60 * 60 * 1000
                                  )
                                : null
                            }
                            placeholderText="Select Check Out Date"
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
                          <label style={{ fontWeight: "600" }}>
                            Estimate Cost:
                          </label>
                          <input
                            disabled
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
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.2rem",
                            marginRight: "0.4rem",
                          }}
                        >
                          <label style={{ fontWeight: "600" }}>
                            City Name:
                          </label>
                          <input
                            disabled
                            className="inputclass"
                            type="text"
                            value={form.cityName}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "cityName",
                                e.target.value
                              )
                            }
                            placeholder="Enter City Name"
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
                          <label style={{ fontWeight: "600" }}>
                            Establishment Name
                          </label>
                          <input
                            className="inputclass"
                            name="establishmentName"
                            type="text"
                            // required
                            value={form.establishmentName}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "establishmentName",
                                e.target.value
                              )
                            }
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
                            selected={form.billDate}
                            onChange={(date) =>
                              handleDateChange(index, "billDate", date)
                            }
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
                          <label style={{ fontWeight: "600" }}>
                            Bill Currency
                          </label>
                          <Select
                            value={form.billCurrency}
                            listItemHeight={10}
                            listHeight={200}
                            showSearch
                            onChange={(value) =>
                              handleInputChange(index, "billCurrency", value)
                            }
                            onSearch={onSearch}
                            filterOption={filterOption}
                            // onChange={(e) => onChange(e)}
                            // style={{ width: "13vw" }}
                            placeholder="Select Bill Currency"
                            // dropdownStyle={{ maxHeight: 200 }}
                            style={{ width: 200 }}
                            virtual={true}
                            // dropdownStyle={{ maxHeight: 200,overflowY:'auto' }}
                            // className="custom-scrollbar" // Apply a custom class
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
                          <label style={{ fontWeight: "600" }}>
                            Bill Amount
                          </label>
                          <input
                            className="inputclass"
                            name="billAmount"
                            type="number"
                            value={form.billAmount}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "billAmount",
                                e.target.value
                              )
                            }
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
                          <label style={{ fontWeight: "600" }}>
                            Bill Number
                          </label>
                          <input
                            className="inputclass"
                            name="billNumber"
                            type="text"
                            value={form.billNumber}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "billNumber",
                                e.target.value
                              )
                            }
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
                          <label style={{ fontWeight: "600" }}>
                            Requested Currency
                          </label>
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
                          <label style={{ fontWeight: "600" }}>
                            Exchange Rate
                          </label>
                          <input
                            // disabled={disabledExchange}
                            className="inputclass"
                            name="exchangeRate"
                            type="text"
                            value={form.exchangeRate}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "exchangeRate",
                                e.target.value
                              )
                            }
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
                          <label style={{ fontWeight: "600" }}>
                            Final Amount
                          </label>
                          <input
                            className="inputclass"
                            name="finalAmount"
                            type="text"
                            value={form.finalAmount}
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
                          <label style={{ fontWeight: "600" }}>
                            Expense Type
                          </label>
                          <Select
                            value={!form.expenseType ? "" : form.expenseType}
                            onChange={(e) => {
                              handleInputChange(index, "expenseType", e);
                            }}
                            style={{ width: "20vw" }}
                            placeholder="Select Expense Type"
                          >
                            <Select.Option key="cash" value="cash">
                              Cash
                            </Select.Option>
                            <Select.Option
                              key="cooperateCard"
                              value="cooperateCard"
                            >
                              Cooperate Card
                            </Select.Option>
                            <Select.Option
                              key="personalExpense"
                              value="personalExpense"
                            >
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
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
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
                                onChange={(e) => {
                                  onFileChangeMulti(index, "file", e);
                                }}
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

                            {/* { && ( */}
                            {/* {form.file && (
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
                        )} */}
                            {form.file ? (
                              <div
                                onClick={() => {
                                  setModalFile(form.file);
                                  setModalFileType(
                                    form?.file?.name
                                      .split(".")
                                      .pop()
                                      .toLowerCase()
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
                                <FileTextOutlined
                                  style={{ fontSize: "15px" }}
                                />
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
                                <FileTextOutlined
                                  style={{ fontSize: "15px" }}
                                />
                                <span> {form.billFileOriginal}</span>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",

                            // gap: "0.2rem",
                            marginLeft: "1.5rem",
                          }}
                        >
                          <CloseCircleOutlined
                            style={{
                              color: "red",
                              fontSize: "1.5rem",
                              marginTop: "1.5rem",
                            }}
                            onClick={() => handleRemoveForm(index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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
                            boxShadow:
                              "0px 2px 6px 0px rgba(151, 172, 198, 0.25)",
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
              </Spin>
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
              onClick={()=>{setOpenSave(true)}}
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
      ) : (
        <></>
      )}

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
      <Modal
        open={openSave}
        title="Please Validate Data Before Saving"
        onCancel={() => setOpenSave(false)}
        footer={[
          <Button key="submit" type="primary" onClick={handleSave}>
            Save
          </Button>,
          <Button onClick={() => setOpenSave(false)}>Cancel</Button>,
        ]}
      ></Modal>
    </div>
  );
}

export default PullHotel;
