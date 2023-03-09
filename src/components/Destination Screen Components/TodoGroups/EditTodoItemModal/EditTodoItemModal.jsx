import { useMemo, useState } from "react";

import { useAlert } from "react-alert";

import "./EditTodoItemModal.css";

import { useStateValue } from "../../../../config/context api/StateProvider";

import TodoItemsService from "../../../../services/todoItems";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import EditIcon from "@mui/icons-material/Edit";

import { MuiTextField } from "../../../MuiComponents/MuiComponents";
import Button from "../../../Atoms/Button/Button";
import MuiModal from "../../../Atoms/MuiModal/MuiModal";

export default function EditTodoItemModal(props) {
  const {
    isOpen,
    handleModalToggle,
    modalTitle,
    todoGroupKey,
    todoItem,
    mode,
    fetchTodoGroupItems,
  } = props;

  const [{ userToken }] = useStateValue();

  const customAlert = useAlert();

  const [isSaving, setIsSaving] = useState(false);

  const renderEditMode = useMemo(() => {
    const EditHeading = () => {
      const [headline, setHeadline] = useState(todoItem.headline);
      const [description, setDescription] = useState(todoItem.description);

      const handleHeadlineChange = (value) => {
        if (value.length > 50) {
          return;
        }
        setHeadline(value);
      };

      const handleDescriptionChange = (value) => {
        if (value.length > 4000) {
          return;
        }
        setDescription(value);
      };

      const handleSaveClick = async (event) => {
        event.preventDefault();

        const updateObject = {
          pk: todoItem.pk,
          headline,
          description,
          duedate: todoItem.duedate,
          followup: todoItem.followup,
        };

        const prevObject = {
          pk: todoItem.pk,
          headline: todoItem.headline,
          description: todoItem.description,
          duedate: todoItem.duedate,
          followup: todoItem.followup,
        };

        if (JSON.stringify(updateObject) === JSON.stringify(prevObject)) {
          return alert("No changes made to save!");
        }

        setIsSaving(true);

        try {
          await TodoItemsService.updateTodoItem(
            { token: userToken },
            JSON.stringify(updateObject)
          );

          customAlert.show("Todo Item updated successfully!");

          setIsSaving(false);
          handleModalToggle();
          fetchTodoGroupItems(todoGroupKey, true);
        } catch (error) {
          const errorMessage = error.message;
          alert(`Some error occurred!\n${errorMessage}`);

          setIsSaving(false);
        }
      };

      return (
        <Box
          id="edit-todo-item-modal__form"
          className="edit-todo-item-modal__form"
          component="form"
          noValidate
          autoComplete="off"
        >
          <MuiTextField
            label="Title"
            value={headline}
            additionalProps={{
              onChange: (event) => handleHeadlineChange(event.target.value),
              helperText: "Max 50 characters",
            }}
          />
          <MuiTextField
            label="Description"
            value={description}
            additionalProps={{
              onChange: (event) => handleDescriptionChange(event.target.value),
              helperText: "Max 4000 characters",
              rows: 4,
              multiline: true,
            }}
          />

          {isSaving && (
            <div className="edit-todo-item-modal__loader">
              <CircularProgress />
            </div>
          )}

          <div className="edit-todo-item-modal__action-buttons">
            <Button
              text="Save"
              variant="filled"
              fontSize="medium"
              isDisabled={isSaving}
              onClick={(event) => handleSaveClick(event)}
            />
            <Button
              text="Cancel"
              fontSize="medium"
              onClick={() => handleModalToggle()}
              isDisabled={isSaving}
            />
          </div>
        </Box>
      );
    };

    const editModes = {
      heading: <EditHeading />,
    };

    return editModes[mode];
  }, [
    mode,
    todoItem.headline,
    todoItem.description,
    todoItem.pk,
    todoItem.duedate,
    todoItem.followup,
    isSaving,
    userToken,
    customAlert,
    handleModalToggle,
    fetchTodoGroupItems,
    todoGroupKey,
  ]);

  return (
    <MuiModal
      isModalOpen={isOpen}
      closeModalHandler={!isSaving ? () => handleModalToggle() : null}
      modalTitle={modalTitle}
      modalHeaderIcon={<EditIcon />}
      modalWidth="auto"
    >
      <div className="edit-todo-item-modal">{renderEditMode}</div>
    </MuiModal>
  );
}
