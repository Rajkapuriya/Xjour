import { useState } from "react";

import { useAlert } from "react-alert";

import "./DeleteTodoGroupModal.css";

import { useStateValue } from "../../../../config/context api/StateProvider";

import TodoGroupsService from "../../../../services/todoGroups";

import CircularProgress from "@mui/material/CircularProgress";

import DeleteIcon from "@mui/icons-material/Delete";

import Button from "../../../Atoms/Button/Button";
import MuiModal from "../../../Atoms/MuiModal/MuiModal";

export default function DeleteTodoGroupModal(props) {
  const { isOpen, handleModalToggle, selectedTodoGroup, fetchTodos } = props;
  console.log(
    "selectedTodoGroup inside DeleteTodoGroupModal:",
    selectedTodoGroup
  );

  const [{ userToken }] = useStateValue();

  const customAlert = useAlert();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTodoGroup = async (event) => {
    event.preventDefault();

    setIsDeleting(true);

    try {
      const response = await TodoGroupsService.deleteTodoGroup(
        { token: userToken },
        selectedTodoGroup.pk
      );

      console.log(
        "%cdeleteTodoGroup response:",
        "background-color:gold;",
        response
      );

      customAlert.show("Todo Group Deleted Successfully!");
      setIsDeleting(false);
      handleModalToggle();
      fetchTodos();
    } catch (error) {
      const errorMessage = error?.message || error;

      alert(`Some Error occurred!\n${errorMessage}`);
      setIsDeleting(false);
    }
  };

  return (
    <MuiModal
      isModalOpen={isOpen}
      closeModalHandler={!isDeleting ? () => handleModalToggle() : null}
      modalTitle="Delete Todo Group"
      modalHeaderIcon={<DeleteIcon />}
      modalWidth="80%"
    >
      <div className="delete-todo-group-modal">
        <p className="delete-todo-group-modal__confirmation-text">
          Delete this todo group? <b>({selectedTodoGroup.name})</b>
        </p>

        {isDeleting && (
          <div className="delete-todo-group-modal__loader">
            <CircularProgress />
          </div>
        )}

        <div className="delete-todo-group-modal__action-buttons">
          <Button
            text="Delete"
            variant="filled"
            fontSize="medium"
            isDisabled={isDeleting}
            onClick={(event) => handleDeleteTodoGroup(event)}
          />
          <Button
            text="Cancel"
            fontSize="medium"
            isDisabled={isDeleting}
            onClick={() => handleModalToggle()}
          />
        </div>
      </div>
    </MuiModal>
  );
}
