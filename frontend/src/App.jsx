/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Home from "./components/Home";
import "./App.css";
import About from "./components/About/About";
import NotFound from "./components/NotFound";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeWebSocket,
  setWebsocketConnection,
  websocketConnectionStatus,
  websocketErrorReceived,
} from "./reducers/websocketSlice";
import { addMessage } from "./reducers/messageSlice";
import { addInterest, setInterestExists } from "./reducers/interestSlice";

function App() {
  const dispatch = useDispatch();
  const { websocket, error } = useSelector((state) => state.websocket);
  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new WebSocket("ws://localhost:8000/ws/chat/");
    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      dispatch(websocketErrorReceived(error.message));
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      dispatch(websocketConnectionStatus("disconnected"));
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const message = JSON.parse(event.data);
      console.log(message);
      // Dispatch action to handle incoming message
      if (message?.message) {
        dispatch(addMessage(message?.message));
      } else if (message?.error) {
        dispatch(websocketErrorReceived(message.error));
      }
      if (message?.interest) {
        dispatch(addInterest(message?.interest));
      }
      if(message?.interestExists && message?.interest )
        dispatch(setInterestExists({data:message?.interest,exists:message?.interestExists}));
    };

    dispatch(setWebsocketConnection(socket));

    return () => {
      socket.close();
    };
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <>
      <div
        className=" overflow-hidden"
        style={{ height: "100vh", width: "100vw" }}
      >
        <Router>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            {/* <PrivateRoute path="/dashboard" element={<Dashboard />} /> */}
            <Route
              path="/dashboard/:chatMenuOption?/:slug?"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
