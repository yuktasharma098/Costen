import { Navigate} from "react-router-dom";

const RouteGuard = ({ element, allowedUserTypes }) => {
  const isAuthenticated = !!sessionStorage.getItem("accessToken");
  const userType = sessionStorage.getItem("userType");

  if (isAuthenticated && allowedUserTypes.includes(userType)) {
    return element;
  } else {
    return (
      <Navigate to="/login" replace state={{ from: window.location.pathname }} />
    );
  }
};

export default RouteGuard;