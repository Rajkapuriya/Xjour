import { useState } from "react";

import { useAlert } from "react-alert";

import "./DeleteTodoItemModal.css";

import { useStateValue } from "../../../../config/context api/StateProvider";

import TodoItemsService from "../../../../services/todoItems";

import CircularProgress from "@mui/material/CircularProgress";

import DeleteIcon from "@mui/icons-material/Delete";

import Button from "../../../Atoms/Button/Button";
import MuiModal from "../../../Atoms/MuiModal/MuiModal";

export default function DeleteTodoItemModal(props) {
  const {
    isOpen,
    handleModalToggle,
    todoItemToDelete,
    fetchTodoGroupItems,
    todoGroupKey,
    handleTodoItemExpanded,
    restTodoItems,
  } = props;
  console.log("%cdeleteTodoItem props:", "background-color:aquamarine;", props);

  const [{ userToken }] = useStateValue();

  const customAlert = useAlert();

  const [isDeleting, setIsDeleting] = useState(false);

  async function updateTodoGroupItem(data) {
    try {
      const response = await TodoItemsService.updateTodoItem(
        { token: userToken },
        data
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  const handleDeleteTodoItem = async (event) => {
    event.preventDefault();

    setIsDeleting(true);

    try {
      await TodoItemsService.deleteTodoItem(
        { token: userToken },
        todoItemToDelete.pk
      );

      const restTodoItemsToMove = restTodoItems.map((todoItem) => {
        const updateObject = {
          pk: todoItem.pk,
          headline: todoItem.headline,
          description: todoItem.description,
          duedate: todoItem.duedate,
          followup: todoItem.followup,
          position: todoItem.position - 1,
        };
        return updateTodoGroupItem(JSON.stringify(updateObject));
      });

      try {
        const res = await Promise.allSettled(restTodoItemsToMove);
        console.log(
          "%crestTodoItemsToMove result:",
          "background-color:aquamarine;",
          res
        );

        customAlert.show("Todo Item Deleted Successfully!");

        setIsDeleting(false);
        handleModalToggle();
        handleTodoItemExpanded(todoGroupKey, todoItemToDelete.pk, "remove");
        fetchTodoGroupItems(todoGroupKey, true);
      } catch (error) {
        console.log(
          "%crestTodoItemsToMove error:",
          "background-color:aquamarine;",
          error
        );

        const errorMessage = error.message;

        alert(`Some Error occurred!\n${errorMessage}`);
        setIsDeleting(false);
      }
    } catch (error) {
      console.log(
        "%cdeleteTodoItem error:",
        "background-color:aquamarine;",
        error
      );

      const errorMessage = error.message;

      alert(`Some Error occurred!\n${errorMessage}`);
      setIsDeleting(false);
    }
  };

  return (
    <MuiModal
      isModalOpen={isOpen}
      closeModalHandler={!isDeleting ? () => handleModalToggle() : null}
      modalTitle="Delete Todo Item"
      modalHeaderIcon={<DeleteIcon />}
      modalWidth="80%"
    >
      <div className="delete-todo-item-modal">
        <p className="delete-todo-item-modal__confirmation-text">
          Delete this todo item? <b>({todoItemToDelete.headline})</b>
        </p>

        {isDeleting && (
          <div className="delete-todo-item-modal__loader">
            <CircularProgress />
          </div>
        )}

        <div className="delete-todo-item-modal__action-buttons">
          <Button
            text="Delete"
            variant="filled"
            fontSize="medium"
            isDisabled={isDeleting}
            onClick={(event) => handleDeleteTodoItem(event)}
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
