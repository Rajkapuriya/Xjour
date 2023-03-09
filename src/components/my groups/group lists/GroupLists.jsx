import "./GroupLists.css";

import { Avatar } from "@mui/material";

import { Edit } from "@mui/icons-material";

function GroupLists({ data, index, getGroupData }) {
  return (
    <div
      className="groupLists__conatiner"
      onClick={() => getGroupData(data, index)}
    >
      <div className="groupLists__avatar">
        {!data.base64 ? (
          <div className="avatar__loader">
            <Avatar />
          </div>
        ) : (
          <img className="groupLists__avatarUser" src={data.base64} alt="" />
        )}
      </div>

      <div className="groupLists__text">
        <p>{data.name}</p>
      </div>

      <div className="groupLists__flag">
        {!data.countrySvg ? (
          <div className="group-lists__flag-placeholder"></div>
        ) : (
          <img className="groupLists__flagUser" src={data.countrySvg} alt="" />
        )}
      </div>

      <div className="groupLists__edit">
        <Edit />
      </div>
    </div>
  );
}

export default GroupLists;
