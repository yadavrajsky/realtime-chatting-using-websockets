/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  if (!isAuthenticated) {
    // navigate("/login");
    return <Navigate to="/login" />;

  }
  // return null; // Return null to prevent rendering the component

  // Render the component for UI navigation or authenticated users
  return children;
};

export default PrivateRoute;
