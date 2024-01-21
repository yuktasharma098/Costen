
export function handleResponse(response) {


    return response.data;
  
  //   if (response.data) {

  //     if (response.data.apiResponseCode === "200") {

  // return response.data.apiResponseData

  //     } else {
  //    return Modal.error({
  //     content:`${response.data.apiResponseMessage}`
  //    })
  //     }
  //   }
}

export function handleError(error) {
  return error;
}
