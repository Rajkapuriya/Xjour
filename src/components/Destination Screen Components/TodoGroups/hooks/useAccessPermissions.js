import { useReducer } from "react";

import { permissionsModuloFactors } from "../../../../assets/constants/Contants";

export default function useAccessPermissions(accessCode) {
  const isPermissionSet = (permissionCode, moduloFactor) => {
    return permissionCode % moduloFactor === 0;
  };

  const permissionsInitState = {
    group: {
      read: isPermissionSet(accessCode, permissionsModuloFactors.group.read),
      write: isPermissionSet(accessCode, permissionsModuloFactors.group.write),
      execute: isPermissionSet(
        accessCode,
        permissionsModuloFactors.group.execute
      ),
    },
    user: {
      read: isPermissionSet(accessCode, permissionsModuloFactors.user.read),
      write: isPermissionSet(accessCode, permissionsModuloFactors.user.write),
      execute: isPermissionSet(
        accessCode,
        permissionsModuloFactors.user.execute
      ),
    },
    other: {
      read: isPermissionSet(accessCode, permissionsModuloFactors.other.read),
      write: isPermissionSet(accessCode, permissionsModuloFactors.other.write),
      execute: isPermissionSet(
        accessCode,
        permissionsModuloFactors.other.execute
      ),
    },
  };

  const [permissions, dispatchPermissions] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "GROUP_READ":
          return {
            ...state,
            group: {
              ...state.group,
              read: !state.group.read,
            },
          };
        case "GROUP_WRITE":
          return {
            ...state,
            group: {
              ...state.group,
              write: !state.group.write,
            },
          };
        case "GROUP_EXECUTE":
          return {
            ...state,
            group: {
              ...state.group,
              execute: !state.group.execute,
            },
          };
        case "USER_READ":
          return {
            ...state,
            user: {
              ...state.user,
              read: !state.user.read,
            },
          };
        case "USER_WRITE":
          return {
            ...state,
            user: {
              ...state.user,
              write: !state.user.write,
            },
          };
        case "USER_EXECUTE":
          return {
            ...state,
            user: {
              ...state.user,
              execute: !state.user.execute,
            },
          };
        case "OTHER_READ":
          return {
            ...state,
            other: {
              ...state.other,
              read: !state.other.read,
            },
          };
        case "OTHER_WRITE":
          return {
            ...state,
            other: {
              ...state.other,
              write: !state.other.write,
            },
          };
        case "OTHER_EXECUTE":
          return {
            ...state,
            other: {
              ...state.other,
              execute: !state.other.execute,
            },
          };
        case "SET_MULTIPLE":
          return {
            ...state,
            ...action.payload,
          };
        default:
          throw new Error("Invalid Action type for permissions.");
      }
    },
    { ...permissionsInitState }
  );

  return [permissions, dispatchPermissions];
}
