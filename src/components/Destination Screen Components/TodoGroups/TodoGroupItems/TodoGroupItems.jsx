import { useCallback, useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { cloneDeep } from "lodash";

import { useStateValue } from "../../../../config/context api/StateProvider";

import TodoItemsService from "../../../../services/todoItems";

import { setSingleTodoGroupItemsExpanded } from "../../../../store/reducers/todos";

import "./TodoGroupItems.css";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

import Dropdown from "../../../Atoms/Dropdown/Dropdown";

import Overlay from "../../../extras/Overlay/Overlay";

import { MuiAccordion } from "../../../MuiComponents/MuiComponents";
import DeleteTodoItemModal from "../DeleteTodoItemModal/DeleteTodoItemModal";
import EditTodoItemModal from "../EditTodoItemModal/EditTodoItemModal";
import DuplicateTodoItemModal from "../DuplicateTodoItemModal/DuplicateTodoItemModal";
import TodoItemAccessModal from "../TodoItemAccessModal/TodoItemAccessModal";
import MoveTodoItemModal from "../MoveTodoItemModal/MoveTodoItemModal";

export default function TodoGroupItems(props) {
  console.log(
    "%ctodoGroupItems props:",
    "background-color:darkgoldenrod;",
    props
  );
  const {
    fetchTodoGroupItems,
    todoGroup,
    todoGroupItems = [],
    todoGroupItemsExpanded,
    tooltipStyles,
    todoGroupItemsDraggable,
  } = props;
console.log("Printing todoGroupItemsExpanded",todoGroupItemsExpanded);
debugger;
  const dispatch = useDispatch();

  const [{ userToken }] = useStateValue();

  const [finalTodoGroupItems, setFinalTodoGroupItems] = useState([]);
  const [isTodoGroupItemPositionUpdating, setIsTodoGroupItemPositionUpdating] =
    useState(false);
  const [selectedTodoItem, setSelectedTodoItem] = useState(null);
  const [modals, setModals] = useState({
    isDeleteTodoItemModalOpen: false,
    isUpdateTodoItemModalOpen: false,
    isDuplicateTodoItemModalOpen: false,
    isTodoItemAccessModalOpen: false,
    isMoveTodoItemModalOpen: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  console.log(
    "%cfinalTodoGroupItems:",
    "background-color:fuchsia;",
    finalTodoGroupItems
  );

  const dropdownItemTypeToModalTypeMap = useMemo(() => {
    return {
      deleteTodoItem: "isDeleteTodoItemModalOpen",
      update: "isUpdateTodoItemModalOpen",
      duplicate: "isDuplicateTodoItemModalOpen",
      access: "isTodoItemAccessModalOpen",
      move: "isMoveTodoItemModalOpen",
    };
  }, []);

  useEffect(() => {
    console.log(
      "%ctodoGroupItems effect:",
      "background-color:red;",
      todoGroupItems
    );
    const finalTodoGroupItems = todoGroupItems.map((item) => {
      return {
        ...item,
        id: `todoItem-${item.pk}`,
      };
    });
    setFinalTodoGroupItems(finalTodoGroupItems);
  }, [todoGroupItems, todoGroupItems.length]);

  const handleModalToggle = useCallback(
    (type) => {
      const modalType = dropdownItemTypeToModalTypeMap[type];

      if (!modalType) {
        return;
      }

      setModals((prev) => ({
        ...prev,
        [modalType]: !prev[modalType],
      }));
    },
    [dropdownItemTypeToModalTypeMap]
  );

  async function updateTodoGroupItem(data) {
    try {
      const response = await TodoItemsService.updateTodoItem(
        { token: userToken },
        data
      );

      console.log("updateTodoGroupItem response:", response);

      return response;
    } catch (error) {
      return error;
    }
  }

  const onDragEnd = async (result, todoGroupItems, todoGroupKey) => {
    console.log(
      "%conDragEnd result:",
      "background-color:darkseagreen;",
      result,
      "todoGroupItems:",
      todoGroupItems
    );
    const {
      destination: { index: destinationIndex },
      source: { index: sourceIndex },
    } = result;

    if (sourceIndex === destinationIndex) {
      return;
    }

    let restTodoGroupItemsToMove;
    restTodoGroupItemsToMove =
      sourceIndex > destinationIndex
        ? todoGroupItems.slice(destinationIndex, sourceIndex)
        : todoGroupItems.slice(sourceIndex + 1, destinationIndex + 1);

    restTodoGroupItemsToMove = restTodoGroupItemsToMove.map((todoItem) => ({
      ...todoItem,
      position:
        sourceIndex > destinationIndex
          ? todoItem.position + 1
          : todoItem.position - 1,
    }));

    const todoGroupItemsToUpdate = restTodoGroupItemsToMove.map(
      (todoGroupItem) => {
        const updateObject = {
          pk: todoGroupItem.pk,
          headline: todoGroupItem.headline,
          description: todoGroupItem.description,
          duedate: todoGroupItem.duedate,
          followup: todoGroupItem.followup,
          position: todoGroupItem.position,
        };
        return updateTodoGroupItem(JSON.stringify(updateObject));
      }
    );

    const res = await Promise.allSettled(todoGroupItemsToUpdate);
    console.log(
      "%cslicedTodoGroupItems result:",
      "background-color:green;",
      res
    );

    const draggedTodoGroupItemToMove = { ...todoGroupItems[sourceIndex] };
    draggedTodoGroupItemToMove.position = destinationIndex;

    const updateObject = {
      pk: draggedTodoGroupItemToMove.pk,
      headline: draggedTodoGroupItemToMove.headline,
      description: draggedTodoGroupItemToMove.description,
      duedate: draggedTodoGroupItemToMove.duedate,
      followup: draggedTodoGroupItemToMove.followup,
      position: draggedTodoGroupItemToMove.position,
    };

    try {
      const res1 = await updateTodoGroupItem(updateObject);
      console.log(
        "%ctodoGroupItem move result:",
        "background-color:green;",
        res1
      );
    } catch (error) {
      console.log(
        "%ctodoGroupItem move error:",
        "background-color:green;",
        error
      );
    }

    fetchTodoGroupItems(todoGroupKey, true);
    setIsTodoGroupItemPositionUpdating(false);
  };

  const handleTodoItemExpansion = (todoGroupKey, todoItemKey) => {
    const newTodoGroupItemsExpanded = {
      [todoGroupKey]: {
        ...todoGroupItemsExpanded,
        [todoItemKey]: !todoGroupItemsExpanded[todoItemKey],
      },
    };

    dispatch(setSingleTodoGroupItemsExpanded(newTodoGroupItemsExpanded));
  };

  const handleTodoItemExpanded = useCallback(
    (todoGroupKey, todoItemKey, action) => {
      let newTodoGroupItemsExpanded = cloneDeep(todoGroupItemsExpanded);
      let finalObj;

      switch (action) {
        case "remove":
          delete newTodoGroupItemsExpanded[todoItemKey];
          finalObj = {
            [todoGroupKey]: {
              ...newTodoGroupItemsExpanded,
            },
          };

          dispatch(setSingleTodoGroupItemsExpanded(finalObj));

          break;
        case "add":
          newTodoGroupItemsExpanded[todoItemKey] = false;
          finalObj = {
            [todoGroupKey]: {
              ...newTodoGroupItemsExpanded,
            },
          };

          dispatch(setSingleTodoGroupItemsExpanded(finalObj));

          break;
        default:
          return;
      }
    },
    [dispatch, todoGroupItemsExpanded]
  );

  const handleRemoveTodoItem = (todoGroupKey, todoItemIndex) => {
    setSelectedTodoItem(finalTodoGroupItems[todoItemIndex]);

    handleModalToggle("deleteTodoItem");
  };

  const renderModal = useMemo(() => {
    let modalKey;
    for (const [key, value] of Object.entries(modals)) {
      if (value === true) {
        modalKey = key;
        debugger;
      }
    }

    const modalToReturn = {
      isDeleteTodoItemModalOpen: (
        <DeleteTodoItemModal
          isOpen={modals.isDeleteTodoItemModalOpen}
          handleModalToggle={() => handleModalToggle("deleteTodoItem")}
          todoGroupKey={todoGroup.pk}
          fetchTodoGroupItems={fetchTodoGroupItems}
          handleTodoItemExpanded={handleTodoItemExpanded}
          todoItemToDelete={selectedTodoItem}
          restTodoItems={(function () {
            const positionOfSelectedTodoItem = selectedTodoItem?.position;

            return finalTodoGroupItems.filter(
              (todoItem) => todoItem.position > positionOfSelectedTodoItem
            );
          })()}
        />
      ),
      isUpdateTodoItemModalOpen: (
        <EditTodoItemModal
          modalTitle="Update Todo Item"
          isOpen={modals.isUpdateTodoItemModalOpen}
          handleModalToggle={() => handleModalToggle("update")}
          mode="heading"
          fetchTodoGroupItems={fetchTodoGroupItems}
          todoGroupKey={todoGroup.pk}
          todoItem={selectedTodoItem}
        />
      ),
      isDuplicateTodoItemModalOpen: (
        <DuplicateTodoItemModal
          isOpen={modals.isDuplicateTodoItemModalOpen}
          handleModalToggle={() => handleModalToggle("duplicate")}
          fetchTodoGroupItems={fetchTodoGroupItems}
          todoGroupKey={todoGroup.pk}
          todoItemToDuplicate={selectedTodoItem}
          restTodoItems={(function () {
            const positionOfSelectedTodoItem = selectedTodoItem?.position;

            return finalTodoGroupItems.filter(
              (todoItem) => todoItem.position > positionOfSelectedTodoItem
            );
          })()}
        />
      ),
      isTodoItemAccessModalOpen: (
        <TodoItemAccessModal
          isOpen={modals.isTodoItemAccessModalOpen}
          handleModalToggle={() => handleModalToggle("access")}
          fetchTodoGroupItems={fetchTodoGroupItems}
          todoItem={selectedTodoItem}
          todoGroupKey={todoGroup.pk}
        />
      ),
      isMoveTodoItemModalOpen: (
        <MoveTodoItemModal
          isOpen={modals.isMoveTodoItemModalOpen}
          handleModalToggle={() => handleModalToggle("move")}
          fetchTodoGroupItems={fetchTodoGroupItems}
          todoItemToMove={selectedTodoItem}
          restTodoItems={(function () {
            const positionOfSelectedTodoItem = selectedTodoItem?.position;

            return finalTodoGroupItems.filter(
              (todoItem) => todoItem.position > positionOfSelectedTodoItem
            );
          })()}
          todoGroupKey={todoGroup.pk}
          handleTodoItemExpanded={handleTodoItemExpanded}
        />
      ),
    };

    return modalToReturn[modalKey];
  }, [
    modals,
    todoGroup.pk,
    selectedTodoItem,
    fetchTodoGroupItems,
    handleTodoItemExpanded,
    handleModalToggle,
    finalTodoGroupItems,
  ]);

  const handleTodoItemEllipsisClick = (event, todoItem) => {
    setAnchorEl(event.target);
    setSelectedTodoItem(todoItem);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const onDropdownItemClick = (event, item, index) => {
    const itemType = item.name.toLowerCase();

    handleModalToggle(itemType);

    setAnchorEl(null);
  };

  return (
    <div className="todo-group-items">
      {isTodoGroupItemPositionUpdating && <Overlay />}

      {renderModal}

      {!todoGroupItemsDraggable && (
        <div className="todo-group-items__list">
          {finalTodoGroupItems.map((todoItem, todoItemIndex) => {
            return (
              <MuiAccordion
                expanded={todoGroupItemsExpanded[todoItem.pk]}
                accordionHeading={todoItem.headline}
                headerRemoveIcon={true}
                handlers={{
                  handleAccordionExpansion: () =>
                    handleTodoItemExpansion(todoGroup.pk, todoItem.pk),
                  handleHeaderRemoveIconClick: () =>
                    handleRemoveTodoItem(todoGroup.pk, todoItemIndex),
                }}
                additionalAccordionProps={{
                  className: "todo-group-items__todo-item",
                }}
                additionalAccordionSummaryProps={{
                  className: "todo-group-items__todo-item-header",
                }}
                additionalExpandIconProps={{
                  className: "todo-group-items__todo-item-expand-icon",
                }}
                additionalMoreVertIconProps={{
                  className: "todo-group-items__todo-item-ellipsis",
                  onClick: (event) =>
                    handleTodoItemEllipsisClick(event, todoItem),
                }}
                additionalAccordionHeadingProps={{
                  className: "todo-group-items__todo-item-heading",
                }}
                additionalAccordionRemoveIconProps={{
                  className: "todo-group-items__todo-item-remove-icon",
                }}
                accordionDetails={
                  <>
                    <Typography className="todo-group-items__todo-item-description">
                      {todoItem.description}
                    </Typography>
                  </>
                }
              />
            );
          })}
        </div>
      )}

      {todoGroupItemsDraggable && (
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(result, todoGroupItems, todoGroup.pk)
          }
        >
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: "grid",
                  rowGap: "12px",
                  width: "100%",
                }}
              >
                {finalTodoGroupItems.map((todoItem, todoItemIndex) => {
                  return (
                    <>
                      <Draggable
                        key={todoItem.id}
                        draggableId={todoItem.id}
                        index={todoItemIndex}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <MuiAccordion
                              expanded={todoGroupItemsExpanded[todoItem.pk]}
                              accordionHeading={todoItem.headline}
                              headerRemoveIcon={true}
                              handlers={{
                                handleAccordionExpansion: () =>
                                  handleTodoItemExpansion(
                                    todoGroup.pk,
                                    todoItem.pk
                                  ),
                                handleHeaderRemoveIconClick: () =>
                                  handleRemoveTodoItem(
                                    todoGroup.pk,
                                    todoItemIndex
                                  ),
                              }}
                              additionalAccordionProps={{
                                className: "todo-group-items__todo-item",
                              }}
                              additionalAccordionSummaryProps={{
                                className: "todo-group-items__todo-item-header",
                              }}
                              additionalExpandIconProps={{
                                className:
                                  "todo-group-items__todo-item-expand-icon",
                              }}
                              additionalMoreVertIconProps={{
                                className:
                                  "todo-group-items__todo-item-ellipsis",
                                onClick: (event) =>
                                  handleTodoItemEllipsisClick(event, todoItem),
                              }}
                              additionalAccordionHeadingProps={{
                                className:
                                  "todo-group-items__todo-item-heading",
                              }}
                              additionalAccordionRemoveIconProps={{
                                className:
                                  "todo-group-items__todo-item-remove-icon",
                              }}
                              accordionDetails={
                                <>
                                  <Typography className="todo-group-items__todo-item-description">
                                    {todoItem.description || "-"}
                                  </Typography>
                                </>
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    </>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Dropdown
        anchorEl={anchorEl}
        handlers={{
          onDropdownItemClick,
          onCloseHandler: handleDropdownClose,
        }}
        menuItems={[
          { name: "Update", icon: EditOutlinedIcon },
          {
            name: "Access",
            icon: AdminPanelSettingsIcon,
          },
          { name: "Duplicate", icon: ContentCopyIcon },
          { name: "Move", icon: DriveFileMoveIcon },
        ]}
      />
    </div>
  );
}
