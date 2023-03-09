import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { cloneDeep } from "lodash";
import { useAlert } from "react-alert";

import "./TodoGroups.css";

import PlusIcon from "assets/icons/plus-icon.svg";
import SortIcon from "assets/icons/sort.png";
import Avatar from "assets/images/james-bond.jfif";
import AddMember from "assets/icons/add-member.svg";

import { useStateValue } from "config/context api/StateProvider";

import TodoGroupService from "services/todoGroups";
import TodoItemsService from "services/todoItems";

import { useTodoGroups } from "hooks/todos";

import {
  setTodoGroups,
  setTodoGroupItems,
  setTodoGroupItemsExpanded,
  setTodoGroupItemsSortFilter,
  setTodoGroupItemsDraggable,
  setMultiple,
} from "store/reducers/todos";

import { createTheme } from "@mui/material/styles";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import { LockOpen } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LinkIcon from "@mui/icons-material/Link";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ImportExportIcon from "@mui/icons-material/ImportExport";

import { MuiButton, MuiSelect } from "../../MuiComponents/MuiComponents";

import Button from "components/Atoms/Button/Button";
import SearchBar from "components/Atoms/SearchBar/SearchBar";
import Card from "components/Atoms/Card/Card";
import Dropdown from "components/Atoms/Dropdown/Dropdown";

import AccessModal from "./AccessModal/AccessModal";
import CreateTodoGroupModal from "./CreateTodoGroupModal/CreateTodoGroupModal";
import AddNewListItemModal from "./AddNewListItemModal/AddNewListItemModal";
import DeleteTodoGroupModal from "./DeleteTodoGroupModal/DeleteTodoGroupModal";
import TodoGroupItems from "./TodoGroupItems/TodoGroupItems";
import AddNewMemberModal from "./AddNewMemberModal/AddNewMemberModal";
import Overlay from "../../extras/Overlay/Overlay";

const tooltipStyles = {
  popper: {
    sx: {
      [`& .${tooltipClasses.tooltip}`]: {
        padding: "12px 16px",
        fontSize: "16px",
      },
    },
  },
};

const theme = createTheme({
  palette: {
    background: {
      cursor: "unset !important",
    },
  },
});

const getTodoGroupItemsSortInitObject = () => {
  return {
    sortBy: { position: true, priority: false },
    order: {
      desc: false,
      asc: true,
    },
  };
};

