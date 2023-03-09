import { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";

import { useAlert } from "react-alert";

import "./AddNewListItemModal.css";

import { useStateValue } from "../../../../config/context api/StateProvider";

import TodoItemsService from "../../../../services/todoItems";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import EditIcon from "@mui/icons-material/Edit";

import {
  MuiTextField,
  MuiDatePicker,
  MuiSelect,
} from "../../../MuiComponents/MuiComponents";
import MuiModal from "../../../Atoms/MuiModal/MuiModal";
import Button from "../../../Atoms/Button/Button";

export default function AddNewListItemModal(props) {
  const {
    isOpen,
    handleModalToggle,
    todoGroupKey,
    fetchTodoGroupItems,
    handleTodoItemExpanded,
    todoGroupItems,
    isTodoGroupItemsFetching,
  } = props;
  console.log("%cAddNewListItem props:", "background-color:crimson;", props);

  const [{ userToken }] = useStateValue();

  const customAlert = useAlert();

  const [formDetails, setFormDetails] = useState({
    title: "",
    description: "",
    duedate: Date.now(),
    followUp: Date.now(),
    status: 2,
    priority: 3,
    position: todoGroupItems?.length || 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  console.log("addNewListItem formDetails:", formDetails);

  useEffect(() => {
    setFormDetails((prev) => ({
      ...prev,
      position: todoGroupItems?.length || 0,
    }));
  }, [todoGroupItems]);

  const handleFormDetails = (value, key) => {
    console.log("handleFormDetails called!", key, value);

    if (["title", "description"].includes(key)) {
      const limitPerKey = {
        title: [
          50,
          () => {
            alert(
              `Max ${limitPerKey[key][0]} characters are allowed for '${key}'!`
            );
          },
        ],
        description: [
          4000,
          () => {
            alert(
              `Max ${limitPerKey[key][0]} characters are allowed for '${key}'!`
            );
          },
        ],
      };

      if (value.length > limitPerKey[key][0]) {
        limitPerKey[key][1]();
        return;
      }
    }

    setFormDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const dateChange = (newValue, formKey) => {
    setFormDetails((prev) => ({
      ...prev,
      [formKey]: new Date(newValue).getTime(),
    }));
  };

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

  const handleSaveClick = async (event) => {
    event.preventDefault();

    const {
      title,
      description,
      duedate,
      followUp,
      status,
      priority,
      position,
    } = formDetails;

    if ([Boolean(title)].includes(false)) {
      alert("Title is required to add a new list item!");
      return;
    }

    async function moveRestTodoItems() {
      let todoItemsToUpdate = todoGroupItems.slice(position);

      todoItemsToUpdate = todoItemsToUpdate.map((todoItem) => {
        const updateObject = {
          pk: todoItem.pk,
          headline: todoItem.headline,
          description: todoItem.description,
          duedate: todoItem.duedate,
          followup: todoItem.followup,
          position: todoItem.position + 1,
        };

        return updateTodoGroupItem(JSON.stringify(updateObject));
      });

      try {
        const res = await Promise.allSettled(todoItemsToUpdate);

        return res;
      } catch (error) {
        return error;
      }
    }

    async function addNewTodoItem() {
      const dataObject = {
        ug_fk: todoGroupKey,
        acl: 7429,
        headline: title,
        description: description,
        duedate: duedate,
        followup: followUp,
        status: status,
        prio: priority,
        position: position,
      };

      try {
        const res = await TodoItemsService.createTodoItem(
          { token: userToken },
          dataObject
        );

        return res;
      } catch (error) {
        return error;
      }
    }

    try {
      setIsSaving(true);

      let response;

      if (position !== todoGroupItems.length) {
        await moveRestTodoItems();
        response = await addNewTodoItem();
      } else {
        response = await addNewTodoItem();
      }

      customAlert.show("Todo Item added successfully!");

      setIsSaving(false);
      handleModalToggle();
      handleTodoItemExpanded(todoGroupKey, response.data.tdi_key, "add");
      fetchTodoGroupItems(todoGroupKey, true);
    } catch (error) {
      console.log(
        "%cmoveRestTodoItems OR addNewTodoItem error:",
        "background-color:aquamarine;",
        error
      );

      const errorMessage = error.message;
      alert(`Some error occurred!\n${errorMessage}`);

      setIsSaving(false);
    }
  };

  return (
    <MuiModal
      isModalOpen={isOpen}
      modalTitle="Create New List Item"
      modalHeaderIcon={<EditIcon />}
      closeModalHandler={!isSaving ? () => handleModalToggle() : null}
      modalHeight="90vh"
      modalWidth="80%"
    >
      <div className="add-new-list-item-modal">
        <Box
          id="add-new-list-item-modal__form"
          className="add-new-list-item-modal__form"
          component="form"
          noValidate
          autoComplete="off"
        >
          {!todoGroupItems?.length && isTodoGroupItemsFetching ? (
            <div className="add-new-list-item-modal__spinner">
              <Oval color="#00BFFF" height={60} width={60} />
              <Button
                text="Cancel"
                fontSize="medium"
                onClick={() => handleModalToggle()}
              />
            </div>
          ) : (
            <>
              <MuiTextField
                label="Title"
                value={formDetails.title}
                additionalProps={{
                  onChange: (event) =>
                    handleFormDetails(event.target.value, "title"),
                  helperText: "Max 50 characters",
                }}
              />
              <MuiTextField
                label="Description"
                value={formDetails.description}
                additionalProps={{
                  onChange: (event) =>
                    handleFormDetails(event.target.value, "description"),
                  helperText: "Max 4000 characters",
                  multiline: true,
                  rows: 4,
                }}
              />

              <div className="add-new-list-item-modal__input-dates">
                <MuiDatePicker
                  label="Due Date"
                  value={formDetails.duedate}
                  additionalDatePickerProps={{
                    onChange: (date) => dateChange(date, "duedate"),
                  }}
                />
                <MuiDatePicker
                  label="Follow Up"
                  value={formDetails.followUp}
                  additionalDatePickerProps={{
                    onChange: (date) => dateChange(date, "followUp"),
                  }}
                />
              </div>

              <div className="add-new-list-item-modal__input-status">
                <MuiSelect
                  label="Status"
                  value={formDetails.status}
                  additionalSelectProps={{
                    onChange: (event) =>
                      handleFormDetails(event.target.value, "status"),
                  }}
                  menuItems={[1, 2, 3, 4, 5].map((value) => ({
                    value,
                    children: `${value}`,
                  }))}
                />
              </div>
              <div className="add-new-list-item-modal__input-priority">
                <MuiSelect
                  label="Priority"
                  value={formDetails.priority}
                  additionalSelectProps={{
                    onChange: (event) =>
                      handleFormDetails(event.target.value, "priority"),
                  }}
                  menuItems={[1, 2, 3, 4, 5].map((value) => ({
                    value,
                    children: `${value}`,
                  }))}
                />
              </div>
              <div className="add-new-list-item-modal__input-position">
                <MuiSelect
                  label="Position"
                  value={formDetails.position}
                  additionalSelectProps={{
                    onChange: (event) =>
                      handleFormDetails(event.target.value, "position"),
                  }}
                  menuItems={[
                    ...todoGroupItems,
                    {
                      value: todoGroupItems.length,
                      text: `${todoGroupItems.length}`,
                    },
                  ].map((todoGroupItem, index) => ({
                    id: todoGroupItem.pk,
                    value: index,
                    children: `${index}`,
                  }))}
                />
              </div>

              {isSaving && (
                <div className="add-new-list-item-modal__loader">
                  <CircularProgress />
                </div>
              )}

              <div className="add-new-list-item-modal__action-buttons">
                <Button
                  text="Save"
                  variant="filled"
                  fontSize="medium"
                  onClick={(event) => handleSaveClick(event)}
                  isDisabled={isSaving}
                />
                <Button
                  text="Cancel"
                  fontSize="medium"
                  onClick={() => handleModalToggle()}
                  isDisabled={isSaving}
                />
              </div>
            </>
          )}
        </Box>
      </div>
    </MuiModal>
  );
}
