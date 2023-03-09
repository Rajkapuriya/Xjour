import {
  useState,
  useEffect,
  useRef,
  memo,
  forwardRef,
  useCallback,
} from "react";
import { useAlert } from "react-alert";

import "./CreateTodoGroupModal.css";

import { permissionsModuloFactors } from "../../../../assets/constants/Contants";

import { useStateValue } from "../../../../config/context api/StateProvider";

import TodoGroupService from "../../../../services/todoGroups";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import GroupIcon from "@mui/icons-material/Group";

import {
  MuiSelect,
  MuiSwitch,
  MuiDateTimePicker,
  MuiTextField,
} from "../../../MuiComponents/MuiComponents";
import Button from "../../../Atoms/Button/Button";
import MuiModal from "../../../Atoms/MuiModal/MuiModal";

const getTitleCase = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const booleanObjectValuesToStringArray = (object) => {
  if (typeof object !== "object" || object === null) {
    return null;
  }

  const stringArray = [];
  Object.keys(object).forEach((key) => {
    if (object[key] === true) {
      stringArray.push(getTitleCase(key));
    }
  });

  return stringArray;
};

function CreateTodoGroupModal(props) {
  const { handleModalToggle, fetchTodos, isOpen, selectedTodoGroup } = props;
  const todoGroupPermissionCode = selectedTodoGroup?.acl || 7429;
  const isUpdateModal = Boolean(selectedTodoGroup);

  console.log(
    "%cselectedTodoGroup inside CreateTodoGroupModal:",
    "background-color:cadetblue;",
    selectedTodoGroup
  );

  const [{ userToken }] = useStateValue();

  const customAlert = useAlert();

  const permissionRef = useRef(null);

  const isPermissionSet = (permissionCode, moduloFactor) => {
    return permissionCode % moduloFactor === 0;
  };

  const [formDetails, setFormDetails] = useState({
    acl: todoGroupPermissionCode,
    memberStatus: selectedTodoGroup?.memberStatus || 1,
    groupTitle: selectedTodoGroup?.name || "",
    groupDescription: selectedTodoGroup?.description || "",
    userPermissions: {
      read: isPermissionSet(
        todoGroupPermissionCode,
        permissionsModuloFactors.user.read
      ),
      write: isPermissionSet(
        todoGroupPermissionCode,
        permissionsModuloFactors.user.write
      ),
      execute: isPermissionSet(
        todoGroupPermissionCode,
        permissionsModuloFactors.user.execute
      ),
    },
    groupPermissions: {
      read: isPermissionSet(
        todoGroupPermissionCode,
        permissionsModuloFactors.group.read
      ),
      write: isPermissionSet(
        todoGroupPermissionCode,
        permissionsModuloFactors.group.write
      ),
      execute: isPermissionSet(
        todoGroupPermissionCode,
        permissionsModuloFactors.group.execute
      ),
    },
    worldPermissions: {
      read: isPermissionSet(
        todoGroupPermissionCode,
        permissionsModuloFactors.other.read
      ),
      write: isPermissionSet(
        todoGroupPermissionCode,
        permissionsModuloFactors.other.write
      ),
      execute: isPermissionSet(
        todoGroupPermissionCode,
        permissionsModuloFactors.other.execute
      ),
    },
    userPermissionsText: [],
    groupPermissionsText: [],
    worldPermissionsText: [],
    creationDate: selectedTodoGroup?.creationDateTime || Date.now(),
    searchable: selectedTodoGroup?.searchable || 0,
  });
  const [isUserPermissionsOpen, setIsUserPermissionsOpen] = useState(false);
  const [isGroupPermissionsOpen, setIsGroupPermissionsOpen] = useState(false);
  const [isWorldPermissionsOpen, setIsWorldPermissionsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  console.log("formDetails:", formDetails);

  useEffect(() => {
    const { userPermissions, groupPermissions, worldPermissions } = formDetails;

    const permissionsText1 = [];
    for (const key in userPermissions) {
      if (userPermissions[key] === true) {
        permissionsText1.push(getTitleCase(key));
      }
    }

    const permissionsText2 = [];
    for (const key in groupPermissions) {
      if (groupPermissions[key] === true) {
        permissionsText2.push(getTitleCase(key));
      }
    }

    const permissionsText3 = [];
    for (const key in worldPermissions) {
      if (worldPermissions[key] === true) {
        permissionsText3.push(getTitleCase(key));
      }
    }

    setFormDetails((prev) => ({
      ...prev,
      userPermissionsText: permissionsText1,
      groupPermissionsText: permissionsText2,
      worldPermissionsText: permissionsText3,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormDetails = (value, key) => {
    setFormDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateGroupFormClick = useCallback(
    (event) => {
      const menuItems = document.getElementsByClassName(
        "create-group-modal__input-permissions-item"
      );
      const menuItemSwitches = document.getElementsByClassName(
        "MuiSwitch-input PrivateSwitchBase-input css-1m9pwf3"
      );

      if (
        isGroupPermissionsOpen ||
        isWorldPermissionsOpen ||
        isUserPermissionsOpen
      ) {
        if (
          ![...menuItems].includes(event.target) &&
          ![...menuItemSwitches].includes(event.target)
        ) {
          console.log(
            "%cpermissionsRef after leaving form:",
            "background-color:red;",
            permissionRef.current
          );

          let permissionsText = [];

          if (permissionRef.current) {
            permissionsText = booleanObjectValuesToStringArray(
              permissionRef.current
            );
          }

          isGroupPermissionsOpen &&
            (function () {
              if (permissionRef.current) {
                setFormDetails((prev) => ({
                  ...prev,
                  groupPermissions: permissionRef.current,
                  groupPermissionsText: permissionsText,
                }));
              }
              setIsGroupPermissionsOpen(false);
            })();

          isWorldPermissionsOpen &&
            (function () {
              if (permissionRef.current) {
                setFormDetails((prev) => ({
                  ...prev,
                  worldPermissions: permissionRef.current,
                  worldPermissionsText: permissionsText,
                }));
              }
              setIsWorldPermissionsOpen(false);
            })();

          isUserPermissionsOpen &&
            (function () {
              if (permissionRef.current) {
                setFormDetails((prev) => ({
                  ...prev,
                  userPermissions: permissionRef.current,
                  userPermissionsText: permissionsText,
                }));
              }
              setIsUserPermissionsOpen(false);
            })();
        }
      }
    },
    [isGroupPermissionsOpen, isUserPermissionsOpen, isWorldPermissionsOpen]
  );

  const handleCreationDateChange = (newValue) => {
    setFormDetails((prev) => ({
      ...prev,
      creationDate: new Date(newValue).getTime(),
    }));
  };

  const handleSaveClick = async (event) => {
    event.preventDefault();

    const {
      acl,
      memberStatus,
      groupTitle,
      groupDescription,
      creationDate,
      searchable,
    } = formDetails;

    if ([Boolean(groupTitle), Boolean(groupDescription)].includes(false)) {
      alert("Title and description are required to create a Todo Group!");
      return;
    }

    const permissionsObj = {
      userRead: [
        formDetails.userPermissions.read,
        permissionsModuloFactors.user.read,
      ],
      userWrite: [
        formDetails.userPermissions.write,
        permissionsModuloFactors.user.write,
      ],
      userExecute: [
        formDetails.userPermissions.execute,
        permissionsModuloFactors.user.execute,
      ],
      groupRead: [
        formDetails.groupPermissions.read,
        permissionsModuloFactors.group.read,
      ],
      groupWrite: [
        formDetails.groupPermissions.write,
        permissionsModuloFactors.group.write,
      ],
      groupExecute: [
        formDetails.groupPermissions.execute,
        permissionsModuloFactors.group.execute,
      ],
      worldRead: [
        formDetails.worldPermissions.read,
        permissionsModuloFactors.other.read,
      ],
      worldWrite: [
        formDetails.worldPermissions.write,
        permissionsModuloFactors.other.write,
      ],
      worldExecute: [
        formDetails.worldPermissions.execute,
        permissionsModuloFactors.other.execute,
      ],
    };

    const permissionsCodes = [];

    for (const key in permissionsObj) {
      if (permissionsObj[key][0] === true) {
        permissionsCodes.push(permissionsObj[key][1]);
      }
    }

    const aclCode =
      permissionsCodes.length > 0
        ? permissionsCodes.reduce((acc, cur) => acc * cur)
        : 0;

    // Create Todo Group Block
    if (!isUpdateModal) {
      setIsSaving(true);

      let dataObject = {
        acl: aclCode,
        memberStatus: memberStatus,
        name: groupTitle,
        description: groupDescription,
        creationDateTime: creationDate,
        searchable: searchable,
      };

      dataObject = JSON.stringify(dataObject);

      console.log("dataObject:", dataObject);

      try {
        await TodoGroupService.createTodoGroup(
          { token: userToken },
          dataObject
        );

        customAlert.show("Todo Group created successfully!");

        setIsSaving(false);
        handleModalToggle();

        fetchTodos();
      } catch (error) {
        const errorMessage = error.message;

        alert(`Some error occurred!\n${errorMessage}`);
        setIsSaving(false);
      }
    }
    // Update Todo Group Block
    else {
      let updateObject = {
        acl: aclCode,
        memberStatus: memberStatus,
        name: groupTitle,
        description: groupDescription,
        creationDateTime: creationDate,
        searchable: searchable,
      };

      const prevObject = JSON.stringify({
        acl: selectedTodoGroup.acl,
        memberStatus: selectedTodoGroup.memberStatus,
        name: selectedTodoGroup.name,
        description: selectedTodoGroup.description,
        creationDateTime: selectedTodoGroup.creationDateTime,
        searchable: selectedTodoGroup.searchable,
      });

      if (JSON.stringify(updateObject) === prevObject) {
        return alert("No changes made to save.");
      }

      updateObject.pk = selectedTodoGroup.pk;

      console.log("updateObject:", updateObject);

      setIsSaving(true);
      try {
        await TodoGroupService.updateTodoGroup(
          { token: userToken },
          JSON.stringify(updateObject)
        );

        customAlert.show("Todo Group updated successfully!");

        setIsSaving(false);
        handleModalToggle();
        fetchTodos();
      } catch (error) {
        const errorMessage = error.message;

        alert(`Some error occurred!\n${errorMessage}`);
        setIsSaving(false);
      }
    }
  };

  const PermissionInput = memo(
    forwardRef(function PermissionInput(props, ref) {
      const {
        title,
        values = {},
        isOpen,
        openHandler,
        permissionsText = [],
      } = props;

      const selectRef = useRef(null);

      const [permissions, setPermissions] = useState(values);

      useEffect(() => {
        ref.current = null;

        selectRef.current.children[0].innerHTML = permissionsText.join(", ");
      }, [permissionsText, ref, values]);

      const handleMenuItemClick = (permissionKey) => {
        const newState = {
          ...permissions,
          [permissionKey]: !permissions[permissionKey],
        };
        ref.current = newState;

        const localPermissionsText = booleanObjectValuesToStringArray(newState);
        selectRef.current.children[0].innerHTML =
          localPermissionsText.join(", ");

        setPermissions(newState);
      };

      return (
        <>
          <MuiSelect
            label={title}
            value="0"
            additionalSelectProps={{
              onClick: () => openHandler(),
              open: isOpen,
              ref: selectRef,
            }}
            menuItems={[
              "null",
              ...Object.keys(permissions).map((menuItemKey) => {
                return {
                  value: menuItemKey,
                  additionalMenuItemProps: {
                    className: "create-group-modal__input-permissions-item",
                    onClick: () => handleMenuItemClick(menuItemKey),
                  },
                  children: (
                    <>
                      {getTitleCase(menuItemKey)}
                      <MuiSwitch
                        checked={permissions[menuItemKey]}
                        onClick={() => handleMenuItemClick(menuItemKey)}
                      />
                    </>
                  ),
                };
              }),
            ]}
          />
        </>
      );
    })
  );

  return (
    <MuiModal
      isModalOpen={isOpen}
      modalType="createTodoGroup"
      closeModalHandler={!isSaving ? () => handleModalToggle() : null}
      modalTitle={selectedTodoGroup ? "Update Group" : "Create Group"}
      modalHeaderIcon={<GroupIcon />}
      modalWidth="80%"
      modalHeight="90vh"
    >
      <div className="create-group-modal">
        <Box
          id="create-group-modal__form"
          className="create-group-modal__form"
          onClick={handleCreateGroupFormClick}
          component="form"
          noValidate
          autoComplete="off"
        >
          <MuiTextField
            label="Title"
            value={formDetails.groupTitle}
            additionalProps={{
              onChange: (event) =>
                handleFormDetails(event.target.value, "groupTitle"),
            }}
          />
          <MuiTextField
            label="Description"
            value={formDetails.groupDescription}
            additionalProps={{
              rows: 4,
              multiline: true,
              onChange: (event) =>
                handleFormDetails(event.target.value, "groupDescription"),
            }}
          />

          {!isUpdateModal && (
            <div className="create-group-modal__permissions">
              <PermissionInput
                ref={permissionRef}
                title="User Permissions"
                isOpen={isUserPermissionsOpen}
                openHandler={() => setIsUserPermissionsOpen(true)}
                values={{
                  read: formDetails.userPermissions.read,
                  write: formDetails.userPermissions.write,
                  execute: formDetails.userPermissions.execute,
                }}
                permissionsText={formDetails.userPermissionsText}
              />
              <PermissionInput
                ref={permissionRef}
                title="Group Permissions"
                isOpen={isGroupPermissionsOpen}
                openHandler={() => setIsGroupPermissionsOpen(true)}
                values={{
                  read: formDetails.groupPermissions.read,
                  write: formDetails.groupPermissions.write,
                  execute: formDetails.groupPermissions.execute,
                }}
                permissionsText={formDetails.groupPermissionsText}
              />
              <PermissionInput
                ref={permissionRef}
                title="World Permissions"
                isOpen={isWorldPermissionsOpen}
                openHandler={() => setIsWorldPermissionsOpen(true)}
                values={{
                  read: formDetails.worldPermissions.read,
                  write: formDetails.worldPermissions.write,
                  execute: formDetails.worldPermissions.execute,
                }}
                permissionsText={formDetails.worldPermissionsText}
              />
            </div>
          )}

          <div className="create-group-modal__creation-date">
            <MuiDateTimePicker
              label="Creation Date"
              value={formDetails.creationDate}
              additionalDateTimerPickerProps={{
                onChange: (date) => handleCreationDateChange(date),
              }}
            />
          </div>

          {!isUpdateModal && (
            <div className="create-group-modal__searchable">
              <MuiSwitch
                checked={formDetails.searchable}
                additionalProps={{
                  onChange: () =>
                    setFormDetails((prev) => ({
                      ...prev,
                      searchable: Number(!prev.searchable),
                    })),
                }}
              />

              <p className="create-group-modal__searchable-text">Searchable</p>
            </div>
          )}

          {isSaving && (
            <div className="create-group-modal__loader">
              <CircularProgress />
            </div>
          )}
          <div className="create-group-modal__action-buttons">
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
        </Box>
      </div>
    </MuiModal>
  );
}

export default memo(CreateTodoGroupModal);
