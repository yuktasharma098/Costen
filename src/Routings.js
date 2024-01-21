import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import NeedHelp from "./components/NeedHelp";
import DashboardManager from "./components/DashboardManager";
import Profile from "./components/Profile";
import FirstTimePasswordChange from "./components/FirstTimePasswordChange";
import Logout from "./components/Logout";
import RouteGuard from "./RouteGuard";
import Loading from "./components/Loading";
import ResetPassword from "./components/ResetPassword";

function Routings() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
     
       

        <Route path="/forgot-password" element={<ForgotPassword />} />
       

        
       
       
        <Route
          path="/needhelp"
          element={
            <RouteGuard element={<NeedHelp />} allowedUserTypes={["1", "2"]} />
          }
        />
        
  
        <Route
          path="/profile"
          element={
            <RouteGuard element={<Profile />} allowedUserTypes={["1", "2"]} />
          }
        />
    
     
    
       
        <Route path="/password-change" element={<FirstTimePasswordChange />} />
       
        <Route
          path="/load"
          element={
            <RouteGuard element={<Loading />} allowedUserTypes={["1", "2"]} />
          }
        />
      
      <Route
          path="/changepassword"
          element={
            <RouteGuard element={<ResetPassword />} allowedUserTypes={["1", "2"]} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <RouteGuard element={<Dashboard />} allowedUserTypes={["2"]} />
          }
        />
        <Route
          path="/dashboard-m"
          element={
            <RouteGuard
              element={<DashboardManager />}
              allowedUserTypes={["1"]}
            />
          }
        />
      
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routings;