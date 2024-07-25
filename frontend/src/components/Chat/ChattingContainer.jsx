import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../reducers/messageSlice";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { fetchInterestDetail } from "../../reducers/interestSlice";
import { MdCancel, MdCheckCircle } from "react-icons/md";

const ChattingContainer = () => {
  const [message, setMessage] = useState("");
  const { websocket } = useSelector((state) => state.websocket); 
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { isLoading, messages } = useSelector((state) => state.message);
  const { interest } = useSelector((state) => state.interest);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchMessages({ interest_id: slug })); // Fetch messages or update state
    dispatch(fetchInterestDetail(slug));
  }, [dispatch, slug]);

  const handleSendMessage = () => {
    if (message.trim() && websocket) {
      const payload = {
        message,
        receiver:
          interest?.sender?.id === user?.id
            ? interest?.receiver?.id
            : interest?.sender?.id,
      };
      if (websocket) websocket.send(JSON.stringify(payload));
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents new line insertion
      if(message.trim())
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="flex items-center justify-start mb-4 p-4 bg-white">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold mr-3 border border-gray-500">
          {interest?.sender?.id === user?.id
            ? interest?.receiver?.name[0]
            : interest?.sender?.name[0]}
        </div>
        <h2 className="text-2xl font-bold">
          {interest?.sender?.id === user?.id
            ? interest?.receiver?.name
            : interest?.sender?.name}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100">
        {/* Chat messages */}
        {isLoading ? (
          <Loader />
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          <>
            <ul className="space-y-4 h-96">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-lg shadow-md max-w-xs border  ${
                    msg?.sender?.id === user?.id
                      ? "bg-blue-400 text-white ml-auto mr-3"
                      : "bg-gray-300 text-black mr-auto ml-3"
                  }`}
                >
                  <p className="text-sm">{msg?.content}</p>
                  <div
                    className={`text-xs ${
                      msg?.sender?.id === user?.id ? "text-white" : "text-black"
                    } mt-1`}
                  >
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
      {interest && (

      <div className="bg-white border-t flex items-center p-4">
        {interest?.status === "accepted" && (
          <>
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
              Send
            </button>
          </>
        )}
        {interest?.status === "rejected" && (
          <div className="flex justify-center items-center w-full">
            Invitation Rejected <MdCancel className="text-red-500 ml-2" />
          </div>
        )}

        {interest?.status === "pending" && (
          <div className="flex justify-center items-center w-full">
            Invite Sent <MdCheckCircle className="text-green-500 ml-2" />
          </div>
        )}
      </div>
      )}

    </>
  );
};

export default ChattingContainer;
