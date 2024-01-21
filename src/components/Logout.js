import React, { useEffect } from 'react'
import {
    bus,
    carRental,
    cashAdvance,
    flight,
    hoteldata,
    perdiem,
    perdiemextra,
    requesteid,
    taxi,
    train,
    travelHeader,
  } from "../redux/actions";
import { useNavigate } from 'react-router-dom';
function Logout() {
  
    const navigate=useNavigate()
    useEffect(()=>{
        // dispatch(bus({}));
        // dispatch(cashAdvance({}));
        // dispatch(carRental({}));
        // dispatch(flight({}));
        // dispatch(hoteldata({}));
        // dispatch(perdiem({}));
        // dispatch(perdiemextra({}));
        // dispatch(taxi({}));
        // dispatch(train({}));
        // dispatch(travelHeader({}));
        // dispatch(requesteid(""));
        sessionStorage.clear()
navigate('/login')
    },[])
  return (
    <div>Logout</div>
  )
}

export default Logout