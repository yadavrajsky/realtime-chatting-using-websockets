/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthForm from "./AuthForm";
import { resetNotificationState, signupUser } from "../../reducers/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, message, isAuthenticated } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, []);

  useEffect(() => {
    if (message) toast.success(message);
    else if (error) toast.error(error);

    return () => {
      dispatch(resetNotificationState());
    };
  }, [dispatch, error, message]);
  const handleSignup = (userData) => {
    dispatch(signupUser(userData));
  };

  return (
    <div>
      <h2 className="text-center mt-6 font-bold text-2xl">Signup</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <AuthForm onSubmit={handleSignup} buttonText="Signup" />
      )}
    </div>
  );
}

export default Signup;
