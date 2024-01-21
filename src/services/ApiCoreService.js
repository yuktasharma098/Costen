import ApiProvider from "./ApiProvider";

export class ApiCore {
  // post_file(url, userdata, params, header) {
  //   let urn = time();

  //   const authorization = getAuthorization();

  //   const authToken = generateBasicAuthToken(urn);

  //   let options1 = {
  //     headers: {
  //       urn: urn,
  //       authtoken: authToken,
  //       Authorization: authorization,
  //       ...header,
  //     },
  //     timeout: 70000,
  //     params: params,
  //   };
  //   return ApiProvider.post(url, userdata, options1);
  // }

  post(url, body) {
    // let options1 = {
    //   headers: {
    //     urn: urn,
    //     authtoken: authToken,
    //     Authorization: authorization,
    //   },
    //   timeout: 70000,
    // };
    return ApiProvider.post(url, body);
  }
  postAuth(url, body) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",

      },
      // timeout: 70000,
    };
    return ApiProvider.post(url, body, options1);
  }
  postAuthWithPolicy(url, body, requestPolicy) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        requestPolicy: requestPolicy,
      },
      // timeout: 70000,
    };
    return ApiProvider.post(url, body, options1);
  }
  getpolicy(url) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        organization: sessionStorage.getItem("organization"),
        "Content-Type": "application/json",
      },

      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getgeneral(url) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        organization: sessionStorage.getItem("organization"),
        employeeId: sessionStorage.getItem("employeeId"),
        "Content-Type": "application/json",
      },

      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getgeneralRequest(url, id, type, requestPolicy) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        organization: sessionStorage.getItem("organization"),
        employeeId: sessionStorage.getItem("employeeId"),
        "Content-Type": "application/json",
        requestId: id,
        requestType: type,
        requestPolicy: requestPolicy,
      },

      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getRequest(url, id, type, requestPolicy) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
        requestId: id,
        requestType: type,
        requestPolicy: requestPolicy,
      },
      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getEmpId(url, id) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
        employeeId: id,
      },

      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getAuth(url) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },

      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  postWithParamsAndPolicy(url, params, body, requestPolicy) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
        requestPolicy: requestPolicy,
      },
      params: params,

      // timeout: 70000,
    };

    return ApiProvider.post(url, body, options1);
  }
  postforexpensetransport(url, formdata,params) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "multipart/form-data",
      },
      params:params
      // timeout: 70000,
    };

    return ApiProvider.post(url, formdata, options1);
  }
  getRequestForExpense(url, id, requestPolicy) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
        requestId: id,
        requestPolicy: requestPolicy,
      },
      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getPreviewFile(url, name) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
        fileName: name,
      },
      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getExchangeRate(url, billCurrency, baseCurrency) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
        billCurrency: billCurrency,
        baseCurrency: baseCurrency,
      },

      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getTransportRequest(url, id) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
        requestId: id,
       
      },
      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getSubmitReceiptList(url,claimno) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
        claimNumber:claimno
      },

      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
  getSubmitReceipt(url,id) {
    let options1 = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        "Content-Type": "application/json",
        claimExpenseId:id
      },

      // timeout: 70000,
    };
    return ApiProvider.get(url, options1);
  }
}

// post(url, body) {
//   let urn = time();
//   const authorization = getAuthorization();
//   const authToken = generateBasicAuthToken(urn);
//   let options1 = {
//     headers: {
//       urn: urn,
//       authtoken: authToken,
//       Authorization: authorization,
//     },
//     timeout: 70000,
//   };
//   return ApiProvider.post(url, body, options1);
// }
