import { Button, Modal, Select, Spin, message } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../datepicker.css";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { flight } from "../../../redux/actions";
import { useNavigate } from "react-router-dom";
import {
  CloseCircleOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./form.css";
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
  ocr,
} from "../../../services/ApiService";
const initialFormData = {
  departureDate: null,
  estimateCost: "",
  from: "",
  to: "",
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

function PullFlight({ TripType, triggerParentEffect }) {
  const filteredDataformData = new FormData();
  const [disabledExchange, setDisabledExchange] = useState(false);

  const [open, setOpen] = useState(false);
  const [openpreview, setOpenpreview] = useState(false);
  const [onewayform, setOnewayform] = useState({
    departureDateoneway: null,
    estimateCostoneway: "",
    fromoneway: "",
    tooneway: "",
    billCurrencyoneway: "",
    billAmountoneway: "",
    billDateoneway: null,
    billNumberoneway: "",
    establishmentNameoneway: "",
    file: "",
    exchangeRateoneway: "",
    finalAmountoneway: "",
    billFileoneway: "",
    billFileOriginaloneway: "",
    expenseTypeoneway: "",
  });
  const [roundformData, setRoundFormData] = useState({
    departureDateroundway0: null,
    estimateCostroundway0: "",
    fromroundway0: "",
    toroundway0: "",
    billCurrencyroundway0: "",
    billAmountroundway0: "",
    billDateroundway0: null,
    billNumberroundway0: "",
    establishmentNameroundway0: "",
    fileroundway0: "",
    exchangeRateroundway0: "",
    finalAmountroundway0: "",
    billFileroundway0: "",
    billFileOriginalroundway0: "",
    departureDateroundway1: null,
    estimateCostroundway1: "",
    fromroundway1: "",
    toroundway1: "",
    billCurrencyroundway1: "",
    billAmountroundway1: "",
    billDateroundway1: null,
    billNumberroundway1: "",
    establishmentNameroundway1: "",
    fileroundway1: "",
    exchangeRateroundway1: "",
    finalAmountroundway1: "",
    billFileroundway1: "",
    billFileOriginalroundway1: "",
    expenseTyperoundway0: "",
    expenseTyperoundway1: "",
  });
  const userType = sessionStorage.getItem("userType");
  const navigate = useNavigate();
  const flightData = useSelector((state) => state.flight);
  const triptype = TripType;
  const dispatch = useDispatch();
  const requestid = useSelector((state) => state.requestedid);
  const [departuredateoneway, setDepartureDateONeWay] = useState(null);
  const [billdateoneway, setBillDateONeWay] = useState(null);

  const [departuredateroundway, setDepartureDateroundway] = useState(null);
  const [departuredateroundway1, setDepartureDateroundway1] = useState(null);
  const [billdateroundway, setBillDateroundway] = useState(null);
  const [billdateroundway1, setBillDateroundway1] = useState(null);
  const [formData, setFormData] = useState([{ ...initialFormData, id: 0 }]);
  const [spinner, setSpinner] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [updatedData, setUpdatedData] = useState([
    { ...initialFormData, id: 0 },
  ]);
  const idCounter = useRef(1);
  const [currencyListData, setCurrencyListData] = useState();
  const [disabledExchangeOneway, setDisabledExchangeOneway] = useState(false);
  const [disabledExchangeRoundway0, setDisabledExchangeRoundway0] =
    useState(false);
  const [disabledExchangeRoundway1, setDisabledExchangeRoundway1] =
    useState(false);

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
          newFormData[index]["billNumber"] = res.fileData.billNumber;
          newFormData[index]["establishmentName"] =
            res.fileData.establishmentName;

          setFormData(newFormData);

          const newUpdatedData = [...updatedData];
          newUpdatedData[index]["billAmount"] = res.fileData.billAmount;
          newUpdatedData[index]["billDate"] =
            res.fileData.billDate !== null
              ? new Date(res.fileData?.billDate)
              : null;
          newUpdatedData[index]["billNumber"] = res.fileData.billNumber;
          newUpdatedData[index]["establishmentName"] =
            res.fileData.establishmentName;
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
  const handleBillCurrencyRoundway0 = (value) => {
    setRoundFormData({ ...roundformData, ["billCurrencyroundway0"]: value });

    if (value === "Other") {
      setDisabledExchangeRoundway0(false);
    } else {
      setDisabledExchangeRoundway0(true);
      exchangeRate(value, sessionStorage.getItem("currency")).then((res) => {
        if (res.responseCode === 200) {
          // roundformData['exchangeRateroundway0']=res.exchangeRate
          setRoundFormData({
            ...roundformData,
            ["exchangeRateroundway0"]: res.exchangeRate,
            ["billCurrencyroundway0"]: value,
          });
        } else {
          message.error(res.responseMessage);
        }
      });
    }
  };
  const handleBillCurrencyRoundway1 = (value) => {
    setRoundFormData({ ...roundformData, ["billCurrencyroundway1"]: value });

    if (value === "Other") {
      setDisabledExchangeRoundway1(false);
    } else {
      setDisabledExchangeRoundway1(true);
      exchangeRate(value, sessionStorage.getItem("currency")).then((res) => {
        if (res.responseCode === 200) {
          // roundformData['exchangeRateroundway0']=res.exchangeRate
          setRoundFormData({
            ...roundformData,
            ["exchangeRateroundway1"]: res.exchangeRate,
            ["billCurrencyroundway1"]: value,
          });
        } else {
          message.error(res.responseMessage);
        }
      });
    }
  };

  const handleBillCurrencyOneWay = (value) => {
    setOnewayform({ ...onewayform, ["billCurrencyoneway"]: value });

    if (value === "Other") {
      setDisabledExchangeOneway(false);
    } else {
      setDisabledExchangeOneway(true);
      exchangeRate(value, sessionStorage.getItem("currency")).then((res) => {
        if (res.responseCode === 200) {
          setOnewayform({
            ...onewayform,
            ["exchangeRateoneway"]: res.exchangeRate,
            ["billCurrencyoneway"]: value,
          });
        } else {
          message.error(res.responseMessage);
        }
      });
    }
  };
  const handleSave = () => {
    setOpenSave(false);
    let updatedArray;
    if (triptype === "multiCity") {
      const formattedData = updatedData.map((data) => ({
        ...data,
        departureDate: formatDate(data.departureDate),
        billDate: formatDate(data.billDate),

        estimateCost: parseInt(data.estimateCost, 10),
        // billAmount: parseInt(data.billAmount, 10),
      }));

      updatedArray = formattedData.map(({ id, ...rest }) => rest);
    } else if (triptype === "oneway") {
      const modifiedObject = {};
      const array = [];
      onewayform["departureDateoneway"] = formatDate(departuredateoneway);
      onewayform["billDateoneway"] = formatDate(billdateoneway);
      // onewayform["estimateCostoneway"] = 0; //only for testing

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
      roundformData["billDateroundway0"] = formatDate(billdateroundway);
      roundformData["billDateroundway1"] = formatDate(billdateroundway1);
      roundformData["fileroundway0"] = fileround0;
      roundformData["fileroundway1"] = fileround1;
      // roundformData["estimateCostroundway0"]=0;//for testing
      // roundformData["estimateCostroundway1"]=0 // for testing
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
    const filteredData = updatedArray?.filter((obj) =>
      Object.values(obj).some(
        (value) => value !== null && value !== "" && !isNaN(value)
      )
    );
    if (filteredData.length > 0) {
      filteredData?.forEach((obj) => {
        obj.estimateCost = parseInt(obj.estimateCost, 10);
      });

      filteredData.map((obj) => {
        // Copy non-empty values to the new object
        for (const key in obj) {
          if (obj["billFile"] === "" || obj["billFileOriginal"] === "") {
            delete obj["billFile"];
            delete obj["billFileOriginal"];
          } else if (obj["file"] === "") {
            delete obj["file"];
          }
        }
      });
      filteredData.map((obj) => {
        for (let key in obj) {
          if (typeof obj[key] === "number" && isNaN(obj[key])) {
            obj[key] = 0;
          }
        }
        return obj;
      });
      const formDatatry = new FormData();
      filteredData.forEach((obj, index) => {
        Object.entries(obj).forEach(([key, value]) => {
          formDatatry.append(`objects[${index}][${key}]`, value);
        });
      });
      formDatatry.append("tripWay", triptype);
      formDatatry.append("requestId", requestid);
      formDatatry.append("employeeId", sessionStorage.getItem("employeeId"));
      formDatatry.append("count", filteredData.length);

      expensetransport(formDatatry, "flight").then((res) => {
        if (res.responseCode === 200) {
          message.success("Flight Date Save Successfully");
          triggerParentEffect(formDatatry);
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
          let getflightData = res.data?.filter(
            (item) => item.transportType === "flight"
          );
          if (getflightData.length > 0) {
            if (Object.keys(getflightData[0])?.length > 0) {
              if (getflightData[0].trips.length > 0) {
                if (getflightData[0]?.tripType === "multiCity") {
                  if (getflightData[0].trips.length > 0) {
                    const initialFormDataArray = getflightData[0].trips.map(
                      (obj) => ({
                        departureDate: new Date(obj.departureDate) || null,
                        estimateCost: obj.estimateCost || "",
                        from: obj.from || "",
                        to: obj.to || "",
                        billCurrency: obj.billCurrency || "",
                        billAmount: obj.billAmount || "",
                        billDate:  obj.billDate !== null
                        ? new Date(obj?.billDate)
                        : null,
                        billNumber: obj.billNumber || "",
                        establishmentName: obj.establishmentName || "",
                        exchangeRate: obj.exchangeRate || "",
                        finalAmount: obj.finalAmount || "",
                        expenseType: obj.expenseType || "",
                        billFile: obj.billFile || "",
                        billFileOriginal: obj.billFileOriginalName || "",
                      })
                    );

                    setFormData(initialFormDataArray);
                    setUpdatedData(initialFormDataArray);
                  }
                  setRoundFormData({
                    departureDateroundway0: null,
                    estimateCostroundway0: "",
                    fromroundway0: "",
                    toroundway0: "",
                    billCurrencyroundway0: "",
                    billAmountroundway0: "",
                    billDateroundway0: null,
                    billNumberroundway0: "",
                    establishmentNameroundway0: "",
                    fileroundway0: "",
                    exchangeRateroundway0: "",
                    finalAmountroundway0: "",
                    billFileroundway0: "",
                    billFileOriginalroundway0: "",
                    departureDateroundway1: null,
                    estimateCostroundway1: "",
                    fromroundway1: "",
                    toroundway1: "",
                    billCurrencyroundway1: "",
                    billAmountroundway1: "",
                    billDateroundway1: null,
                    billNumberroundway1: "",
                    establishmentNameroundway1: "",
                    fileroundway1: "",
                    exchangeRateroundway1: "",
                    finalAmountroundway1: "",
                    billFileroundway1: "",
                    billFileOriginalroundway1: "",
                    expenseTyperoundway0: "",
                    expenseTyperoundway1: "",
                  });
                  setDepartureDateroundway(null);
                  setDepartureDateroundway1(null);
                  setOnewayform({
                    departureDateoneway: null,
                    estimateCostoneway: "",
                    fromoneway: "",
                    tooneway: "",
                    billCurrencyoneway: "",
                    billAmountoneway: "",
                    billDateoneway: null,
                    billNumberoneway: "",
                    establishmentNameoneway: "",
                    file: "",
                    exchangeRateoneway: "",
                    finalAmountoneway: "",
                    billFileoneway: "",
                    billFileOriginaloneway: "",
                    expenseTypeoneway: "",
                  });
                  setDepartureDateONeWay(null);
                }
                if (getflightData[0]?.tripType === "oneway") {
                  setDepartureDateONeWay(
                    getflightData[0].trips[0].departureDate !== null
                      ? new Date(getflightData[0].trips[0].departureDate)
                      : null
                  );
                  setBillDateONeWay(
                    getflightData[0].trips[0].billDate !== null
                      ? new Date(getflightData[0].trips[0].billDate)
                      : null
                  );
                  if (getflightData[0].trips[0]) {
                    const initialFormDataArray = {
                      departureDateoneway:
                        getflightData[0].trips[0].departureDate !== null
                          ? new Date(getflightData[0].trips[0].departureDate)
                          : null || null,
                      estimateCostoneway:
                        getflightData[0].trips[0].estimateCost || "",
                      fromoneway: getflightData[0].trips[0].from || "",
                      tooneway: getflightData[0].trips[0].to || "",
                      billDateoneway:
                      getflightData[0].trips[0].billDate !== null
                      ? new Date(getflightData[0].trips[0]?.billDate)
                      : null,
                      establishmentNameoneway:
                        getflightData[0].trips[0].establishmentName || "",
                      billCurrencyoneway:
                        getflightData[0].trips[0].billCurrency || "",
                      billAmountoneway:
                        getflightData[0].trips[0].billAmount || "",
                      billNumberoneway:
                        getflightData[0].trips[0].billNumber || "",
                      exchangeRateoneway:
                        getflightData[0].trips[0].exchangeRate || "",
                      finalAmountoneway:
                        getflightData[0].trips[0].finalAmount || "",
                      expenseTypeoneway:
                        getflightData[0].trips[0].expenseType || "",
                      billFileOriginaloneway:
                        getflightData[0].trips[0].billFileOriginalName || "",
                      billFileoneway: getflightData[0].trips[0].billFile || "",
                    };
                    setOnewayform(initialFormDataArray);
                  }
                  setRoundFormData({
                    departureDateroundway0: null,
                    estimateCostroundway0: "",
                    fromroundway0: "",
                    toroundway0: "",
                    billCurrencyroundway0: "",
                    billAmountroundway0: "",
                    billDateroundway0: null,
                    billNumberroundway0: "",
                    establishmentNameroundway0: "",
                    fileroundway0: "",
                    exchangeRateroundway0: "",
                    finalAmountroundway0: "",
                    billFileroundway0: "",
                    billFileOriginalroundway0: "",
                    departureDateroundway1: null,
                    estimateCostroundway1: "",
                    fromroundway1: "",
                    toroundway1: "",
                    billCurrencyroundway1: "",
                    billAmountroundway1: "",
                    billDateroundway1: null,
                    billNumberroundway1: "",
                    establishmentNameroundway1: "",
                    fileroundway1: "",
                    exchangeRateroundway1: "",
                    finalAmountroundway1: "",
                    billFileroundway1: "",
                    billFileOriginalroundway1: "",
                    expenseTyperoundway0: "",
                    expenseTyperoundway1: "",
                  });
                  setDepartureDateroundway(null);
                  setDepartureDateroundway1(null);
                  setFormData([{ ...initialFormData, id: 0 }]);
                  setUpdatedData([{ ...initialFormData, id: 0 }]);
                }
                if (getflightData[0]?.tripType === "round") {
                  setDepartureDateroundway(
                    getflightData[0]?.trips[0]?.departureDate !== null
                      ? new Date(getflightData[0]?.trips[0]?.departureDate)
                      : null
                  );
                  setDepartureDateroundway1(
                    getflightData[0]?.trips[1]?.departureDate !== null
                      ? new Date(getflightData[0]?.trips[1]?.departureDate)
                      : null
                  );
                  setBillDateroundway(
                    getflightData[0]?.trips[0]?.billDate !== null
                      ? new Date(getflightData[0]?.trips[0]?.billDate)
                      : null
                  );
                  setBillDateroundway1(
                    getflightData[0]?.trips[1]?.billDate !== null
                      ? new Date(getflightData[0]?.trips[1]?.billDate)
                      : null
                  );
                  if (getflightData[0]?.trips[0]) {
                    const initialFormDataArray = {
                      departureDateroundway0:
                        getflightData[0]?.trips[0]?.departureDate !== null
                          ? new Date(getflightData[0]?.trips[0]?.departureDate)
                          : null || null,
                      estimateCostroundway0:
                        getflightData[0]?.trips[0]?.estimateCost || "",
                      fromroundway0: getflightData[0]?.trips[0]?.from || "",
                      toroundway0: getflightData[0].trips[0].to || "",
                      establishmentNameroundway0:
                        getflightData[0].trips[0].establishmentName || "",
                      billCurrencyroundway0:
                        getflightData[0].trips[0].billCurrency || "",
                      billAmountroundway0:
                        getflightData[0].trips[0].billAmount || "",
                      billNumberroundway0:
                        getflightData[0].trips[0].billNumber || "",
                      exchangeRateroundway0:
                        getflightData[0].trips[0].exchangeRate || "",
                      finalAmountroundway0:
                        getflightData[0].trips[0].finalAmount || "",
                      expenseTyperoundway0:
                        getflightData[0].trips[0].expenseType || "",
                      billFileOriginalroundway0:
                        getflightData[0].trips[0].billFileOriginalName || "",
                      billFileroundway0:
                        getflightData[0].trips[0].billFile || "",
                      departureDateroundway1:
                        getflightData[0]?.trips[1]?.departureDate !== null
                          ? new Date(getflightData[0]?.trips[1]?.departureDate)
                          : null || null,
                      estimateCostroundway1:
                        getflightData[0].trips[1]?.estimateCost || "",
                      fromroundway1: getflightData[0].trips[1]?.from || "",
                      toroundway1: getflightData[0].trips[1]?.to || "",
                      establishmentNameroundway1:
                        getflightData[0].trips[1]?.establishmentName || "",
                      billCurrencyroundway1:
                        getflightData[0].trips[1]?.billCurrency || "",
                      billAmountroundway1:
                        getflightData[0].trips[1]?.billAmount || "",
                      billNumberroundway1:
                        getflightData[0].trips[1]?.billNumber || "",
                      exchangeRateroundway1:
                        getflightData[0].trips[1]?.exchangeRate || "",
                      expenseTyperoundway1:
                        getflightData[0].trips[1]?.expenseType || "",
                      billFileOriginalroundway1:
                        getflightData[0].trips[1]?.billFileOriginalName || "",
                      billFileroundway1:
                        getflightData[0].trips[1]?.billFile || "",
                    };
                    setRoundFormData(initialFormDataArray);
                  }
                  setOnewayform({
                    departureDateoneway: null,
                    estimateCostoneway: "",
                    fromoneway: "",
                    tooneway: "",
                    billCurrencyoneway: "",
                    billAmountoneway: "",
                    billDateoneway: null,
                    billNumberoneway: "",
                    establishmentNameoneway: "",
                    file: "",
                    exchangeRateoneway: "",
                    finalAmountoneway: "",
                    billFileoneway: "",
                    billFileOriginaloneway: "",
                    expenseTypeoneway: "",
                  });
                  setDepartureDateONeWay(null);
                  setFormData([{ ...initialFormData, id: 0 }]);
                  setUpdatedData([{ ...initialFormData, id: 0 }]);
                }
              }
            }
          }
        }
      }
    });
  }, [triptype]);
  useEffect(() => {
    setFile(null);
    setFileround0(null);
    setFileround1(null);
    setFileType("");
    setOnewayform({
      departureDateoneway: null,
      estimateCostoneway: "",
      fromoneway: "",
      tooneway: "",
      billCurrencyoneway: "",
      billAmountoneway: "",
      billDateoneway: null,
      billNumberoneway: "",
      establishmentName: "",
      file: "",
      exchangeRateoneway: "",
      finalAmountoneway: "",
    });
    setRoundFormData({
      departureDateroundway0: null,
      estimateCostroundway0: "",
      fromroundway0: "",
      toroundway0: "",
      billCurrencyroundway0: "",
      billAmountroundway0: "",
      billDateroundway0: null,
      billNumberroundway0: "",
      establishmentNameroundway0: "",
      fileroundway0: "",
      exchangeRateroundway0: "",
      finalAmountroundway0: "",
      departureDateroundway1: null,
      estimateCostroundway1: "",
      fromroundway1: "",
      toroundway1: "",
      billCurrencyroundway1: "",
      billAmountroundway1: "",
      billDateroundway1: null,
      billNumberroundway1: "",
      establishmentNameroundway1: "",
      fileroundway1: "",
      exchangeRateroundway1: "",
      finalAmountroundway1: "",
      expenseTyperoundway0: "",
      expenseTyperoundway1: "",
    });
    setFormData([{ ...initialFormData, id: 0 }]);

    setDepartureDateONeWay(null);
    setBillDateONeWay(null);

    setDepartureDateroundway(null);
    setDepartureDateroundway1(null);
    setBillDateroundway(null);
    setBillDateroundway1(null);
  }, [triptype]);
  const today = new Date();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOnewayform({ ...onewayform, [name]: value });
  };
  const handleBillDateChange = (date) => {
    setBillDateONeWay(date);
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
  const handleBillDateChangeRound = (date) => {
    setBillDateroundway(date);
  };
  const handleBillDateChangeRound1 = (date) => {
    setBillDateroundway1(date);
  };
  const handleStartDateChange = (date) => {
    setDepartureDateONeWay(date);
  };
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
      setDepartureDateONeWay(null);
      setDepartureDateroundway(null);
      setDepartureDateroundway1(null);
      setBillDateONeWay(null);
      setBillDateroundway(null);
      setBillDateroundway1(null);
      setFormData([{ ...initialFormData, id: 0 }]);
      setUpdatedData([{ ...initialFormData, id: 0 }]);
      setOnewayform({
        departureDateoneway: null,
        estimateCostoneway: "",
        fromoneway: "",
        tooneway: "",
        billCurrencyoneway: "",
        billAmountoneway: "",
        billDateoneway: null,
        billNumberoneway: "",
        establishmentNameoneway: "",
        file: "",
        exchangeRateoneway: "",
        finalAmountoneway: "",
        billFileoneway: "",
        billFileOriginaloneway: "",
        expenseTypeoneway: "",
      });
      setRoundFormData({
        departureDateroundway0: null,
        estimateCostroundway0: "",
        fromroundway0: "",
        toroundway0: "",
        billCurrencyroundway0: "",
        billAmountroundway0: "",
        billDateroundway0: null,
        billNumberroundway0: "",
        establishmentNameroundway0: "",
        fileroundway0: "",
        exchangeRateroundway0: "",
        finalAmountroundway0: "",
        billFileroundway0: "",
        billFileOriginalroundway0: "",
        departureDateroundway1: null,
        estimateCostroundway1: "",
        fromroundway1: "",
        toroundway1: "",
        billCurrencyroundway1: "",
        billAmountroundway1: "",
        billDateroundway1: null,
        billNumberroundway1: "",
        establishmentNameroundway1: "",
        fileroundway1: "",
        exchangeRateroundway1: "",
        finalAmountroundway1: "",
        billFileroundway1: "",
        billFileOriginalroundway1: "",
        expenseTyperoundway0: "",
        expenseTyperoundway1: "",
      });
      let body = {
        requestId: requestid,
        requestType: "transport",
        transportType: "flight",
      };
      expenseClear(body).then((res) => {
        if (res.responseCode === 200) {
          dispatch(flight({}));
          triggerParentEffect(body);
          message.success("Flight Data Cleared Successfully");
        } else {
          message.error(res.responseMessage);
        }
      });
    } else {
      message.error("Please Save Travel Header Data");
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Add your form submission logic here using formData
  // };

  // const isAllowedFileType = (file) => {
  //   const allowedTypes = [
  //     "image/jpeg",
  //     "image/png",
  //     "image/jpg",
  //     "image/heic",
  //     "application/pdf",
  //   ];
  //   return allowedTypes.includes(file.type);
  // };

  // const onChange = (info) => {
  //   let filteredFileList = info.fileList.filter((file) =>
  //     isAllowedFileType(file)
  //   );
  //   setFileList(filteredFileList);
  // };

  const [file, setFile] = useState(null);
  const [fileround0, setFileround0] = useState(null);
  const [fileround1, setFileround1] = useState(null);
  const [fileType, setFileType] = useState("");
  const [modalFile, setModalFile] = useState(null);
  const [modalFileType, setModalFileType] = useState("");

  const allowedFormats = ["pdf", "jpeg", "jpg", "heic", "png"];

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();

      if (allowedFormats.includes(fileType)) {
        const ocrform = new FormData();

        ocrform.append("file", selectedFile);
        // if (
        //   onewayform["billAmountoneway"] !== "" &&
        //   onewayform["billDateoneway"] !== null &&
        //   onewayform["billNumberoneway"] !== "" &&
        //   onewayform["establishmentNameoneway"] !== ""
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
                onewayform["billAmountoneway"] = res.fileData.billAmount;
                onewayform["billDateoneway"] =
                  res.fileData.billDate !== null
                    ? new Date(res.fileData?.billDate)
                    : null;
                onewayform["billNumberoneway"] = res.fileData.billNumber;
                onewayform["establishmentNameoneway"] =
                  res.fileData.establishmentName;
                setBillDateONeWay(
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

        onewayform["billFileoneway"] = "";
        onewayform["billFileOriginaloneway"] = "";

        onewayform["file"] = selectedFile;
        setFile(selectedFile);
        setModalFile(selectedFile);
        setModalFileType(fileType);
        setFileType(fileType);
      } else {
        alert(
          "Invalid file format. Please upload a PDF, JPEG, JPG, or HEIC file."
        );
      }
    }
  };
  const onFileChangeRound0 = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();

      if (allowedFormats.includes(fileType)) {
        const ocrform = new FormData();

        ocrform.append("file", selectedFile);
        // if (
        //   roundformData["billAmountroundway0"] !== undefined &&
        //   roundformData["billDateroundway0"] !== undefined  &&
        //   roundformData["billNumberroundway0"]  !== undefined&&
        //   roundformData["establishmentNameroundway0"] !== undefined
        // ) {
        //   console.log(
        //     roundformData["billAmountroundway0"],
        //   roundformData["billDateroundway0"],
        //   roundformData["billNumberroundway0"],
        //   roundformData["establishmentNameroundway0"]
        //   );
        // }
        // else {
        setSpinner(true);
        ocr(ocrform)
          .then((res) => {
            if (res.responseCode === 200) {
              setSpinner(false);
              roundformData["billAmountroundway0"] = res?.fileData?.billAmount;
              roundformData["billDateroundway0"] =
                res?.fileData?.billDate !== null
                  ? new Date(res?.fileData?.billDate)
                  : null;
              roundformData["billNumberroundway0"] = res?.fileData?.billNumber;
              roundformData["establishmentNameroundway0"] =
                res?.fileData?.establishmentName;
              setBillDateroundway(
                res?.fileData?.billDate !== null
                  ? new Date(res?.fileData?.billDate)
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

        roundformData["billFileroundway0"] = "";
        roundformData["billFileOriginalroundway0"] = "";

        roundformData["fileroundway0"] = selectedFile;
        setFileround0(selectedFile);
        setModalFile(selectedFile);
        setModalFileType(fileType);
        setFileType(fileType);
      } else {
        alert(
          "Invalid file format. Please upload a PDF, JPEG, JPG, or HEIC file."
        );
      }
    }
  };
  const onFileChangeRound1 = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();

      if (allowedFormats.includes(fileType)) {
        const ocrform = new FormData();

        ocrform.append("file", selectedFile);
        // if (
        //   roundformData["billAmountroundway1"] !== undefined &&
        //   roundformData["billDateroundway1"] !== undefined  &&
        //   roundformData["billNumberroundway1"]  !== undefined&&
        //   roundformData["establishmentNameroundway1"] !== undefined
        // ) {
        //   console.log(
        //     roundformData["billAmountroundway1"],
        //   roundformData["billDateroundway1"],
        //   roundformData["billNumberroundway1"],
        //   roundformData["establishmentNameroundway1"]
        //   );
        // }
        // else {
        setSpinner(true);
        ocr(ocrform)
          .then((res) => {
            if (res.responseCode === 200) {
              setSpinner(false);
              roundformData["billAmountroundway1"] = res.fileData.billAmount;
              roundformData["billDateroundway1"] =
                res.fileData.billDate !== null
                  ? new Date(res.fileData?.billDate)
                  : null;
              roundformData["billNumberroundway1"] = res.fileData.billNumber;
              roundformData["establishmentNameroundway1"] =
                res.fileData.establishmentName;
              setBillDateroundway1(
                res.fileData.billDate !== null || ""
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

        roundformData["billFileroundway1"] = "";
        roundformData["billFileOriginalroundway1"] = "";

        roundformData["fileroundway1"] = selectedFile;
        setFileround1(selectedFile);
        setModalFile(selectedFile);
        setModalFileType(fileType);
        setFileType(fileType);
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

  const handleFinalAmountCalculation = () => {
    if (triptype === "oneway") {
      const exchangeRate = parseFloat(onewayform.exchangeRateoneway);
      const billAmount = parseFloat(onewayform.billAmountoneway);

      if (!isNaN(exchangeRate) && !isNaN(billAmount)) {
        const finalAmount = exchangeRate * billAmount;
        setOnewayform((prevForm) => ({
          ...prevForm,
          finalAmountoneway: finalAmount.toFixed(2), // Adjust the decimal places as needed
        }));
      }
    }
    if (triptype === "round") {
      const exchangeRate0 = parseFloat(roundformData.exchangeRateroundway0);
      const billAmount0 = parseFloat(roundformData.billAmountroundway0);
      const exchangeRate1 = parseFloat(roundformData.exchangeRateroundway1);
      const billAmount1 = parseFloat(roundformData.billAmountroundway1);
      if (!isNaN(exchangeRate0) && !isNaN(billAmount0)) {
        const finalAmount0 = exchangeRate0 * billAmount0;
        setRoundFormData((prevForm) => ({
          ...prevForm,
          finalAmountroundway0: finalAmount0.toFixed(2), // Adjust the decimal places as needed
        }));
      }
      if (!isNaN(exchangeRate1) && !isNaN(billAmount1)) {
        const finalAmount1 = exchangeRate1 * billAmount1;
        setRoundFormData((prevForm) => ({
          ...prevForm,
          finalAmountroundway1: finalAmount1.toFixed(2), // Adjust the decimal places as needed
        }));
      }
    }
  };

  useEffect(() => {
    handleFinalAmountCalculation();
  }, [
    onewayform.exchangeRateoneway,
    onewayform.billAmountoneway,
    roundformData.exchangeRateroundway0,
    roundformData.billAmountroundway0,
    roundformData.exchangeRateroundway1,
    roundformData.billAmountroundway1,
    formData,
  ]);
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
          {triptype === "multiCity" ? (
            <div style={{ marginTop: "1rem" }}>
              <div className="scroll-container-pull">
                {formData.map((form, index) => (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                        marginRight: "0.4rem",
                      }}
                    >
                      <label style={{ fontWeight: "600" }}>From</label>
                      <input
                        disabled
                        style={{ width: "7vw" }}
                        className="inputclass"
                        type="text"
                        name="from"
                        value={form.from}
                        onChange={(e) =>
                          handleInputChange(index, "from", e.target.value)
                        }
                        placeholder="Enter From"
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
                      <label style={{ fontWeight: "600" }}>To</label>
                      <input
                        disabled
                        style={{ width: "7vw" }}
                        className="inputclass"
                        type="text"
                        name="to"
                        value={form.to}
                        onChange={(e) =>
                          handleInputChange(index, "to", e.target.value)
                        }
                        placeholder="Enter To"
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
                        Departure Date
                      </label>
                      <DatePicker
                        selected={form.departureDate}
                        onChange={(date) =>
                          handleDateChange(index, "departureDate", date)
                        }
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
                      <label style={{ fontWeight: "600" }}>Estimate Cost</label>
                      <input
                        disabled
                        style={{ width: "9vw" }}
                        className="inputclass"
                        name="estimateCost"
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
                        Establishment Name
                      </label>
                      <input
                        className="inputclass"
                        name="establishmentName"
                        type="text"
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
                      <label style={{ fontWeight: "600" }}>Bill Amount</label>
                      <input
                        className="inputclass"
                        name="billAmount"
                        type="number"
                        value={form.billAmount}
                        onChange={(e) =>
                          handleInputChange(index, "billAmount", e.target.value)
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
                      <label style={{ fontWeight: "600" }}>Bill Number</label>
                      <input
                        className="inputclass"
                        name="billNumber"
                        type="text"
                        value={form.billNumber}
                        onChange={(e) =>
                          handleInputChange(index, "billNumber", e.target.value)
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
                      <label style={{ fontWeight: "600" }}>Exchange Rate</label>
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

                        {/* )} */}
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
                  <label style={{ fontWeight: "600" }}>From</label>
                  <input
                    disabled
                    style={{ width: "7vw" }}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                    marginRight: "0.4rem",
                  }}
                >
                  <label style={{ fontWeight: "600" }}>To</label>
                  <input
                    disabled
                    style={{ width: "7vw" }}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                    marginRight: "0.4rem",
                  }}
                >
                  <label style={{ fontWeight: "600" }}>Departure Date</label>
                  <DatePicker
                    selected={departuredateoneway}
                    onChange={handleStartDateChange}
                    // minDate={today} // Disable dates before today
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
                  <label style={{ fontWeight: "600" }}>Estimate Cost</label>
                  <input
                    disabled
                    style={{ width: "9vw" }}
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
                    name="establishmentNameoneway"
                    type="text"
                    value={onewayform.establishmentNameoneway}
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
                    selected={billdateoneway}
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
                    value={onewayform.billCurrencyoneway}
                    listItemHeight={10}
                    listHeight={200}
                    showSearch
                    onChange={(value) => handleBillCurrencyOneWay(value)}
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
                    name="billAmountoneway"
                    type="number"
                    value={onewayform.billAmountoneway}
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
                    name="billNumberoneway"
                    type="text"
                    value={onewayform.billNumberoneway}
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
                  <label style={{ fontWeight: "600" }}>Exchange Rate</label>
                  <input
                    // disabled={disabledExchangeOneway}
                    className="inputclass"
                    name="exchangeRateoneway"
                    type="text"
                    value={onewayform.exchangeRateoneway}
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
                    name="finalAmountoneway"
                    type="text"
                    value={onewayform.finalAmountoneway}
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
                    value={onewayform.expenseTypeoneway}
                    onChange={(e) => {
                      setOnewayform({
                        ...onewayform,
                        ["expenseTypeoneway"]: e,
                      });
                      // onewayform["expenseTypeoneway"] = e;
                    }}
                    style={{ width: "20vw" }}
                    placeholder="Select Expense Type"
                  >
                    <Select.Option key="cash" value="cash">
                      Cash
                    </Select.Option>
                    <Select.Option key="cooperateCard" value="cooperateCard">
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

                    {onewayform.file ? (
                      <div
                        onClick={() => {
                          setModalFile(onewayform.file);
                          setModalFileType(
                            onewayform?.file?.name
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
                        <FileTextOutlined style={{ fontSize: "15px" }} />
                        <span> {onewayform.file?.name}</span>
                      </div>
                    ) : onewayform.billFileoneway ? (
                      <div
                        onClick={() => {
                          PreviewFile(onewayform.billFileoneway).then((res) => {
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
                        <span> {onewayform.billFileOriginaloneway}</span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </form>
            </div>
          ) : triptype === "round" ? (
            <div className="scroll-container-pull">
              <form
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  padding: "20px",
                  width: "40vw",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                        marginRight: "0.4rem",
                      }}
                    >
                      <label style={{ fontWeight: "600" }}>From</label>
                      <input
                        disabled
                        style={{ width: "7vw" }}
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                        marginRight: "0.4rem",
                      }}
                    >
                      <label style={{ fontWeight: "600" }}>To</label>
                      <input
                        disabled
                        style={{ width: "7vw" }}
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                        marginRight: "0.4rem",
                      }}
                    >
                      <label style={{ fontWeight: "600" }}>
                        Departure Date
                      </label>
                      <DatePicker
                        name="departureDateroundway0"
                        selected={departuredateroundway}
                        onChange={handleStartDateChangeRound}
                        required
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
                      <label style={{ fontWeight: "600" }}>Estimate Cost</label>
                      <input
                        disabled
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
                        name="establishmentNameroundway0"
                        type="text"
                        value={roundformData.establishmentNameroundway0}
                        onChange={(e) => {
                          handleChangeRound(e);
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
                        selected={billdateroundway}
                        onChange={handleBillDateChangeRound}
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
                        value={roundformData.billCurrencyroundway0}
                        listItemHeight={10}
                        listHeight={200}
                        showSearch
                        onChange={(value) => handleBillCurrencyRoundway0(value)}
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
                        name="billAmountroundway0"
                        type="number"
                        value={roundformData.billAmountroundway0}
                        onChange={(e) => {
                          handleChangeRound(e);
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
                        name="billNumberroundway0"
                        type="text"
                        value={roundformData.billNumberroundway0}
                        onChange={(e) => {
                          handleChangeRound(e);
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
                      <label style={{ fontWeight: "600" }}>Exchange Rate</label>
                      <input
                        // disabled={disabledExchangeRoundway0}
                        className="inputclass"
                        name="exchangeRateroundway0"
                        type="text"
                        value={roundformData.exchangeRateroundway0}
                        onChange={(e) => {
                          handleChangeRound(e);
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
                        name="finalAmountroundway0"
                        type="text"
                        value={roundformData.finalAmountroundway0}
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
                        value={roundformData.expenseTyperoundway0}
                        onChange={(e) => {
                          setRoundFormData({
                            ...roundformData,
                            ["expenseTyperoundway0"]: e,
                          });
                          // roundformData["expenseTyperoundway0"] = e;
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
                            onChange={onFileChangeRound0}
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
                        {roundformData.fileroundway0 ? (
                          <div
                            onClick={() => {
                              setModalFile(roundformData.fileroundway0);
                              setModalFileType(
                                roundformData?.fileroundway0?.name
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
                            <FileTextOutlined style={{ fontSize: "15px" }} />
                            <span> {roundformData.fileroundway0?.name}</span>
                          </div>
                        ) : roundformData.billFileOriginalroundway0 ? (
                          <div
                            onClick={() => {
                              PreviewFile(roundformData.billFileroundway0).then(
                                (res) => {
                                  handleDownloadClick(res.fileUrl);
                                }
                              );
                            }}
                            style={{
                              marginTop: "1.2rem",
                              display: "flex",
                              flexDirection: "row",
                              cursor: "pointer",
                            }}
                          >
                            <FileTextOutlined style={{ fontSize: "15px" }} />
                            <span>
                              {" "}
                              {roundformData.billFileOriginalroundway0}
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                        marginRight: "0.4rem",
                      }}
                    >
                      <label style={{ fontWeight: "600" }}>From</label>
                      <input
                        disabled
                        style={{ width: "7vw" }}
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                        marginRight: "0.4rem",
                      }}
                    >
                      <label style={{ fontWeight: "600" }}>To</label>
                      <input
                        disabled
                        style={{ width: "7vw" }}
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                        marginRight: "0.4rem",
                      }}
                    >
                      <label style={{ fontWeight: "600" }}>
                        Departure Date
                      </label>
                      <DatePicker
                        name="departureDateroundway0"
                        selected={departuredateroundway1}
                        onChange={handleStartDateChangeRound1}
                        required
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
                      <label style={{ fontWeight: "600" }}>Estimate Cost</label>
                      <input
                        className="inputclass"
                        name="estimateCostroundway1"
                        type="number"
                        value={roundformData.estimateCostroundway1}
                        onChange={(e) => {
                          handleChangeRound(e);
                        }}
                        disabled
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
                        Establishment Name
                      </label>
                      <input
                        className="inputclass"
                        name="establishmentNameroundway1"
                        type="text"
                        value={roundformData.establishmentNameroundway1}
                        onChange={(e) => {
                          handleChangeRound(e);
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
                        selected={billdateroundway1}
                        onChange={handleBillDateChangeRound1}
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
                        value={roundformData.billCurrencyroundway1}
                        listItemHeight={10}
                        listHeight={200}
                        showSearch
                        onChange={(value) => handleBillCurrencyRoundway1(value)}
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
                        name="billAmountroundway1"
                        type="number"
                        value={roundformData.billAmountroundway1}
                        onChange={(e) => {
                          handleChangeRound(e);
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
                        name="billNumberroundway1"
                        type="text"
                        value={roundformData.billNumberroundway1}
                        onChange={(e) => {
                          handleChangeRound(e);
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
                      <label style={{ fontWeight: "600" }}>Exchange Rate</label>
                      <input
                        // disabled={disabledExchangeRoundway1}
                        className="inputclass"
                        name="exchangeRateroundway1"
                        type="text"
                        value={roundformData.exchangeRateroundway1}
                        onChange={(e) => {
                          handleChangeRound(e);
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
                        name="finalAmountroundway1"
                        type="text"
                        value={roundformData.finalAmountroundway1}
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
                        value={roundformData.expenseTyperoundway1}
                        onChange={(e) => {
                          setRoundFormData({
                            ...roundformData,
                            ["expenseTyperoundway1"]: e,
                          });
                          // roundformData["expenseTyperoundway1"] = e;
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
                            onChange={onFileChangeRound1}
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
                        {roundformData.fileroundway1 ? (
                          <div
                            onClick={() => {
                              setModalFile(roundformData.fileroundway1);
                              setModalFileType(
                                roundformData?.fileroundway1?.name
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
                            <FileTextOutlined style={{ fontSize: "15px" }} />
                            <span> {roundformData.fileroundway1?.name}</span>
                          </div>
                        ) : roundformData.billFileOriginalroundway1 ? (
                          <div
                            onClick={() => {
                              PreviewFile(roundformData.billFileroundway1).then(
                                (res) => {
                                  handleDownloadClick(res.fileUrl);
                                }
                              );
                            }}
                            style={{
                              marginTop: "1.2rem",
                              display: "flex",
                              flexDirection: "row",
                              cursor: "pointer",
                            }}
                          >
                            <FileTextOutlined style={{ fontSize: "15px" }} />
                            <span>
                              {" "}
                              {roundformData.billFileOriginalroundway1}
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <></>
          )}
        </Spin>
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
          onClick={() => setOpenSave(true)}
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

export default PullFlight;
