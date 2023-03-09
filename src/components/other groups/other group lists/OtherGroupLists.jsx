import { Edit } from "@mui/icons-material";

import "./OtherGroupLists.css";

import { Avatar } from "@mui/material";

function OtherGroupLists({ index, data, getValue }) {
  return (
    <div className="other-group-lists">
      <div
        className="other-group-lists__container"
        onClick={() => getValue(data, index)}
      >
        <div className="other-group-lists__avatar">
          {!data.base64 ? (
            <div className="avatar__loader">
              <Avatar />
            </div>
          ) : (
            <img
              className="other-group-lists__avatarUser"
              src={data.base64}
              alt=""
            />
          )}
        </div>

        <div className="other-group-lists_text">
          <p>{data.name}</p>
        </div>

        <div className="other-group-lists__flag">
          {!data.countrySvg ? (
            <div className="other-groups-lists__flag-placeholder"></div>
          ) : (
            <img
              className="other-group-lists__flagUser"
              src={data.countrySvg}
              alt=""
            />
          )}
        </div>

        <div className="groupLists__edit">
          <Edit />
        </div>
      </div>
    </div>
  );
}

export default OtherGroupLists;
