
import {combineReducers} from "redux"
import requestedid from "./requestedid";
import travelHeader from "./travelHeader";
import general from "./general";
import hoteldata from "./hoteldata";
import cashAdvance from "./cashAdvance";
import flight from "./flight";
import amount from "./amount";
import train from "./train";
import bus from "./bus";
import taxi from "./taxi";
import carRental from "./carRental";
import perdiem from "./perdiem";
import perdiemextra from "./perdiemextra";
import claimno from "./claimno";
import submitExpense from "./submitExpense";


const rootReducer = combineReducers({

    travelHeader,
    requestedid,
    general,
    hoteldata,
    cashAdvance,
    flight,
    train,
    bus,
    taxi,
    perdiem,
    perdiemextra,
    carRental,
    amount,
    claimno,
    submitExpense



})
export default rootReducer;