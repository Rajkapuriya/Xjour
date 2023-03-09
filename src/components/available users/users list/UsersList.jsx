import { useEffect, useState } from "react";
import { Shimmer } from "react-shimmer";

import "./UsersList.css";

import { Avatar } from "@mui/material";

import InfiniteScroll from "react-infinite-scroll-component";

function UsersList() {
  const [connections, setConnections] = useState([
    {
      firstName: "John",
      lastName: "Doe",
    },
    {
      firstName: "Jane",
      lastName: "Doe",
    },
    {
      firstName: "James",
      lastName: "Bond",
    },
    {
      firstName: "James",
      lastName: "Bond",
    },
    {
      firstName: "James",
      lastName: "Bond",
    },
    {
      firstName: "James",
      lastName: "Bond",
    },
    {
      firstName: "James",
      lastName: "Bond",
    },
    {
      firstName: "James",
      lastName: "Bond",
    },
    {
      firstName: "James",
      lastName: "Bond",
    },
  ]);

  const onUsersListScroll = (event) => {};

  return (
    <div className="users-list">
      {connections?.length <= 0 ? (
        <div className="recentDestinations__empty">
          <h5>No Connections</h5>
        </div>
      ) : (
        <div className="users-list__scroll-container">
          <InfiniteScroll
            dataLength={connections.length}
            hasMore={false}
            loader={
              <div className="users-list__scroll-more-loader-container">
                <Shimmer
                  width={220}
                  height={50}
                  className="users-list__shimmer"
                />
              </div>
            }
            height={"37vh"}
            onScroll={onUsersListScroll}
            scrollableTarget="users-list__scroll-container"
            className="users-list__infinite-scroll"
          >
            {[...connections].reverse().map((v, i) => (
              <div className="users-list__container" key={i}>
                <div className="users-list__avatar">
                  {!v.base64 ? (
                    <div className="">
                      {/* <Oval color="#00BFFF" height={40} width={40} /> */}
                      <Avatar className="users-list__avatarUser" />
                    </div>
                  ) : (
                    <Avatar
                      className="users-list__avatarUser"
                      src={v.base64}
                      alt={v.base64}
                    />
                  )}
                </div>
                <div className="users-list_text">
                  <p>{`${v.firstName} ${v.lastName}`}</p>
                </div>
                <div className="users-list__flag">
                  {!v.countrySvg ? (
                    <div className="users-list__flag-placeholder"></div>
                  ) : (
                    <img
                      className="users-list__flagUser"
                      src={v.countrySvg}
                      alt=""
                    />
                  )}
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}

export default UsersList;
