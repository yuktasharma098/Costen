import { ApiCore } from "./ApiCoreService";
export function login(body) {
  let url = "https://vyay-test.azurewebsites.net/login";

  return new Promise((resolve, reject) => {
    new ApiCore().post(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function forgetpassword(body) {
  let url = "https://vyay-test.azurewebsites.net/forget-password";

  return new Promise((resolve, reject) => {
    new ApiCore().post(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function otpVerify(body) {
  let url = "https://vyay-test.azurewebsites.net/otp-verify";

  return new Promise((resolve, reject) => {
    new ApiCore().post(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function changePassword(body) {
  let url = "https://vyay-test.azurewebsites.net/change-password";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function resetPassword(body) {
  let url = "https://vyay-test.azurewebsites.net/reset-password";

  return new Promise((resolve, reject) => {
    new ApiCore().post(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function refreshToken() {
  let url = "https://vyay-test.azurewebsites.net/refresh";
  let body;

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function travelRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/travel-request";


  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function generalRequest(body,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/request-cost-center";


  return new Promise((resolve, reject) => {
    new ApiCore().postAuthWithPolicy(url, body,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function hotelRequest(body,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/request-hotel";


  return new Promise((resolve, reject) => {
    new ApiCore().postAuthWithPolicy(url, body,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function getHotelData(id,type,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/request-hotel";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequest(url,id,type,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function perDiemRequest(body,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/request-perdiem";


  return new Promise((resolve, reject) => {
    new ApiCore().postAuthWithPolicy(url, body,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function cashInAdvance(body,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/request-advcash";


  return new Promise((resolve, reject) => {
    new ApiCore().postAuthWithPolicy(url, body,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function transport(body) {
  let url = "https://vyay-test.azurewebsites.net/request-transport";


  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function requestPolicy() {
  let url = "https://vyay-test.azurewebsites.net/get-request-policy";

  return new Promise((resolve, reject) => {
    new ApiCore().getpolicy(url).then((res) => {
      resolve(res);
    });
  });
}
export function getprofileData() {
  let url = "https://vyay-test.azurewebsites.net/get-profile";

  return new Promise((resolve, reject) => {
    new ApiCore().getgeneral(url).then((res) => {
      resolve(res);
    });
  });
}
export function getgeneralData(id,type,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/request-cost-center";

  return new Promise((resolve, reject) => {
    new ApiCore().getgeneralRequest(url,id,type,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function getTravelRequest(id,type) {
  let url = "https://vyay-test.azurewebsites.net/travel-request";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequest(url,id,type).then((res) => {
      resolve(res);
    });
  });
}
export function getPerDiem(id,type,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/request-perdiem";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequest(url,id,type,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function getCashInAdvance(id,type,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/request-advcash";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequest(url,id,type,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function submitTravelRequest(id) {
  let url = "https://vyay-test.azurewebsites.net/request-submit";
let body={
  requestId:id,
  status: "submitted"
}
  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url,body).then((res) => {
      resolve(res);
    });
  });
}
export function getDashboardNumber(id) {
  let url = "https://vyay-test.azurewebsites.net/request-count";

  return new Promise((resolve, reject) => {
    new ApiCore().getEmpId(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function getTotalRequest(empId) {
  let url = "https://vyay-test.azurewebsites.net/total-travel-request";

  return new Promise((resolve, reject) => {
    new ApiCore().getEmpId(url,empId).then((res) => {
      resolve(res);
    });
  });
}
export function allTravelRequestDashboard(empId) {
  let url = "https://vyay-test.azurewebsites.net/travel-request-list";

  return new Promise((resolve, reject) => {
    new ApiCore().getEmpId(url,empId).then((res) => {
      resolve(res);
    });
  });
}
export function getPendingRequest(empId) {
  let url = "https://vyay-test.azurewebsites.net/pending-travel-request";

  return new Promise((resolve, reject) => {
    new ApiCore().getEmpId(url,empId).then((res) => {
      resolve(res);
    });
  });
}
export function getToBeApproved(empId) {
  let url = "https://vyay-test.azurewebsites.net/request-to-approved";

  return new Promise((resolve, reject) => {
    new ApiCore().getEmpId(url,empId).then((res) => {
      resolve(res);
    });
  });
}
export function postOtherExpense(body,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/other-expense";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuthWithPolicy(url, body,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function getOtherExpense(id,type,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/other-expense";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequest(url,id,type,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function getTransport(id,type,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/request-transport";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequest(url,id,type,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function postTransport(type,body,requestPolicy){
  let url = "https://vyay-test.azurewebsites.net/request-transport";
  let params = {
    transportType:type
  };
  return new Promise((resolve, reject) => {
    new ApiCore().postWithParamsAndPolicy(url,params,body,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function withdrawRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/request-withdrawn";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function cancelRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/cancel-request ";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function getNeedHelp() {
  let url = "https://vyay-test.azurewebsites.net/need-help ";

  return new Promise((resolve, reject) => {
    new ApiCore().getAuth(url).then((res) => {
      resolve(res);
    });
  });
}
export function getApprovedetails(id,type) {
  let url = "https://vyay-test.azurewebsites.net/request-detail";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequest(url,id,type).then((res) => {
      resolve(res);
    });
  });
}
export function approval(body,urlpart) {
  let url = `https://vyay-test.azurewebsites.net/${urlpart}`;

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function writeToUs(body) {
  let url = "https://vyay-test.azurewebsites.net/need-help";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function getBulletinBoard() {
  let url = "https://vyay-test.azurewebsites.net/get-bulletin";

  return new Promise((resolve, reject) => {
    new ApiCore().getpolicy(url).then((res) => {
      resolve(res);
    });
  });
}
export function sendBackByManager(body) {
  let url = "https://vyay-test.azurewebsites.net/request-send-back";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function clearRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/clear-data ";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function getNotification(id) {
  let url = "https://vyay-test.azurewebsites.net/notification";

  return new Promise((resolve, reject) => {
    new ApiCore().getEmpId(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function updateNotificationStatus(body){
  let url = "https://vyay-test.azurewebsites.net/notification";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function pullRequestList(empId) {
  let url = "https://vyay-test.azurewebsites.net/pull-request-list";

  return new Promise((resolve, reject) => {
    new ApiCore().getEmpId(url,empId).then((res) => {
      resolve(res);
    });
  });
}

export function expensetransport(formdata,type) {
  let url = "https://vyay-test.azurewebsites.net/expense-transport";
  let params = {
    transportType:type
  };
  return new Promise((resolve, reject) => {
 new ApiCore().postforexpensetransport(url,formdata,params).then((res) => {
      resolve(res);
    });
  });
}
export function expensehotel(formdata) {
  let url = "https://vyay-test.azurewebsites.net/expense-hotel";

  return new Promise((resolve, reject) => {
 new ApiCore().postforexpensetransport(url,formdata).then((res) => {
      resolve(res);
    });
  });
}
export function expensegethotel(id) {
  let url = "https://vyay-test.azurewebsites.net/expense-hotel";

  return new Promise((resolve, reject) => {
 new ApiCore().getRequestForExpense(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function PreviewFile(name) {
  let url = "https://vyay-test.azurewebsites.net/preview-file";

  return new Promise((resolve, reject) => {
 new ApiCore().getPreviewFile(url,name).then((res) => {
      resolve(res);
    });
  });
}
export function currencyList() {
  let url = "https://vyay-test.azurewebsites.net/get-currency ";

  return new Promise((resolve, reject) => {
    new ApiCore().getAuth(url).then((res) => {
      resolve(res);
    });
  });
}
export function exchangeRate(billCurrency,baseCurrency) {
  let url = "https://vyay-test.azurewebsites.net/exchange-rate ";

  return new Promise((resolve, reject) => {
    new ApiCore().getExchangeRate(url,billCurrency,baseCurrency).then((res) => {
      resolve(res);
    });
  });
}
export function ocr(file) {
  let url = "https://vyay-test.azurewebsites.net/file-ocr";

  return new Promise((resolve, reject) => {
    new ApiCore().postforexpensetransport(url, file).then((res) => {
      resolve(res);
    });
  });
}
export function pull(body) {
  let url = "https://vyay-test.azurewebsites.net/pull-request-setup";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function expenseClear(body) {
  let url = "https://vyay-test.azurewebsites.net/clear-expense-data ";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function getExpenseTransport(id) {
  let url = "https://vyay-test.azurewebsites.net/expense-transport";

  return new Promise((resolve, reject) => {
    new ApiCore().getTransportRequest(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function ExpenseCancelRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/cancel-expense-request ";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function allExpenseTravelRequestDashboard(empId) {
  let url = "https://vyay-test.azurewebsites.net/expense-request-list";

  return new Promise((resolve, reject) => {
    new ApiCore().getEmpId(url,empId).then((res) => {
      resolve(res);
    });
  });
}
export function expenseTravelRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/expense-request";


  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function getExpenseTravelRequest(id) {
  let url = "https://vyay-test.azurewebsites.net/expense-request";

  return new Promise((resolve, reject) => {
    new ApiCore().getTransportRequest(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function expensePerDiemRequest(body,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/expense-perdiem";


  return new Promise((resolve, reject) => {
    new ApiCore().postAuthWithPolicy(url, body,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function getExpensePerDiem(id,requestPolicy) {
  let url = "https://vyay-test.azurewebsites.net/expense-perdiem";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequestForExpense(url,id,requestPolicy).then((res) => {
      resolve(res);
    });
  });
}
export function getExpenseCashInAdvance(id) {
  let url = "https://vyay-test.azurewebsites.net/expense-advcash";

  return new Promise((resolve, reject) => {
    new ApiCore().getTransportRequest(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function getExpenseGeneralData(id) {
  let url = "https://vyay-test.azurewebsites.net/expense-cost-center";

  return new Promise((resolve, reject) => {
    new ApiCore().getgeneralRequest(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function submitExpenseRequest(id) {
  let url = "https://vyay-test.azurewebsites.net/expenserequest-submit";
let body={
  requestId:id,
  status: "submitted"
}
  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url,body).then((res) => {
      resolve(res);
    });
  });
}
export function expensepostOtherExpense(body) {
  let url = "https://vyay-test.azurewebsites.net/expense-other-expense";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuthWithPolicy(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function ExpensewithdrawRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/expenserequest-withdrawn";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function getExpenseDashboardNumber(id) {
  let url = "https://vyay-test.azurewebsites.net/expense-request-count";

  return new Promise((resolve, reject) => {
    new ApiCore().getEmpId(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function getExpenseApprovedetails(id) {
  let url = "https://vyay-test.azurewebsites.net/expense-request-detail";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequest(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function approvalExpense(body,urlpart) {
  let url = `https://vyay-test.azurewebsites.net/expenserequest-${urlpart}`;

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function sendBackExpense(body) {
  let url = "https://vyay-test.azurewebsites.net/request-send-back";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function getExpenseOtherExpense(id) {
  let url = "https://vyay-test.azurewebsites.net/expense-other-expense";

  return new Promise((resolve, reject) => {
    new ApiCore().getRequest(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function submitReceiptPost(formdata) {
  let url = "https://vyay-test.azurewebsites.net/expense-receipt-request";

  return new Promise((resolve, reject) => {
 new ApiCore().postforexpensetransport(url,formdata).then((res) => {
      resolve(res);
    });
  });
}
export function submitReceiptList(claimno) {
  let url = "https://vyay-test.azurewebsites.net/expense-receipt-request";

  return new Promise((resolve, reject) => {
 new ApiCore().getSubmitReceiptList(url,claimno).then((res) => {
      resolve(res);
    });
  });
}
export function submitReceiptGet(id) {
  let url = "https://vyay-test.azurewebsites.net/expense-receipt-request";

  return new Promise((resolve, reject) => {
 new ApiCore().getSubmitReceipt(url,id).then((res) => {
      resolve(res);
    });
  });
}
export function deleteClaims(body) {
  let url = "https://vyay-test.azurewebsites.net/expense-receipt-request";

  return new Promise((resolve, reject) => {
 new ApiCore().postAuth(url,body).then((res) => {
      resolve(res);
    });
  });
}
export function submitClaimRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/expense-receipt-submit";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url,body).then((res) => {
      resolve(res);
    });
  });
}
export function ClaimwithdrawRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/expense-receipt-withdrawn";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function claimApprove(body,urlpart) {
  let url = `https://vyay-test.azurewebsites.net/expense-receipt-${urlpart}`;

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function sendBackClaim(body) {
  let url = "https://vyay-test.azurewebsites.net/expense-receipt-sendback";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
export function ClaimcancelRequest(body) {
  let url = "https://vyay-test.azurewebsites.net/expense-receipt-cancel";

  return new Promise((resolve, reject) => {
    new ApiCore().postAuth(url, body).then((res) => {
      resolve(res);
    });
  });
}
// export function uploadSettlementFile(userdata,filetype) {
//     let url = `http://172.16.52.62:8055/logindetails/settlement`;

//     let params = {
//      filetype:filetype
//     };
//     // userdata.append("username","yogesh1")
//     // userdata.append("sessiontoken","rt67yhubji")
//      userdata.append("username","jatin.kumar@rapipay.com")
//     userdata.append("sessiontoken","DlmZWIwN2ExN2E",)
//     return new Promise((resolve,reject) => {
//       new ApiCore().post_file(url, userdata,params).then((res) => {
//         if(res.apiResponseCode=="200"){
//              resolve(res.apiResponseData);
//         }
//         else{
//           reject(res.apiResponseMessage)
//         }
//       });
//     });
//   }

// export function getPermission(user, sessionToken) {
//     let url =
//       "https://webdev.rapipayuat.com/adminservices/logindetails/permissions";
//     let body = {
//       username: user ? user : sessionStorage.getItem(""),
//       sessiontoken : sessionToken ? sessionToken : sessionStorage.getItem("sessionToken"),
//       // username: "yogesh1",
//       // sessiontoken: "DlmZWIwN2ExN2E",
//     };
//     return new Promise((resolve, reject) => {
//       new ApiCore().post(url, body).then((res) => {
//         if (res.apiResponseCode === "200") {
//           resolve(res.apiResponseData);
//         } else {
//           reject(res.apiResponseMessage);
//         }
//       });
//     });
//   }
