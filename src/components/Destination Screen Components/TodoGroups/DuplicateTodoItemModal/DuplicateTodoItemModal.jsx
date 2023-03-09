import { useState } from "react";

import "./DuplicateTodoItemModal.css";

import { useStateValue } from "../../../../config/context api/StateProvider";

import TodoItemsService from "../../../../services/todoItems";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Button from "../../../Atoms/Button/Button";
import MuiModal from "../../../Atoms/MuiModal/MuiModal";

export default function DuplicateTodoItemModal(props) {
  console.log(
    "%cDuplicateTodoItem props:",
    "background-color:limegreen;",
    props
  );
  const {
    isOpen,
    handleModalToggle,
    todoItemToDuplicate,
    restTodoItems,
    todoGroupKey,
    fetchTodoGroupItems,
  } = props;

  const [{ userToken }] = useStateValue();

  const [isSaving, setIsSaving] = useState(false);

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

  const onDuplicateClick = async () => {
    let restTodoItemsToMove = restTodoItems.map((todoItem) => {
      return {
        ...todoItem,
        position: todoItem.position + 1,
      };
    });

    restTodoItemsToMove = restTodoItemsToMove.map((todoItem) => {
      const updateObject = {
        pk: todoItem.pk,
        headline: todoItem.headline,
        description: todoItem.description,
        duedate: todoItem.duedate,
        followup: todoItem.followup,
        position: todoItem.position,
      };
      return updateTodoGroupItem(JSON.stringify(updateObject));
    });

    try {
      setIsSaving(true);

      const res = await Promise.allSettled(restTodoItemsToMove);
      console.log(
        "%crestTodoItemsToMove result:",
        "background-color:green;",
        res
      );

      try {
        const duplicateTodoItemData = {
          ug_fk: todoGroupKey,
          acl: todoItemToDuplicate.acl,
          headline: todoItemToDuplicate.headline,
          description: todoItemToDuplicate.description,
          duedate: todoItemToDuplicate.dueDate,
          followup: todoItemToDuplicate.followUp,
          status: todoItemToDuplicate.status,
          prio: todoItemToDuplicate.priority,
          position: todoItemToDuplicate.position + 1,
        };

        const response = await TodoItemsService.createTodoItem(
          { token: userToken },
          duplicateTodoItemData
        );

        console.log(
          "%cduplicateTodoItemData result:",
          "background-color:green;",
          response
        );

        handleModalToggle();
        fetchTodoGroupItems(todoGroupKey, true);
        setIsSaving(false);
      } catch (error) {
        setIsSaving(false);

        console.log(
          "%cduplicateTodoItemData error:",
          "background-color:green;",
          error
        );
      }
    } catch (error) {
      setIsSaving(false);

      console.log(
        "%crestTodoItemsToMove error:",
        "background-color:green;",
        error
      );
    }
  };

  return (
    <MuiModal
      isModalOpen={isOpen}
      closeModalHandler={!isSaving ? () => handleModalToggle() : null}
      modalTitle="Duplicate Todo Item"
      modalHeaderIcon={<ContentCopyIcon />}
      modalWidth="80%"
    >
      <div className="duplicate-todo-item-modal">
        <p className="duplicate-todo-item-modal__confirm-text">
          {`Duplicate this Todo Item?`}
          <strong> {`(${todoItemToDuplicate.headline})`}</strong>
        </p>

        <div className="duplicate-todo-item-modal__action-buttons">
          <Button
            text="Duplicate"
            variant="filled"
            isDisabled={isSaving}
            fontSize="medium"
            onClick={onDuplicateClick}
          />
          <Button
            text="Cancel"
            isDisabled={isSaving}
            fontSize="medium"
            onClick={() => handleModalToggle()}
          />
        </div>
      </div>
    </MuiModal>
  );
}
