import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default ProtectedRoute;
