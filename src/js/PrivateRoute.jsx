import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const roleId = localStorage.getItem("roleId");

  // Если не авторизован или роль не разрешена — редирект на авторизацию
  if (!roleId || !allowedRoles.includes(roleId.toLowerCase())) {
    return <Navigate to="/AuthorizationForm" replace />;
  }

  return children;
};

export default PrivateRoute;
