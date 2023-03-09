import { useMemo, useState } from "react";
import { useAlert } from "react-alert";

import "./TodoItemAccessModal.css";

import { permissionsModuloFactors } from "../../../../assets/constants/Contants";

import { useStateValue } from "../../../../config/context api/StateProvider";

import useAccessPermissions from "../hooks/useAccessPermissions";

import TodoItemsService from "../../../../services/todoItems";

import { CircularProgress } from "@mui/material";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CreateIcon from "@mui/icons-material/Create";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

import MuiModal from "../../../Atoms/MuiModal/MuiModal";
import Button from "../../../Atoms/Button/Button";

import { MuiSwitch } from "../../../MuiComponents/MuiComponents";

export default function TodoItemAccessModal(props) {
  const {
    isOpen,
    handleModalToggle,
    todoItem,
    fetchTodoGroupItems,
    todoGroupKey,
  } = props;
  console.log(
    "%ctodoItemAccessModal props:",
    "background-color:deeppink;",
    props
  );

  const [{ userToken }] = useStateValue();

  const todoItemPermissionCode = todoItem.acl;
  const [permissions, dispatchPermissions] = useAccessPermissions(
    todoItemPermissionCode
  );

  const customAlert = useAlert();

  const [isSaving, setIsSaving] = useState(false);

  const handlePermissionsChange = (actionType) => {
    dispatchPermissions({ type: actionType });
  };

  const permissionsTypes = useMemo(() => {
    return {
      groupPermissions: [
        {
          name: "Read",
          icon: <MarkEmailReadIcon />,
          checked: permissions.group.read,
          toggleActionName: "GROUP_READ",
        },
        {
          name: "Write",
          icon: <CreateIcon />,
          checked: permissions.group.write,
          toggleActionName: "GROUP_WRITE",
        },
        {
          name: "Execute",
          icon: <SettingsApplicationsIcon />,
          checked: permissions.group.execute,
          toggleActionName: "GROUP_EXECUTE",
        },
      ],
      membersPermissions: [
        {
          name: "Read",
          icon: <MarkEmailReadIcon />,
          checked: permissions.user.read,
          toggleActionName: "USER_READ",
        },
        {
          name: "Write",
          icon: <CreateIcon />,
          checked: permissions.user.write,
          toggleActionName: "USER_WRITE",
        },
        {
          name: "Execute",
          icon: <SettingsApplicationsIcon />,
          checked: permissions.user.execute,
          toggleActionName: "USER_EXECUTE",
        },
      ],
      worldPermissions: [
        {
          name: "Read",
          icon: <MarkEmailReadIcon />,
          checked: permissions.other.read,
          toggleActionName: "OTHER_READ",
        },
        {
          name: "Write",
          icon: <CreateIcon />,
          checked: permissions.other.write,
          toggleActionName: "OTHER_WRITE",
        },
        {
          name: "Execute",
          icon: <SettingsApplicationsIcon />,
          checked: permissions.other.execute,
          toggleActionName: "OTHER_EXECUTE",
        },
      ],
    };
  }, [
    permissions.group.execute,
    permissions.group.read,
    permissions.group.write,
    permissions.other.execute,
    permissions.other.read,
    permissions.other.write,
    permissions.user.execute,
    permissions.user.read,
    permissions.user.write,
  ]);

  const handleSaveClick = async () => {
    const permissionsCodes = [];

    for (const entity in permissions) {
      for (const permissionType in permissions[entity]) {
        if (permissions[entity][permissionType] === true) {
          permissionsCodes.push(
            permissionsModuloFactors[entity][permissionType]
          );
        }
      }
    }

    const aclCode =
      permissionsCodes.length > 0
        ? permissionsCodes.reduce((acc, cur) => acc * cur)
        : 0;

    console.log("%caclCode:", "background-color:deeppink;", aclCode);

    const { pk, headline, description, duedate, followup, acl } = todoItem;

    let updateObject = {
      headline,
      description,
      duedate,
      followup,
      acl: aclCode,
    };
    const prevObject = {
      headline,
      description,
      duedate,
      followup,
      acl: acl,
    };

    if (JSON.stringify(prevObject) === JSON.stringify(updateObject)) {
      return alert("No changes made!");
    }

    updateObject.pk = pk;
    console.log("%cupdateObject:", "background-color:deeppink;", updateObject);

    setIsSaving(true);

    try {
      await TodoItemsService.updateTodoItem(
        { token: userToken },
        JSON.stringify(updateObject)
      );

      customAlert.show("Todo Item's permissions updated successfully!");

      setIsSaving(false);
      fetchTodoGroupItems(todoGroupKey, true);
      handleModalToggle();
    } catch (error) {
      const errorMessage = error.message;

      alert(`Some error occurred!\n${errorMessage}`);
      setIsSaving(false);
    }
  };

  return (
    <MuiModal
      isModalOpen={isOpen}
      closeModalHandler={!isSaving ? () => handleModalToggle() : null}
      modalTitle={`Todo Item Access (${todoItem.headline})`}
      modalHeaderIcon={<AdminPanelSettingsIcon />}
    >
      <div className="todo-item-access-modal">
        <div className="todo-item-access-modal__permissions">
          <div className="todo-item-access-modal__group-permissions">
            <p className="todo-item-access-modal__group-permissions-heading">
              Group Owner&apos;s Permissions
            </p>

            <div className="todo-item-access-modal__group-permission">
              {permissionsTypes.groupPermissions.map(
                (groupPermission, groupPermissionIndex) => {
                  return (
                    <div
                      key={groupPermissionIndex}
                      className="todo-item-access-modal__group-permission-type"
                    >
                      <p className="todo-item-access-modal__group-permission-type-name">
                        {groupPermission.icon}
                        {groupPermission.name}
                      </p>
                      <MuiSwitch
                        checked={groupPermission.checked}
                        additionalProps={{
                          onChange: () =>
                            handlePermissionsChange(
                              groupPermission.toggleActionName
                            ),
                        }}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="todo-item-access-modal__group-permissions">
            <p className="todo-item-access-modal__group-permissions-heading">
              Group Members&apos; Permissions
            </p>

            <div className="todo-item-access-modal__group-permission">
              {permissionsTypes.membersPermissions.map(
                (memberPermission, memberPermissionIndex) => {
                  return (
                    <div
                      key={memberPermissionIndex}
                      className="todo-item-access-modal__group-permission-type"
                    >
                      <p className="todo-item-access-modal__group-permission-type-name">
                        {memberPermission.icon}
                        {memberPermission.name}
                      </p>
                      <MuiSwitch
                        checked={memberPermission.checked}
                        additionalProps={{
                          onChange: () =>
                            handlePermissionsChange(
                              memberPermission.toggleActionName
                            ),
                        }}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="todo-item-access-modal__group-permissions">
            <p className="todo-item-access-modal__group-permissions-heading">
              Group&apos;s World Permissions
            </p>

            <div className="todo-item-access-modal__group-permission">
              {permissionsTypes.worldPermissions.map(
                (worldPermission, worldPermissionIndex) => {
                  return (
                    <div
                      key={worldPermissionIndex}
                      className="todo-item-access-modal__group-permission-type"
                    >
                      <p className="todo-item-access-modal__group-permission-type-name">
                        {worldPermission.icon}
                        {worldPermission.name}
                      </p>
                      <MuiSwitch
                        checked={worldPermission.checked}
                        additionalProps={{
                          onChange: () =>
                            handlePermissionsChange(
                              worldPermission.toggleActionName
                            ),
                        }}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {isSaving && (
          <div className="todo-item-access-modal__loader">
            <CircularProgress />
          </div>
        )}
        <div className="todo-item-access-modal__action-buttons">
          <Button
            text="Save"
            variant="filled"
            fontSize="medium"
            onClick={() => handleSaveClick()}
            isDisabled={isSaving}
          />
          <Button
            text="Cancel"
            fontSize="medium"
            onClick={() => handleModalToggle()}
            isDisabled={isSaving}
          />
        </div>
      </div>
    </MuiModal>
  );
}
