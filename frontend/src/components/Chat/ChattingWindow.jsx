import React from "react";
import ChatMenus from "./ChatMenus";
import ChatUsers from "./ChatUsers";
import ChattingContainer from "./ChattingContainer";
import { useParams } from "react-router-dom";
import DefaultPageContainer from "./DefaultPageContainer";
import SearchPageContainer from "./SearchPageContainer";
import RequestChattingContainer from "./RequestChattingContainer";
import InvitationsChattingContainer from "./InvitationsChattingContainer";

const ChattingWindow = () => {
  const { chatMenuOption } = useParams();
  let ActiveComponents;
  switch (chatMenuOption) {
    case "search":
      ActiveComponents = SearchPageContainer;
      break;
    case "chat":
      ActiveComponents = ChattingContainer;
      break;
    case "invite":
      ActiveComponents = RequestChattingContainer;
      break;
    case "invitations":
      ActiveComponents = InvitationsChattingContainer;
      break;
    default:
      ActiveComponents = DefaultPageContainer;
      break;
  }
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "4% 25% auto" }}
      className="mx-10 h-full"
    >
      {/* First column */}
      <div className="">
        <ChatMenus />
      </div>

      {/* Second column */}
      <div>
        <ChatUsers />
      </div>

      {/* Third column */}
      <div className="border">
        {/* Content for the third column */}
        <div className="flex flex-col h-full w-full mx-auto border shadow-lg bg-gray-100">
          <ActiveComponents />
        </div>
      </div>
    </div>
  );
};

export default ChattingWindow;
