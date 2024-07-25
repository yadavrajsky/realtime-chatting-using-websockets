import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchInterestDetail,
  resetNotificationState,
  updateInterest,
} from "../../reducers/interestSlice";
import Loader from "../Loader/Loader";
import { fetchMessages } from "../../reducers/messageSlice";
import { toast } from "react-toastify";

const InvitationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { loading: messageLoading, messages } = useSelector(
    (state) => state.message
  );
  const {
    loading: interestLoading,
    interest,
    error,
    message,
  } = useSelector((state) => state.interest);

  const handleUpdateInterest = (status) => {
    console.log(slug);
    if (slug) dispatch(updateInterest({ id: slug, data: { status: status } }));
  };

  useEffect(() => {
    dispatch(fetchInterestDetail(slug));
    dispatch(fetchMessages({ interest_id: slug }));
  }, [dispatch, slug]);

  useEffect(() => {
    if (interest?.status === "accepted" || interest?.status === "rejected") {
      // Redirect to chat page
      navigate(`/dashboard/chat/${interest?.id}`);
    }
  }, [dispatch, interest, navigate]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetNotificationState());
      dispatch(fetchInterestDetail(slug));
    }
    if (error) {
      toast.error(error);
      dispatch(resetNotificationState());
    }
  }, [dispatch, message, error]);

  return (
    <>
      <div className="flex items-center justify-start mb-4 p-4 bg-white">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold mr-3 border border-gray-500">
          {interest?.sender?.name[0]}
        </div>
        <h2 className="text-2xl font-bold">{interest?.sender?.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100">
        {messageLoading || interestLoading ? (
          <Loader />
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          <>
            {/* Chat messages */}
            <ul className="space-y-4 h-96">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-lg shadow-md max-w-xs "bg-gray-300 text-black mr-auto border ml-3`}
                >
                  <p className="text-sm">{msg?.content}</p>
                  <div className={`text-xs text-black mt-1`}>
                    {new Date(msg?.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="bg-white border-t  p-4 flex justify-center items-center">
        <button
          onClick={() => handleUpdateInterest("accepted")}
          className="ml-4 bg-green-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Accept
        </button>
        <button
          onClick={() => handleUpdateInterest("rejected")}
          className="ml-4 bg-red-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Reject
        </button>
      </div>
    </>
  );
};

export default InvitationPage;
