import React, { useEffect, useState } from "react";
import "./GroupMemberSection.css";
import { Search } from "@mui/icons-material";
import { useStateValue } from "../../../config/context api/StateProvider";
import PeopleCards from "../../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import { deleteMetaGroupItemAPI } from "../../../config/authentication/AuthenticationApi";
import { useAlert } from "react-alert";
import { UNAUTH_KEY } from "../../../assets/constants/Contants";

function GroupMemberSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [{ userToken, reducerGroupPeople, reducerVisitorID }, dispatch] =
    useStateValue();
  const [groupMembers, setGroupMembers] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();

  const deleteCardItem = (v, index) => {
    // console.log("connectionPeople", v, index);
    deleteMetaGroupItemAPI(userToken, v.groupItemsKey, reducerVisitorID).then(
      function (val) {
        if (val) {
          setIsLoading(true);
          // console.log("delete API response >>", val.data);
          setIsLoading(false);
          if (val.data.rows === "1") {
            alert.show("Activity Deleted Successfully");
          } else {
            // alert.show("Some Error Occured");
          }

          groupMembers.splice(index, 1);
          setGroupMembers([...groupMembers]);
          // console.log("newMemoryImages", groupMembers);
          dispatch({
            type: "SET_GROUP_PEOPLE",
            reducerGroupPeople: groupMembers,
          });
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
      }
    );
  };

  // reducerGroupPeople
  useEffect(() => {
    // console.log("UseEffect GroupMemberSection:", reducerGroupPeople);
    if (typeof reducerGroupPeople === "undefined") {
      // console.log("You have no Members added!!");
      setIsEmpty(true);
    } else {
      if (reducerGroupPeople.length === 0) {
        // console.log("You have no Members Added!!");
        setIsEmpty(true);
      } else {
        setGroupMembers(reducerGroupPeople);
        setIsEmpty(false);
      }
    }
    // console.log("isEmpty:", isEmpty);
  }, [reducerGroupPeople]);

  return (
    <div className="groupMemberSection">
      <div className="peopleSection__head">
        <div className="peopleSection__search">
          <p>Search Hometown</p>
          <div className="inputDiv">
            <input
              placeholder="Berlin, Germany"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search />
          </div>
        </div>
      </div>

      <div className="peopleSection__cards">
        {isEmpty ? (
          <div className="noImagesText">
            <h3>You have no Members added </h3>
          </div>
        ) : (
          <>
            {groupMembers
              ?.filter((val) => {
                if (searchTerm === "") {
                  // console.log("value", val);
                  return val;
                } else if (
                  val.firstName
                    ?.toLowerCase()
                    .includes(searchTerm?.toLowerCase())
                ) {
                  return val;
                  // console.log("val", val);
                } else if (
                  val.lastName
                    ?.toLowerCase()
                    .includes(searchTerm?.toLowerCase())
                ) {
                  return val;
                  // console.log("val", val);
                }
              })
              .map((v, i) => (
                <PeopleCards
                  key={v + i}
                  index={i}
                  data={v}
                  // deleteItem={deleteCardItem}
                  deleteItem
                  clickFunction={deleteCardItem}
                />
                // <GroupMembersCard
                //   title={v.name}
                //   flag={v.flag}
                //   image={v.image}
                // />
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default GroupMemberSection;
