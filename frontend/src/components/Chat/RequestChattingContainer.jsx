import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { checkInterestExistence } from "../../reducers/interestSlice";
import Loader from "../Loader/Loader";
import { fetchUserById } from "../../reducers/userSlice";

const RequestChattingContainer = () => {
  const [message, setMessage] = useState("");
  const { websocket } = useSelector((state) => state.websocket);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();
  const {
    loading: interestLoading,
    interest,
    interestExists,
  } = useSelector((state) => state.interest);
  const { fetchedUser: receiverUserData } = useSelector((state) => state.user);

  const handleSendMessage = () => {
    if (message.trim() && websocket) {
      const payload = {
        message,
        receiver: slug,
      };
      if (websocket) websocket.send(JSON.stringify(payload));
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents new line insertion
      if (message.trim()) handleSendMessage();
    }
  };

  useEffect(() => {
    if (interestExists === true) {
      // Redirect to chat page
      navigate(`/dashboard/chat/${interest?.id}`);
    }
  }, [dispatch, interestExists, navigate]);

  useEffect(() => {
    if (slug) dispatch(checkInterestExistence({ receiver_id: slug }));
  }, [dispatch, interest, navigate]);

  useEffect(() => {
    dispatch(fetchUserById(slug));
  }, [dispatch, slug]);

  return (
    <>
      <div className="flex items-center justify-start mb-4 p-4 bg-white">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold mr-3 border border-gray-500">
          {receiverUserData?.name[0]}
        </div>
        <h2 className="text-2xl font-bold">{receiverUserData?.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100">
        {interestLoading && <Loader />}
      </div>

      <div className="bg-white border-t flex items-center p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyDown} // Add keydown event handler here
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Send Invite
        </button>
      </div>
    </>
  );
};

export default RequestChattingContainer;
