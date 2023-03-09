import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";

import "./MoveTodoItemModal.css";

import { useStateValue } from "../../../../config/context api/StateProvider";

import {
  setTodoGroupItems,
  todosSelector,
} from "../../../../store/reducers/todos";

import TodoItemsService from "../../../../services/todoItems";

import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

import MuiModal from "../../../Atoms/MuiModal/MuiModal";
import { MuiSelect } from "../../../MuiComponents/MuiComponents";
import Button from "../../../Atoms/Button/Button";

export default function MoveTodoItemModal(props) {
  const {
    isOpen,
    handleModalToggle,
    todoItemToMove,
    restTodoItems,
    fetchTodoGroupItems,
    todoGroupKey,
    handleTodoItemExpanded,
  } = props;
  console.log(
    "%cMoveTodoItemModal props:",
    "background-color:cadetblue;",
    props
  );

  const [{ userToken }] = useStateValue();

  const dispatch = useDispatch();
  const todosStore = useSelector(todosSelector);
  const { todoGroups, todoGroupItems } = todosStore;
  const todoGroupsExceptSelected = todoGroups.filter(
    (todoGroup) => todoGroup.pk !== todoGroupKey
  );
  console.log("%ctodosStore:", "background-color:cadetblue;", todosStore);
  console.log(
    "%ctodoGroupsExceptSelected:",
    "background-color:cadetblue;",
    todoGroupsExceptSelected
  );

  const customAlert = useAlert();

  const [isTodoGroupSelectOpen, setIsTodoGroupSelectOpen] = useState(false);
  const [isPositionSelectOpen, setIsPositionSelectOpen] = useState(false);
  const [todoGroupSelectValue, setTodoGroupSelectValue] = useState(
    todoGroupsExceptSelected[0].pk
  );
  const [positionSelectValue, setPositionSelectValue] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  console.log(
    "%ctodoGroupSelectValue:",
    "background-color:cadetblue;",
    todoGroupSelectValue
  );
  console.log(
    "%cpositionSelectValue:",
    "background-color:cadetblue;",
    positionSelectValue
  );

  const openHandler = (selectType) => {
    switch (selectType) {
      case "todoGroup":
        setIsTodoGroupSelectOpen((prev) => !prev);
        break;
      case "position":
        setIsPositionSelectOpen((prev) => !prev);
        break;
      default:
        throw new Error("Invalid selectType for openHandler!");
    }
  };

  const onTodoGroupSelectItemClick = (value) => {
    setTodoGroupSelectValue(value);
    setPositionSelectValue(null);
  };

  const onPositionSelectItemClick = (value) => {
    setPositionSelectValue(value);
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

  const onMoveClick = async () => {
    if (positionSelectValue === null) {
      return alert("Please select a position to move to.");
    }

    const todoItemsOfSelectedTodoGroup = todoGroupItems[todoGroupSelectValue];
    let todoItemsOfSelectedTodoGroupToMove =
      todoItemsOfSelectedTodoGroup.filter((todoItem) => {
        return todoItem.position >= positionSelectValue;
      });

    todoItemsOfSelectedTodoGroupToMove = todoItemsOfSelectedTodoGroupToMove.map(
      (todoItem) => {
        const updateObject = {
          pk: todoItem.pk,
          headline: todoItem.headline,
          description: todoItem.description,
          duedate: todoItem.duedate,
          followup: todoItem.followup,
          position: todoItem.position + 1,
        };
        return updateTodoGroupItem(JSON.stringify(updateObject));
      }
    );

    try {
      setIsMoving(true);

      let res = await Promise.allSettled(todoItemsOfSelectedTodoGroupToMove);
      console.log(
        "%ctodoItemsOfSelectedTodoGroupToMove result:",
        "background-color:cadetblue;",
        res
      );

      const newTodoItemDataObject = {
        ug_fk: todoGroupSelectValue,
        acl: 7429,
        headline: todoItemToMove.headline,
        description: todoItemToMove.description,
        duedate: todoItemToMove.duedate,
        followup: todoItemToMove.followUp,
        status: todoItemToMove.status,
        prio: todoItemToMove.prio,
        position: positionSelectValue,
      };

      try {
        res = await TodoItemsService.createTodoItem(
          { token: userToken },
          newTodoItemDataObject
        );

        const newTodoItemPK = res.data.tdi_key;

        console.log(
          "%ccreateTodoItem res:",
          "background-color:cadetblue;",
          res
        );

        try {
          await TodoItemsService.deleteTodoItem(
            { token: userToken },
            todoItemToMove.pk
          );

          let restTodoItemsToMove = restTodoItems.map((todoItem) => {
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
            res = await Promise.allSettled(restTodoItemsToMove);
            console.log(
              "%crestTodoItemsToMove result:",
              "background-color:cadetblue;",
              res
            );

            customAlert.show("Todo Item Moved Successfully!");

            setIsMoving(false);
            handleModalToggle();

            const todoGroupItemsPromises = [
              fetchTodoGroupItems(todoGroupSelectValue, true, false),
              fetchTodoGroupItems(todoGroupKey, true, false),
            ];
            const todoGroupItemsResponse = await Promise.allSettled(
              todoGroupItemsPromises
            );

            const localTodoGroupItems = {};

            localTodoGroupItems[todoGroupSelectValue] =
              todoGroupItemsResponse[0].value[todoGroupSelectValue];
            localTodoGroupItems[todoGroupKey] =
              todoGroupItemsResponse[1].value[todoGroupKey];

            const finalTodoGroupItems = {
              ...todoGroupItems,
              ...localTodoGroupItems,
            };
            dispatch(setTodoGroupItems(finalTodoGroupItems));

            handleTodoItemExpanded(todoGroupKey, todoItemToMove.pk, "remove");
            handleTodoItemExpanded(todoGroupSelectValue, newTodoItemPK, "add");
          } catch (error) {
            setIsMoving(false);

            console.log(
              "%cdeleteTodoItem error:",
              "background-color:cadetblue;",
              error
            );
          }
        } catch (error) {
          setIsMoving(false);

          console.log(
            "%crestTodoItemsToMove error:",
            "background-color:cadetblue;",
            error
          );
        }
      } catch (error) {
        setIsMoving(false);

        console.log(
          "%ccreateTodoItem error:",
          "background-color:cadetblue;",
          error
        );
      }
    } catch (error) {
      setIsMoving(false);
    }
  };

  return (
    <MuiModal
      isModalOpen={isOpen}
      closeModalHandler={!isMoving ? () => handleModalToggle() : null}
      modalTitle="Move Todo Item"
      modalHeaderIcon={<DriveFileMoveIcon />}
      modalWidth="80%"
    >
      <div className="move-todo-item-modal">
        <p className="move-todo-item-modal__selected-todo-item">
          Selected Todo Item:{" "}
          <span className="move-todo-item-modal__selected-todo-item-name">
            {todoItemToMove.headline}
          </span>{" "}
        </p>

        <div className="move-todo-item-modal__selects">
          <div className="move-todo-item-modal__select">
            <h3 className="move-todo-item-modal__select-heading">
              Select Todo Group
            </h3>
            <MuiSelect
              label="Todo Group"
              value={todoGroupSelectValue}
              additionalSelectProps={{
                onClick: () => openHandler("todoGroup"),
                open: isTodoGroupSelectOpen,
              }}
              menuItems={[
                ...todoGroupsExceptSelected.map((todoGroup) => {
                  return {
                    value: todoGroup.pk,
                    additionalMenuItemProps: {
                      className: "move-todo-item-modal__select-item",
                      onClick: () => onTodoGroupSelectItemClick(todoGroup.pk),
                    },
                    children: <>{todoGroup.name}</>,
                  };
                }),
              ]}
            />
          </div>

          <div className="move-todo-item-modal__select">
            <h3 className="move-todo-item-modal__select-heading">
              Select Position
            </h3>
            <MuiSelect
              label="Position"
              value={positionSelectValue}
              additionalSelectProps={{
                onClick: () => openHandler("position"),
                open: isPositionSelectOpen,
              }}
              menuItems={
                todoGroupSelectValue !== ""
                  ? [
                      ...todoGroupItems[todoGroupSelectValue].map(
                        (todoItem) => {
                          return {
                            value: todoItem.position,
                            additionalMenuItemProps: {
                              className: "move-todo-item-modal__select-item",
                              onClick: () =>
                                onPositionSelectItemClick(todoItem.position),
                            },
                            children: todoItem.position,
                          };
                        }
                      ),
                      {
                        value: todoGroupItems[todoGroupSelectValue].length,
                        additionalMenuItemProps: {
                          className: "move-todo-item-modal__select-item",
                          onClick: () =>
                            onPositionSelectItemClick(
                              todoGroupItems[todoGroupSelectValue].length
                            ),
                        },
                        children: todoGroupItems[todoGroupSelectValue].length,
                      },
                    ]
                  : null
              }
            />
          </div>

          <div className="move-todo-item-modal__action-buttons">
            <Button
              text="Move"
              variant="filled"
              fontSize="medium"
              onClick={() => onMoveClick()}
              isDisabled={isMoving}
            />
            <Button
              text="Cancel"
              fontSize="medium"
              onClick={() => handleModalToggle()}
              isDisabled={isMoving}
            />
          </div>
        </div>
      </div>
    </MuiModal>
  );
}
