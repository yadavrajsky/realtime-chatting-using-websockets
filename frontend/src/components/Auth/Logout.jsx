// /* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logoutUser, resetNotificationState } from "../../reducers/authSlice";
// import { toast } from "react-toastify";

// const Logout = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { isLoading, error, message, isAuthenticated } = useSelector(
//     (state) => state.auth
//   );
//   useEffect(() => {
//     if (message) toast.success(message);
//     else if (error) toast.error(error);

//     return () => {
//       dispatch(resetNotificationState());
//     };
//   }, [dispatch, error, message]);

//   useEffect(() => {
//     dispatch(logoutUser());
//   }, []);
//   useEffect(() => {
//     if (!isAuthenticated) navigate("/");
//   }, [isAuthenticated]);

//   return <div className="text-center">{isLoading ? "Loading...." : ""}</div>;
// };

// export default Logout;