function TodoGroups() {
  const dispatch = useDispatch();
  const todosStore = useSelector((state) => state.todos);
  const {
    todoGroups,
    todoGroupItems,
    todoGroupItemsExpanded,
    todoGroupItemsSortFilter,
    todoGroupItemsDraggable,
  } = todosStore;

  console.log(
    "%cstate from todoStore:",
    "background-color:purple;",
    todosStore
  );

  const [{ userToken }] = useStateValue();
  const customAlert = useAlert();

  const todoGroupQueryHook = useTodoGroups({ token: userToken });

  const {
    data: todoGroupsData,
    refetch: fetchTodoGroups,
    isFetching: isTodoGroupsFetching,
    isError: isTodoGroupsError,
    error: todoGroupsError,
  } = todoGroupQueryHook;

  console.log(
    "%cReact Query fields:",
    "background-color:crimson;",
    todoGroupQueryHook
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [modals, setModals] = useState({
    isAccessModalOpen: false,
    isCreateTodoGroupModalOpen: false,
    isUpdateTodoGroupModalOpen: false,
    isDeleteTodoGroupModalOpen: false,
    isAddNewListItemModalOpen: false,
    isAddNewMemberModalOpen: false,
  });
  const [isTodoGroupItemsFetching, setIsTodoGroupItemsFetching] = useState({});
  const [todoGroupItemsError, setTodoGroupItemsError] = useState({});
  const [selectedTodoGroup, setSelectedTodoGroup] = useState(null);
  const [selectedTodoGroupIndex, setSelectedTodoGroupIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  console.log("modals:", modals);

  console.log(
    "%cselectedTodoGroupIndex: ",
    "background-color:pink;",
    selectedTodoGroupIndex
  );

  console.log(
    "%ctodoGroupItems: ",
    "background-color:lightblue;",
    todoGroupItems
  );

  console.log(
    "%cisTodoGroupItemsFetching: ",
    "background-color:aqua;",
    isTodoGroupItemsFetching
  );

  console.log(
    "%ctodoGroupItemsSortFilter: ",
    "background-color:darkturquoise;",
    todoGroupItemsSortFilter
  );

  const fetchTodoGroupItems = useCallback(
    async (
      todoGroupKey,
      singleFetch = false,
      shouldSetAutomatically = true
    ) => {
      setIsTodoGroupItemsFetching((prev) => ({
        ...prev,
        [todoGroupKey]: true,
      }));

      try {
        const response = await TodoItemsService.readTodoItems(
          { token: userToken },
          todoGroupKey
        );
        const fetchedTodoGroupItems = response.data;

        let finalTodoGroupItems = [];
        for (let key in fetchedTodoGroupItems) {
          finalTodoGroupItems.push(fetchedTodoGroupItems[key]);
        }

        finalTodoGroupItems = finalTodoGroupItems.sort((a, b) => {
          return a.position - b.position;
        });

        setIsTodoGroupItemsFetching((prev) => ({
          ...prev,
          [todoGroupKey]: false,
        }));

        if (singleFetch) {
          console.log(
            "%ctodoGroupItems inside singleFetch:",
            "background-color:crimson;color:white;",
            todoGroupItems
          );
          console.log(
            "%cfinalTodoGroupItems:",
            "background-color:crimson;color:white",
            finalTodoGroupItems
          );
          if (shouldSetAutomatically) {
            return dispatch(
              setTodoGroupItems({
                ...todoGroupItems,
                [todoGroupKey]: finalTodoGroupItems,
              })
            );
          } else {
            return {
              [todoGroupKey]: finalTodoGroupItems,
            };
          }
        }

        return {
          [todoGroupKey]: finalTodoGroupItems,
        };
      } catch (error) {
        setIsTodoGroupItemsFetching((prev) => ({
          ...prev,
          [todoGroupKey]: false,
        }));
        setTodoGroupItemsError((prev) => ({
          ...prev,
          [todoGroupKey]: error.message,
        }));
        return {
          [todoGroupKey]: [],
        };
      }
    },
    [dispatch, todoGroupItems, userToken]
  );

  const getTodoGroupItems = useCallback(async () => {
    const todoGroupItemsPromises = todoGroups.map((todoGroup) =>
      fetchTodoGroupItems(todoGroup.pk)
    );
    const todoGroupItemsResponse = await Promise.allSettled(
      todoGroupItemsPromises
    );
    console.log(
      "%ctodoItems for groups: ",
      "background-color:yellow;",
      todoGroupItemsResponse
    );

    let localTodoGroupItems = {};
    let todoGroupItemsExpandObj = {};
    let todoGroupItemsSortFilterObj = {};
    let todoGroupItemsDraggableObj = {};

    todoGroups.forEach((todoGroup, index) => {
      localTodoGroupItems[`${todoGroup.pk}`] =
        todoGroupItemsResponse[index].value[`${todoGroup.pk}`];

      todoGroupItemsExpandObj[`${todoGroup.pk}`] = {};
      localTodoGroupItems[`${todoGroup.pk}`].forEach((todoGroupItem) => {
        todoGroupItemsExpandObj[`${todoGroup.pk}`][
          `${todoGroupItem.pk}`
        ] = false;
      });

      todoGroupItemsSortFilterObj[`${todoGroup.pk}`] = {
        ...getTodoGroupItemsSortInitObject(),
      };

      todoGroups.forEach((todoGroup) => {
        todoGroupItemsDraggableObj[`${todoGroup.pk}`] = true;
      });
    });

    dispatch(
      setMultiple({
        todoGroupItems: localTodoGroupItems,
        todoGroupItemsExpanded: todoGroupItemsExpandObj,
        todoGroupItemsSortFilter: todoGroupItemsSortFilterObj,
        todoGroupItemsDraggable: todoGroupItemsDraggableObj,
      })
    );
  }, [dispatch, fetchTodoGroupItems, todoGroups]);

  const sortedTodoGroupItems = useMemo(() => {
    console.log(
      "%ctodoGroupItems changed in useMemo:",
      "background-color:crimson;color:white",
      todoGroupItems
    );
    let sortedItems = cloneDeep(todoGroupItems);

    const sortByPosition = (todoGroupKey) => {
      sortedItems[todoGroupKey] = sortedItems[todoGroupKey].sort((a, b) => {
        if (todoGroupItemsSortFilter[todoGroupKey].order.asc) {
          return a.position - b.position;
        }
        if (todoGroupItemsSortFilter[todoGroupKey].order.desc) {
          return b.position - a.position;
        }

        return a.position - b.position;
      });
    };

    const sortByPriority = (todoGroupKey) => {
      sortedItems[todoGroupKey] = sortedItems[todoGroupKey].sort((a, b) => {
        if (todoGroupItemsSortFilter[todoGroupKey].order.asc) {
          return a.priority - b.priority;
        }
        if (todoGroupItemsSortFilter[todoGroupKey].order.desc) {
          return b.priority - a.priority;
        }

        return a.priority - b.priority;
      });
    };

    for (const todoGroupKey in sortedItems) {
      if (todoGroupItemsSortFilter[todoGroupKey].sortBy.position) {
        sortByPosition(todoGroupKey);
      }
      if (todoGroupItemsSortFilter[todoGroupKey].sortBy.priority) {
        sortByPriority(todoGroupKey);
      }
    }

    return sortedItems;
  }, [todoGroupItems, todoGroupItemsSortFilter]);

  console.log(
    "%csortedTodoGroupItems:",
    "background-color:brown;",
    sortedTodoGroupItems
  );

  useEffect(() => {
    if (todoGroupsData) {
      if (!isTodoGroupsFetching) {
        const fetchedTodoGroups = todoGroupsData.data;

        let finalTodoGroups = [];
        for (let key in fetchedTodoGroups) {
          finalTodoGroups.push(fetchedTodoGroups[key]);
        }
        console.log(
          `%cfinalFetchedTodoGroups: `,
          "background-color:yellow;",
          finalTodoGroups
        );
        dispatch(setTodoGroups(finalTodoGroups));
      }
    }
  }, [dispatch, isTodoGroupsFetching, todoGroupsData]);

  useEffect(() => {
    const todoGroupItemsKeysArray = Object.keys(todoGroupItems);
    const lengthDifference = todoGroups.length - todoGroupItemsKeysArray.length;

    if (lengthDifference === 1) {
      console.log(
        "A todo group is newly added, so no need to fetch todo items, as they are not created yet. bye bye"
      );
      return;
    }

    // Fetch Todo Items only if there are todo groups
    if (todoGroups.length > 0) {
      if (todoGroups.length !== todoGroupItemsKeysArray.length) {
        // Greater length of todo groups implies todo groups are fetched
        // Hence fetch their respective todo items
        if (todoGroups.length > todoGroupItemsKeysArray.length) {
          getTodoGroupItems();
        }
        // Lesser length implies a todo group is deleted
        // Hence remove the respective todo items locally
        if (todoGroups.length < todoGroupItemsKeysArray.length) {
          let newTodoGroupItems = {};
          let newTodoGroupItemsExpanded = {};

          todoGroups.forEach((todoGroup) => {
            if (todoGroupItemsKeysArray.includes(todoGroup.pk)) {
              newTodoGroupItems[`${todoGroup.pk}`] =
                todoGroupItems[`${todoGroup.pk}`];
              newTodoGroupItemsExpanded[`${todoGroup.pk}`] =
                todoGroupItemsExpanded[`${todoGroup.pk}`];
            }
          });

          dispatch(
            setMultiple({
              todoGroupItems: newTodoGroupItems,
              todoGroupItemsExpanded: newTodoGroupItemsExpanded,
            })
          );
        }
      }
    }
  }, [
    dispatch,
    fetchTodoGroupItems,
    getTodoGroupItems,
    todoGroupItems,
    todoGroupItemsExpanded,
    todoGroups,
  ]);

  const handleTodoItemExpanded = useCallback(
    (todoGroupKey, todoItemKey, action) => {
      let newTodoGroupItemsExpanded = cloneDeep(todoGroupItemsExpanded);

      switch (action) {
        case "remove":
          delete newTodoGroupItemsExpanded[todoGroupKey][todoItemKey];

          dispatch(setTodoGroupItemsExpanded(newTodoGroupItemsExpanded));

          break;
        case "add":
          newTodoGroupItemsExpanded[todoGroupKey][todoItemKey] = false;

          dispatch(setTodoGroupItemsExpanded(newTodoGroupItemsExpanded));

          break;
        default:
          return;
      }
    },
    [dispatch, todoGroupItemsExpanded]
  );

  const handleDropdownEllipsisClick = (event, todoGroupIndex) => {
    setAnchorEl(event.target);
    setSelectedTodoGroup(todoGroups[todoGroupIndex]);
  };

  const handleDropdownClose = () => {
    console.log("handleDropdownClose called!");
    setAnchorEl(null);
  };

  const onDropdownItemClick = (event, item, index) => {
    const itemType = item.name.toLowerCase();

    handleModalToggle(itemType);

    setAnchorEl(null);
  };

  const dropdownItemTypeToModalTypeMap = useMemo(() => {
    return {
      access: "isAccessModalOpen",
      createTodoGroup: "isCreateTodoGroupModalOpen",
      update: "isUpdateTodoGroupModalOpen",
      delete: "isDeleteTodoGroupModalOpen",
      addNewListItem: "isAddNewListItemModalOpen",
      addNewMember: "isAddNewMemberModalOpen",
    };
  }, []);

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

  const renderModal = useMemo(() => {
    let modalKey;
    for (const [key, value] of Object.entries(modals)) {
      if (value === true) {
        modalKey = key;
      }
    }

    const modalToReturn = {
      isAccessModalOpen: (
        <AccessModal
          isOpen={modals.isAccessModalOpen}
          handleModalToggle={() => handleModalToggle("access")}
          todoGroup={selectedTodoGroup}
          fetchTodos={fetchTodoGroups}
        />
      ),
      isCreateTodoGroupModalOpen: (
        <CreateTodoGroupModal
          isOpen={modals.isCreateTodoGroupModalOpen}
          fetchTodos={fetchTodoGroups}
          handleModalToggle={() => handleModalToggle("createTodoGroup")}
        />
      ),
      isAddNewListItemModalOpen: (
        <AddNewListItemModal
          isOpen={modals.isAddNewListItemModalOpen}
          handleModalToggle={() => handleModalToggle("addNewListItem")}
          todoGroupKey={todoGroups[selectedTodoGroupIndex]?.pk}
          fetchTodoGroupItems={fetchTodoGroupItems}
          handleTodoItemExpanded={handleTodoItemExpanded}
          todoGroupItems={
            todoGroupItems[todoGroups[selectedTodoGroupIndex]?.pk]
          }
          isTodoGroupItemsFetching={
            isTodoGroupItemsFetching[selectedTodoGroupIndex]
          }
        />
      ),
      isUpdateTodoGroupModalOpen: (
        <CreateTodoGroupModal
          isOpen={modals.isUpdateTodoGroupModalOpen}
          fetchTodos={fetchTodoGroups}
          handleModalToggle={() => handleModalToggle("update")}
          selectedTodoGroup={selectedTodoGroup}
        />
      ),
      isDeleteTodoGroupModalOpen: (
        <DeleteTodoGroupModal
          isOpen={modals.isDeleteTodoGroupModalOpen}
          fetchTodos={fetchTodoGroups}
          handleModalToggle={() => handleModalToggle("delete")}
          selectedTodoGroup={selectedTodoGroup}
        />
      ),
      isAddNewMemberModalOpen: (
        <AddNewMemberModal
          isOpen={modals.isAddNewMemberModalOpen}
          handleModalToggle={() => handleModalToggle("addNewMember")}
        />
      ),
    };

    return modalToReturn[modalKey];
  }, [
    modals,
    selectedTodoGroup,
    fetchTodoGroups,
    todoGroups,
    selectedTodoGroupIndex,
    fetchTodoGroupItems,
    handleTodoItemExpanded,
    todoGroupItems,
    isTodoGroupItemsFetching,
    handleModalToggle,
  ]);

  const handleTodoGroupMakeClick = async (todoGroup) => {
    if (
      window.confirm(
        `Make this todo group ${todoGroup.searchable ? "Private" : "Public"}?`
      )
    ) {
      const updateObject = {
        pk: todoGroup.pk,
        acl: todoGroup.acl,
        memberStatus: todoGroup.memberStatus,
        name: todoGroup.name,
        description: todoGroup.description,
        creationDateTime: todoGroup.creationDateTime,
        searchable: Number(!Boolean(todoGroup.searchable)),
      };

      console.log("updateObject:", updateObject);

      try {
        setIsSaving(true);

        await TodoGroupService.updateTodoGroup(
          { token: userToken },
          JSON.stringify(updateObject)
        );

        customAlert.show("Todo Group updated successfully!");
        fetchTodoGroups();
      } catch (error) {
        console.log("error:", error);
        const errorMessage = error.message;

        alert(`Some error occurred!\n${errorMessage}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleTodoItemsCopyIconClick = (todoGroupItems) => {
    console.log("copy icon clicked!", todoGroupItems);
    if (!navigator.clipboard) {
      return customAlert.show("Cannot copy. Your browser doesn't supports it.");
    }

    if (!todoGroupItems?.length) {
      return;
    }

    let content = [];

    for (let i = 0; i < todoGroupItems.length; i++) {
      content.push(todoGroupItems[i].headline, todoGroupItems[i].description);
    }

    content = content.join("\n");

    navigator.clipboard
      .writeText(content)
      .then(() => {
        customAlert.show("Todo items copied!");
      })
      .catch(() => {
        customAlert.show("Some error occurred while copying.");
      });
  };

  const handleSortClick = (event, todoGroupIndex) => {
    setSortAnchorEl(event.target);
    setSelectedTodoGroup(todoGroups[todoGroupIndex]);
  };

  const sortItemsDropdownCloseHandler = () => {
    setSortAnchorEl(null);
  };

  const SortTodoItemsDropdown = () => {
    const todoGroupKey = selectedTodoGroup.pk;
    const [todoGroupItemsSortFilterObj, setTodoGroupItemsSortFilterObj] =
      useState(todoGroupItemsSortFilter[todoGroupKey]);

    console.log(
      "%cselectedTodoGroup inside SortTodoItemsDropdown:",
      "background-color:lime;",
      selectedTodoGroup
    );
    console.log(
      "%ctodoGroupItemsSortFilterObj inside SortTodoItemsDropdown:",
      "background-color:lime;",
      todoGroupItemsSortFilterObj
    );

    const sortByValue = useMemo(() => {
      for (const key in todoGroupItemsSortFilterObj.sortBy) {
        if (todoGroupItemsSortFilterObj.sortBy[key]) {
          return key;
        }
      }

      return "";
    }, [todoGroupItemsSortFilterObj]);

    const orderValue = useMemo(() => {
      for (const key in todoGroupItemsSortFilterObj.order) {
        if (todoGroupItemsSortFilterObj.order[key]) {
          return key;
        }
      }

      return "";
    }, [todoGroupItemsSortFilterObj]);

    console.log(
      "%csortByValue inside SortTodoItemsDropdown:",
      "background-color:lime;",
      sortByValue
    );
    console.log(
      "%corderValue inside SortTodoItemsDropdown:",
      "background-color:lime;",
      orderValue
    );

    const filterObjKeyValueMapping = useMemo(() => {
      return {
        sortBy: {
          position: "Position",
          priority: "Priority",
        },
        order: {
          asc: "Ascending",
          desc: "Descending",
        },
      };
    }, []);

    const handleSortByFilterChange = (key) => {
      if (todoGroupItemsSortFilterObj.sortBy[key]) {
        return;
      }

      let newFilterObj = {};

      Object.keys(todoGroupItemsSortFilterObj.sortBy).forEach((item) => {
        newFilterObj[item] = item === key;
      });

      setTodoGroupItemsSortFilterObj((prev) => ({
        ...prev,
        sortBy: newFilterObj,
      }));
    };

    const handleOrderFilterChange = (key) => {
      if (todoGroupItemsSortFilterObj.order[key]) {
        return;
      }

      let newFilterObj = {};

      Object.keys(todoGroupItemsSortFilterObj.order).forEach((item) => {
        newFilterObj[item] = item === key;
      });

      setTodoGroupItemsSortFilterObj((prev) => ({
        ...prev,
        order: newFilterObj,
      }));
    };

    const onApplyClick = () => {
      if (
        JSON.stringify(todoGroupItemsSortFilterObj) ===
          JSON.stringify(getTodoGroupItemsSortInitObject()) &&
        JSON.stringify(todoGroupItemsSortFilter[todoGroupKey]) ===
          JSON.stringify(getTodoGroupItemsSortInitObject())
      ) {
        customAlert.show("Already Applied!");
        sortItemsDropdownCloseHandler();
        return;
      }

      if (
        JSON.stringify(todoGroupItemsSortFilterObj) ===
        JSON.stringify(todoGroupItemsSortFilter[todoGroupKey])
      ) {
        customAlert.show("Already Applied!");
        sortItemsDropdownCloseHandler();
        return;
      }

      if (
        JSON.stringify(todoGroupItemsSortFilterObj) !==
        JSON.stringify(getTodoGroupItemsSortInitObject())
      ) {
        dispatch(
          setTodoGroupItemsDraggable({
            ...todoGroupItemsDraggable,
            [todoGroupKey]: false,
          })
        );
      } else {
        dispatch(
          setTodoGroupItemsDraggable({
            ...todoGroupItemsDraggable,
            [todoGroupKey]: true,
          })
        );
      }

      dispatch(
        setTodoGroupItemsSortFilter({
          ...todoGroupItemsSortFilter,
          [todoGroupKey]: todoGroupItemsSortFilterObj,
        })
      );

      sortItemsDropdownCloseHandler();
      customAlert.show("Filters Applied");
    };

    const onClearClick = () => {
      if (
        JSON.stringify(todoGroupItemsSortFilterObj) ===
          JSON.stringify(getTodoGroupItemsSortInitObject()) &&
        JSON.stringify(todoGroupItemsSortFilter[todoGroupKey]) ===
          JSON.stringify(getTodoGroupItemsSortInitObject())
      ) {
        customAlert.show("Already In Default State!");
        sortItemsDropdownCloseHandler();
        return;
      }

      dispatch(
        setTodoGroupItemsDraggable({
          ...todoGroupItemsDraggable,
          [todoGroupKey]: true,
        })
      );

      dispatch(
        setTodoGroupItemsSortFilter({
          ...todoGroupItemsSortFilter,
          [todoGroupKey]: { ...getTodoGroupItemsSortInitObject() },
        })
      );

      sortItemsDropdownCloseHandler();
      customAlert.show("Filters Cleared");
    };

    return (
      <Dropdown
        anchorEl={sortAnchorEl}
        handlers={{
          onCloseHandler: sortItemsDropdownCloseHandler,
        }}
      >
        <div className="sort-todo-items-dropdown">
          <div className="sort-todo-items-dropdown__filters">
            <div className="sort-todo-items-dropdown__filter">
              <p className="sort-todo-items-dropdown__filter-heading">
                Sort By
              </p>
              <MuiSelect
                className="sort-todo-items-dropdown__filter-select"
                label="Sort By"
                value={sortByValue}
                menuItems={[
                  ...Object.keys(filterObjKeyValueMapping.sortBy).map(
                    (key) => ({
                      value: key,
                      children: filterObjKeyValueMapping.sortBy[key],
                      additionalMenuItemProps: {
                        onClick: () => handleSortByFilterChange(key),
                      },
                    })
                  ),
                ]}
              />
            </div>

            <div className="sort-todo-items-dropdown__filter">
              <p className="sort-todo-items-dropdown__filter-heading">Order</p>
              <MuiSelect
                className="sort-todo-items-dropdown__filter-select"
                label="Order"
                value={orderValue}
                menuItems={[
                  ...Object.keys(filterObjKeyValueMapping.order).map((key) => ({
                    value: key,
                    children: filterObjKeyValueMapping.order[key],
                    additionalMenuItemProps: {
                      onClick: () => handleOrderFilterChange(key),
                    },
                  })),
                ]}
              />
            </div>
          </div>

          <div className="sort-todo-items-dropdown__action-buttons">
            <Button
              text="Apply"
              variant="filled"
              onClick={() => onApplyClick()}
            />
            <Button text="Clear" onClick={() => onClearClick()} />
          </div>
        </div>
      </Dropdown>
    );
  };

  return (
    <div className="todo-groups">
      {renderModal}
      {sortAnchorEl && <SortTodoItemsDropdown />}
      <div className="todo-groups__header">
        <h3>Todo Groups</h3>
        <div className="todo-groups__control-buttons">
          <Button
            text="CREATE NEW"
            variant="filled"
            iconAfter={PlusIcon}
            onClick={() => handleModalToggle("createTodoGroup")}
          />
        </div>
      </div>

      <div className="todo-groups__body">
        <div className="todo-groups__search-bar">
          <SearchBar placeholder="Search Groups" />
        </div>

        <div className="todo-groups__cards">
          {isTodoGroupsFetching ? (
            <Oval color="#00BFFF" height={40} width={40} />
          ) : isTodoGroupsError ? (
            <div className="todo-groups__error-container">
              <p className="todo-groups__error">
                {todoGroupsError?.response?.data || todoGroupsError.message}
              </p>
              <Button
                text="Try Again"
                variant="filled"
                onClick={() => fetchTodoGroups()}
              />
            </div>
          ) : !todoGroups || todoGroups.length === 0 ? (
            <h3 className="todo-groups__no-todos">No Todos!</h3>
          ) : (
            todoGroups.length > 0 &&
            todoGroups.map((todoGroup, todoGroupIndex) => {
              return (
                <section
                  className="todo-groups__todo-card"
                  key={todoGroupIndex}
                >
                  {isSaving && <Overlay />}
                  <Card padding="24px">
                    <header className="todo-card__header">
                      <div className="todo-card__header-upper">
                        <div className="todo-card__header-upper-left">
                          <Tooltip
                            title={`${todoGroup.owner} is the owner of this group`}
                            componentsProps={tooltipStyles}
                          >
                            <div className="todo-card__owner">
                              <img
                                src={Avatar}
                                alt="avatar"
                                className="todo-card__owner-icon"
                              />
                            </div>
                          </Tooltip>
                          <p className="todo-card__name">{todoGroup.name}</p>
                        </div>

                        <div className="todo-card__header-upper-right">
                          {todoGroup.searchable ? (
                            <Tooltip title="Group is Public">
                              <LockOpen
                                className="todo-card__controls-icon"
                                onClick={() =>
                                  handleTodoGroupMakeClick(todoGroup)
                                }
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Group is Private">
                              <LockOutlinedIcon
                                className="todo-card__controls-icon"
                                onClick={() =>
                                  handleTodoGroupMakeClick(todoGroup)
                                }
                              />
                            </Tooltip>
                          )}

                          <Tooltip title="Invitation Link">
                            <LinkIcon className="todo-card__controls-icon" />
                          </Tooltip>

                          <MoreVertIcon
                            className="todo-card__controls-icon"
                            onClick={(event) =>
                              handleDropdownEllipsisClick(event, todoGroupIndex)
                            }
                          />
                        </div>
                      </div>
                    </header>
                    <Dropdown
                      anchorEl={anchorEl}
                      handlers={{
                        onDropdownItemClick,
                        onCloseHandler: handleDropdownClose,
                      }}
                      menuItems={[
                        { name: "Update", icon: EditOutlinedIcon },
                        {
                          name: "Change Ownership",
                          icon: AccountCircleOutlinedIcon,
                        },
                        { name: "Access", icon: AdminPanelSettingsIcon },
                        { name: "Delete", icon: CancelIcon },
                      ]}
                    />
                    <div className="todo-card__body">
                      <p className="todo-card__todo-description">
                        {todoGroup.description}
                      </p>

                      <section className="todo-card__members">
                        <header className="todo-card__members-header">
                          <p className="todo-card__members-heading">
                            Members ({todoGroup?.members?.length || "0"})
                          </p>
                          <Tooltip
                            title="Add New Member"
                            componentsProps={tooltipStyles}
                          >
                            <img
                              src={AddMember}
                              alt="add member"
                              className="todo-card__add-member-icon"
                              onClick={() => handleModalToggle("addNewMember")}
                            />
                          </Tooltip>
                        </header>

                        {todoGroup?.members?.length > 0 && (
                          <div className="todo-card__members-list">
                            {todoGroup.members.map((member, index) => {
                              return (
                                <div className="todo-card__member" key={index}>
                                  <Tooltip
                                    title={member.name}
                                    componentsProps={tooltipStyles}
                                  >
                                    <img
                                      src={Avatar}
                                      alt="avatar"
                                      className="todo-card__member-icon"
                                    />
                                  </Tooltip>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>

                      <section className="todo-card__todo-items">
                        <header className="todo-card__todo-items-header">
                          <p className="todo-card__todo-items-heading">
                            To Do&apos;s (
                            {sortedTodoGroupItems[todoGroup.pk]?.length || "0"})
                          </p>

                          <div className="todo-card__todo-items-controls">
                            <Tooltip
                              title="Sort items"
                              componentsProps={tooltipStyles}
                            >
                              <ImportExportIcon
                                className={`todo-card__sort-todoitem-icon ${
                                  sortedTodoGroupItems[todoGroup.pk]?.length
                                    ? sortedTodoGroupItems[todoGroup.pk]
                                        .length <= 1
                                      ? "todo-card__sort-todoitem-icon--disabled"
                                      : ""
                                    : "todo-card__sort-todoitem-icon--disabled"
                                }`}
                                onClick={(event) =>
                                  sortedTodoGroupItems[todoGroup.pk]?.length
                                    ? sortedTodoGroupItems[todoGroup.pk]
                                        .length <= 1
                                      ? null
                                      : handleSortClick(event, todoGroupIndex)
                                    : null
                                }
                              />

                              {/* <MuiButton
                                className="todo-card__sort-todoitem-button"
                                variant="contained"
                                endIcon={
                                  <img
                                    src={SortIcon}
                                    alt="Sort"
                                    className="todo-card__sort-todoitem-icon"
                                  />
                                }
                                disabled={
                                  sortedTodoGroupItems[todoGroup.pk]?.length
                                    ? sortedTodoGroupItems[todoGroup.pk]
                                        .length <= 1
                                    : true
                                }
                                additionalProps={{
                                  onClick: (event) =>
                                    handleSortClick(event, todoGroupIndex),
                                }}
                              >
                                Sort
                              </MuiButton> */}
                            </Tooltip>
                            <Tooltip
                              title="Copy items to clipboard"
                              componentsProps={tooltipStyles}
                            >
                              <ContentCopyIcon
                                className={`todo-card__copy-todoitem-icon ${
                                  !sortedTodoGroupItems[todoGroup.pk]?.length
                                    ? "todo-card__copy-todoitem-icon--disabled"
                                    : ""
                                }`}
                                onClick={
                                  !sortedTodoGroupItems[todoGroup.pk]?.length
                                    ? null
                                    : () =>
                                        handleTodoItemsCopyIconClick(
                                          sortedTodoGroupItems[todoGroup.pk]
                                        )
                                }
                              />
                              {/* <MuiButton
                                className="todo-card__copy-todoitem-button"
                                variant="contained"
                                endIcon={
                                  <ContentCopyIcon className="todo-card__copy-todoitem-icon" />
                                }
                                additionalProps={{
                                  onClick: () =>
                                    handleTodoItemsCopyIconClick(
                                      sortedTodoGroupItems[todoGroup.pk]
                                    ),
                                }}
                                disabled={
                                  !sortedTodoGroupItems[todoGroup.pk]?.length
                                }
                              >
                                Copy
                              </MuiButton> */}
                            </Tooltip>
                          </div>
                        </header>

                        <div className="todo-card__todo-items-body">
                          {isTodoGroupItemsFetching[todoGroup.pk] ? (
                            <Oval color="#00BFFF" height={30} width={30} />
                          ) : todoGroupItemsError[todoGroup.pk] ? (
                            <div className="todo-groups__error-container">
                              <p className="todo-groups__error">
                                {todoGroupItemsError[todoGroup.pk]}
                              </p>
                              <Button
                                text="Try Fetching To Do Items Again"
                                variant="filled"
                                onClick={() =>
                                  fetchTodoGroupItems(todoGroup.pk, true)
                                }
                              />
                            </div>
                          ) : (
                            sortedTodoGroupItems[todoGroup.pk]?.length > 0 && (
                              <TodoGroupItems
                                fetchTodoGroupItems={fetchTodoGroupItems}
                                todoGroup={todoGroup}
                                todoGroupItems={
                                  sortedTodoGroupItems[todoGroup.pk]
                                }
                                todoGroupItemsExpanded={
                                  todoGroupItemsExpanded[todoGroup.pk]
                                }
                                theme={theme}
                                tooltipStyles={tooltipStyles}
                                todoGroupItemsDraggable={
                                  todoGroupItemsDraggable[todoGroup.pk]
                                }
                              />
                            )
                          )}
                        </div>
                      </section>

                      <Tooltip
                        title="Add new list item"
                        componentsProps={tooltipStyles}
                      >
                        <button
                          className="todo-card__add-new-list-button"
                          onClick={() => {
                            setSelectedTodoGroupIndex(todoGroupIndex);
                            handleModalToggle("addNewListItem");
                          }}
                          disabled={
                            isSaving || isTodoGroupItemsFetching[todoGroup.pk]
                          }
                        >
                          <AddIcon className="todo-card__add-new-list-icon" />
                        </button>
                      </Tooltip>
                    </div>
                  </Card>
                </section>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(TodoGroups);
