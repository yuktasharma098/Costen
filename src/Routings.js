import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import AddRequest from "./components/AddRequest";
import TravelPage from "./components/TravelPage";
import NeedHelp from "./components/NeedHelp";
import ResetPassword from "./components/ResetPassword";
import DashboardManager from "./components/DashboardManager";
import PageNotFound from "./components/PageNotFound";
import Profile from "./components/Profile";
import Details from "./components/Details";
import ExpenseDashboard from "./components/ExpenseDashboard";
import TotalRequest from "./components/TotalRequest";
import OpenRequest from "./components/OpenRequest";
import PendingRequest from "./components/PendingRequest";
import FirstTimePasswordChange from "./components/FirstTimePasswordChange";
import ToBeApproved from "./components/ToBeApproved";
import Logout from "./components/Logout";
import RouteGuard from "./RouteGuard";
import Notification from "./components/Notification";
import TotalRequestExpense from "./components/Expense/TotalRequestExpense";
import OpenRequestExpense from "./components/Expense/OpenRequestExpense";
import PendingRequestExpense from "./components/Expense/PendingRequestExpense";
import ToBeApprovedExpense from "./components/Expense/ToBeApprovedExpense";
import ListOfPullRequest from "./components/Expense/PullRequest/ListOfPullRequest";
import PullTravelPage from "./components/Expense/PullRequest/PullTravelPage";
import MainPage from "./components/Expense/SubmitReceipt/MainPage";
import SubmitReceiptForm from "./components/Expense/SubmitReceipt/SubmitReceiptForm";
import Loading from "./components/Loading";
import DetailsExpense from "./components/Expense/DetailsExpense";
import DynamicCollapse from "./components/DynamicCollapse";

function Routings() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* <Route path="/tobeapprove" element={<ToBeApproved />} /> */}
        <Route
          path="/tobeapprove"
          element={
            <RouteGuard element={<ToBeApproved />} allowedUserTypes={["1"]} />
          }
        />
        {/* <Route path="/tobeapproveexpense" element={<ToBeApprovedExpense />} /> */}
        <Route
          path="/tobeapproveexpense"
          element={
            <RouteGuard
              element={<ToBeApprovedExpense />}
              allowedUserTypes={["1"]}
            />
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route
          path="/forgot-password"
          element={
            <RouteGuard
              element={<ForgotPassword />}
              allowedUserTypes={["1", "2"]}
            />
          }
        /> */}

        {/* <Route path="/main-page" element={<MainPage />} /> */}
        <Route
          path="/main-page"
          element={
            <RouteGuard element={<MainPage />} allowedUserTypes={["1", "2"]} />
          }
        />
        {/* <Route path="/add-request" element={<AddRequest />} /> */}
        <Route
          path="/add-request"
          element={
            <RouteGuard
              element={<AddRequest />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/travel-page" element={<TravelPage />} /> */}
        <Route
          path="/travel-page"
          element={
            <RouteGuard
              element={<TravelPage />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/needhelp" element={<NeedHelp />} /> */}
        <Route
          path="/needhelp"
          element={
            <RouteGuard element={<NeedHelp />} allowedUserTypes={["1", "2"]} />
          }
        />
        {/* <Route path="/changepassword" element={<ResetPassword />} /> */}
        <Route
          path="/changepassword"
          element={
            <RouteGuard
              element={<ResetPassword />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route
          path="/profile"
          element={
            <RouteGuard element={<Profile />} allowedUserTypes={["1", "2"]} />
          }
        />
        {/* <Route path="/detail" element={<Details />} /> */}
        <Route
          path="/detail"
          element={
            <RouteGuard element={<Details />} allowedUserTypes={["1"]} />
          }
        />
        {/* <Route path="/dashboard-expense" element={<ExpenseDashboard />} /> */}
        <Route
          path="/dashboard-expense"
          element={
            <RouteGuard
              element={<ExpenseDashboard />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/total-request" element={<TotalRequest />} /> */}
        <Route
          path="/total-request"
          element={
            <RouteGuard
              element={<TotalRequest />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/open-request" element={<OpenRequest />} /> */}
        <Route
          path="/open-request"
          element={
            <RouteGuard
              element={<OpenRequest />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/pending-request" element={<PendingRequest />} /> */}
        <Route
          path="/pending-request"
          element={
            <RouteGuard
              element={<PendingRequest />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/details-expense" element={<DetailsExpense/>}/> */}
        <Route
          path="/details-expense"
          element={
            <RouteGuard element={<DetailsExpense />} allowedUserTypes={["1"]} />
          }
        />
        {/* <Route
          path="/total-request-expense"
          element={<TotalRequestExpense />}
        /> */}
        <Route
          path="/total-request-expense"
          element={
            <RouteGuard
              element={<TotalRequestExpense />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/open-request-expense" element={<OpenRequestExpense />} /> */}
        <Route
          path="/open-request-expense"
          element={
            <RouteGuard
              element={<OpenRequestExpense />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route
          path="/pending-request-expense"
          element={<PendingRequestExpense />}
        /> */}
        <Route
          path="/pending-request-expense"
          element={
            <RouteGuard
              element={<PendingRequestExpense />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        <Route path="/password-change" element={<FirstTimePasswordChange />} />
        {/* <Route
          path="/password-change"
          element={
            <RouteGuard
              element={<FirstTimePasswordChange />}
              allowedUserTypes={["1", "2"]}
            />
          }
        /> */}
        {/* <Route path="/notification" element={<Notification />} /> */}
        <Route
          path="/notification"
          element={
            <RouteGuard
              element={<Notification />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/pull-request" element={<ListOfPullRequest />} /> */}
        <Route
          path="/pull-request"
          element={
            <RouteGuard
              element={<ListOfPullRequest />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/pull-travel-page" element={<PullTravelPage />} /> */}
        <Route
          path="/pull-travel-page"
          element={
            <RouteGuard
              element={<PullTravelPage />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/create-expense" element={<SubmitReceiptForm />} /> */}
        <Route
          path="/create-expense"
          element={
            <RouteGuard
              element={<SubmitReceiptForm />}
              allowedUserTypes={["1", "2"]}
            />
          }
        />
        {/* <Route path="/load" element={<Loading />} /> */}
        <Route
          path="/load"
          element={
            <RouteGuard element={<Loading />} allowedUserTypes={["1", "2"]} />
          }
        />
        {/* <Route path="/collapse" element={<DynamicCollapse />} /> */}
        <Route
          path="/collapse"
          element={
            <RouteGuard
              element={<DynamicCollapse />}
              allowedUserTypes={["1", "2"]}
            />
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
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routings;