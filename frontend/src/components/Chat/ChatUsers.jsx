import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { fetchInterests } from "../../reducers/interestSlice";
const ChatUsers = () => {
  const { chatMenuOption } = useParams();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { isLoading, interests } = useSelector((state) => state.interest);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if(chatMenuOption == "invitations")
    dispatch(fetchInterests({status:"pending",invitations:true}));
    else
    dispatch(fetchInterests({chat_users:true}));
  }, [dispatch, chatMenuOption]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="border shadow-lg h-full bg-white">
          <h2 className="text-2xl font-bold text-center py-4 border-b">
            {chatMenuOption == "invitations" ? "Invitations" : "Chat Users"}
          </h2>
          <ul className="m-4">
            {interests.map((interest) => (
              <Link
                to={chatMenuOption == "invitations"?`/dashboard/invitations/${interest?.id}`:`/dashboard/chat/${interest?.id}`}
                className="flex items-center justify-center w-full"
                key={interest?.id}
              >
                <li
                  className={`flex items-center p-3 mb-2 ${
                    slug
                      ? interest?.id == slug
                        ? "bg-gray-300 text-white"
                        : "bg-gray-100"
                      : "bg-gray-100"
                  } rounded-lg shadow-sm hover:bg-gray-200 cursor-pointer transition-colors w-full`}
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold mr-3 border border-gray-500">
                    {interest?.sender?.id == user?.id
                      ? interest?.receiver?.name[0]
                      : interest?.sender?.name[0]}
                  </div>
                  <span className="text-gray-800 text-lg">
                    {interest?.sender?.id == user?.id
                      ? interest?.receiver?.name
                      : interest?.sender?.name}
                  </span>
                </li>
              </Link>
            ))}
            {interests.length === 0 && (
              <li className="flex items-center p-3 mb-2  transition-colors justify-center">
                <span className="text-gray-800 text-lg">Chats not found.</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default ChatUsers;
