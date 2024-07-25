import React from "react";
import { MdOutlineChat } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ChatMenus = () => {
  return (
    <div className="flex justify-center h-full border shadow-lg">
      <div className="flex flex-col text-2xl my-2">
        <div
          className="flex justify-center rounded-full m-2 border-2 h-12 w-12"
          title="Chats"
        >
          <div className="flex items-center justify-center">
            <Link to="/dashboard">
              <MdOutlineChat className="my-auto" />
            </Link>
          </div>
        </div>
        <div
          className="flex justify-center rounded-full m-2 border-2 h-12 w-12"
          title="Search"
        >
          <div className="flex items-center justify-center">
            <Link to="/dashboard/search">
              <IoMdSearch className="my-auto" />
            </Link>
          </div>
        </div>
        <div
          className="flex justify-center rounded-full m-2 border-2 h-12 w-12"
          title="Requests"
        >
          <div className="flex items-center justify-center">
            <Link to="/dashboard/invitations">
              <FaUserPlus className="my-auto" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMenus;
