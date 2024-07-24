/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthForm from "./AuthForm";
import { resetNotificationState, loginUser } from "../../reducers/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, message, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (message) toast.success(message);
    else if (error) toast.error(error);

    return () => {
      dispatch(resetNotificationState());
    };
  }, [dispatch, error, message]);
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = (credentials) => {
    dispatch(loginUser(credentials));
  };

  return (
    <div>
      <h2 className="text-center mt-6 font-bold text-2xl">Login</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <AuthForm onSubmit={handleLogin} buttonText="Login" isLogin={true} />
      )}
    </div>
  );
}

export default Login;
