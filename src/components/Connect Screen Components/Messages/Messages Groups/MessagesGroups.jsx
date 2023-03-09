import React from "react";
import GroupMessageBar from "./Group Message Card/GroupMessageBar";
import "./MessagesGroups.css";

function MessagesGroups({
  userImageDetails,
  userGroupDetails,
  contentWrapper,
}) {
  // console.log("userImageDetails", userImageDetails);
  const data = [
    {
      id: "01",
      groupImage: userGroupDetails.base64,
      groupTitle: "The best Hiking Group in the world",
      groupSlogan:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus sit sequi nam aliquam eum nostrum vel molestias maxime officiis laboriosam corrupti deserunt illum recusandae.",
    },
    {
      id: "02",
      groupImage: userGroupDetails.base64,
      groupTitle: "Whiskey Conneseurs",
      groupSlogan:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus sit sequi nam aliquam eum nostrum vel molestias.",
    },
  ];

  return (
    <div className="messagesGroups" ref={contentWrapper}>
      <div className="messagesGroups__cards">
        {data.map((v, i) => (
          <GroupMessageBar
            key={v + i}
            groupTitle={v.groupTitle}
            groupImage={v.groupImage}
            groupSlogan={v.groupSlogan}
            userImageDetails={userImageDetails}
          />
        ))}
      </div>
    </div>
  );
}

export default MessagesGroups;
