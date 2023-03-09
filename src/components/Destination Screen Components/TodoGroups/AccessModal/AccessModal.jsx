import { useMemo, useReducer, useState } from "react";
import { useAlert } from "react-alert";

import "./AccessModal.css";

import { permissionsModuloFactors } from "../../../../assets/constants/Contants";

import { useStateValue } from "../../../../config/context api/StateProvider";

import useAccessPermissions from "../hooks/useAccessPermissions";

import TodoGroupService from "../../../../services/todoGroups";

import { MuiSwitch } from "../../../MuiComponents/MuiComponents";

import CircularProgress from "@mui/material/CircularProgress";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CreateIcon from "@mui/icons-material/Create";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

import Button from "../../../Atoms/Button/Button";
import MuiModal from "../../../Atoms/MuiModal/MuiModal";

export default function AccessModal(props) {
  const { isOpen, handleModalToggle, todoGroup, fetchTodos } = props;
  console.log("todoGroup:", todoGroup);

  const [{ userToken }] = useStateValue();

  const todoGroupPermissionCode = todoGroup.acl;
  const [permissions, dispatchPermissions] = useAccessPermissions(
    todoGroupPermissionCode
  );

  const customAlert = useAlert();

  const [isSaving, setIsSaving] = useState(false);

  console.log(
    "%cpermissions useReducer:",
    "background-color:blueviolet;",
    permissions
  );

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

  const handlePermissionsChange = (event, actionType) => {
    dispatchPermissions({ type: actionType });
  };

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

    const {
      memberStatus,
      name,
      description,
      creationDateTime,
      searchable,
      acl,
    } = todoGroup;

    let updateObject = {
      acl: aclCode,
      memberStatus: memberStatus,
      name: name,
      description: description,
      creationDateTime: creationDateTime,
      searchable: searchable,
    };
    const prevObject = {
      acl: acl,
      memberStatus: memberStatus,
      name: name,
      description: description,
      creationDateTime: creationDateTime,
      searchable: searchable,
    };

    if (JSON.stringify(prevObject) === JSON.stringify(updateObject)) {
      return alert("No changes made!");
    }

    updateObject.pk = todoGroup.pk;

    setIsSaving(true);

    try {
      await TodoGroupService.updateTodoGroup(
        { token: userToken },
        JSON.stringify(updateObject)
      );

      customAlert.show("Todo Group's permissions updated successfully!");

      setIsSaving(false);
      fetchTodos();
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
      modalTitle={`Todo Group Access (${todoGroup.name})`}
      modalHeaderIcon={<AdminPanelSettingsIcon />}
    >
      <div className="access-modal">
        <div className="access-modal__permissions">
          <div className="access-modal__group-permissions">
            <p className="access-modal__group-permissions-heading">
              Group Owner&apos;s Permissions
            </p>

            <div className="access-modal__group-permission">
              {permissionsTypes.groupPermissions.map(
                (groupPermission, groupPermissionIndex) => {
                  return (
                    <div
                      key={groupPermissionIndex}
                      className="access-modal__group-permission-type"
                    >
                      <p className="access-modal__group-permission-type-name">
                        {groupPermission.icon}
                        {groupPermission.name}
                      </p>
                      <MuiSwitch
                        checked={groupPermission.checked}
                        additionalProps={{
                          onChange: (event) =>
                            handlePermissionsChange(
                              event,
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

          <div className="access-modal__group-permissions">
            <p className="access-modal__group-permissions-heading">
              Group Members&apos; Permissions
            </p>

            <div className="access-modal__group-permission">
              {permissionsTypes.membersPermissions.map(
                (memberPermission, memberPermissionIndex) => {
                  return (
                    <div
                      key={memberPermissionIndex}
                      className="access-modal__group-permission-type"
                    >
                      <p className="access-modal__group-permission-type-name">
                        {memberPermission.icon}
                        {memberPermission.name}
                      </p>
                      <MuiSwitch
                        checked={memberPermission.checked}
                        additionalProps={{
                          onChange: (event) =>
                            handlePermissionsChange(
                              event,
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

          <div className="access-modal__group-permissions">
            <p className="access-modal__group-permissions-heading">
              Group&apos;s World Permissions
            </p>

            <div className="access-modal__group-permission">
              {permissionsTypes.worldPermissions.map(
                (worldPermission, worldPermissionIndex) => {
                  return (
                    <div
                      key={worldPermissionIndex}
                      className="access-modal__group-permission-type"
                    >
                      <p className="access-modal__group-permission-type-name">
                        {worldPermission.icon}
                        {worldPermission.name}
                      </p>
                      <MuiSwitch
                        checked={worldPermission.checked}
                        additionalProps={{
                          onChange: (event) =>
                            handlePermissionsChange(
                              event,
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
          <div className="access-modal__loader">
            <CircularProgress />
          </div>
        )}
        <div className="access-modal__action-buttons">
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
