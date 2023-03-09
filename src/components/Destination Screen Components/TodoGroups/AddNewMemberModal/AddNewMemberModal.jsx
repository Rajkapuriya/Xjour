import { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";

import "./AddNewMemberModal.css";

import { useStateValue } from "../../../../config/context api/StateProvider";

import MuiModal from "../../../Atoms/MuiModal/MuiModal";
import Button from "../../../Atoms/Button/Button";

import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { Avatar } from "@mui/material";

export default function AddNewMemberModal(props) {
  const { isOpen, handleModalToggle } = props;

  const [{ reducerMyConnectionPeople }] = useStateValue();

  const [addedMembers, setAddedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState([]);

  console.log(
    "%creducerMyConnectionPeople inside AddNewMemberModal:",
    "background-color:rosybrown;",
    reducerMyConnectionPeople
  );
  console.log("selectedMembers:", selectedMembers);

  useEffect(() => {
    if (reducerMyConnectionPeople.length > 0) {
      setIsLoading(false);
    }
  }, [reducerMyConnectionPeople.length]);

  const handleAvailableMemberClick = (member) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers((prev) => {
        return prev.filter((prevMember) => prevMember !== member);
      });
    } else {
      setSelectedMembers((prev) => {
        return [...prev, member];
      });
    }
  };

  const AvailableMembers = () => {
    return (
      <section className="add-new-member-modal__members">
        <div className="add-new-member-modal__members-heading">
          <h3>Members Available</h3>
        </div>

        <div className="add-new-member-modal__members-list">
          {reducerMyConnectionPeople?.map((member) => {
            return (
              <div
                className={`add-new-member-modal__member ${
                  selectedMembers.includes(member)
                    ? "add-new-member-modal__member--selected"
                    : ""
                }`}
                onClick={() => handleAvailableMemberClick(member)}
              >
                {!member.base64 ? (
                  <Oval color="#00BFFF" height={40} width={40} />
                ) : (
                  <Avatar
                    className="add-new-member-modal__member-avatar"
                    src={member.base64}
                    alt={member.base64}
                  />
                )}

                <p className="add-new-member-modal__member-name">{`${member.firstName} ${member.lastName}`}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const ActionButtons = () => {
    return (
      <section className="add-new-member-modal__action-buttons">
        <Button
          text="Cancel"
          fontSize="medium"
          onClick={() => handleModalToggle()}
        />
      </section>
    );
  };

  return (
    <MuiModal
      isModalOpen={isOpen}
      closeModalHandler={() => handleModalToggle()}
      modalTitle="Add new member"
      modalHeaderIcon={<AddCircleOutlinedIcon />}
      modalHeight="90vh"
      modalWidth="80%"
    >
      <div className="add-new-member-modal">
        {isLoading && <Oval color="#00BFFF" />}

        <AvailableMembers />

        <ActionButtons />
      </div>
    </MuiModal>
  );
}
