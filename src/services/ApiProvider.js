
import axios from "axios";
import { handleResponse,handleError } from "./ResponseService";
 const post = (resource, body, options) => {
    return axios
      .post(resource, body, options)
      .then(handleResponse)
      .catch(handleError);
      // .then((res)=>{return(res)})
      // .catch((err)=>{return(err)});
  };
 const get = (resource,options) => {

    return axios
      .get(resource,options)
      .then(handleResponse)
      .catch(handleError);
      // .then((res)=>{return(res)})
      // .catch((err)=>{return(err)});
  };
  
  let obj= { post,get }
export default obj;