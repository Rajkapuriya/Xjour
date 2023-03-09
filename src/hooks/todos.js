import { useQuery } from "react-query";

import TodoGroupService from "../services/todoGroups";
import TodoGroupItemsService from "../services/todoItems";

const fetchTodoGroups = ({ queryKey }) => {
  const config = queryKey[1];
  return TodoGroupService.retrieveTodoGroupList({ token: config.token });
};

const fetchTodoGroupItems = ({ queryKey }) => {
  const todoGroupKey = queryKey[1];
  console.log("%ctodoGroupKey:", "background-color:yellow;", todoGroupKey);

  return TodoGroupItemsService.readTodoItems(todoGroupKey);
};

export function useTodoGroups(config) {
  return useQuery(["todo-groups", config], fetchTodoGroups, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    enabled: true,
    notifyOnChangeProps: "tracked",
  });
}

export function useTodoGroupItems(todoGroupKey) {
  return useQuery(["todo-group-items", todoGroupKey], fetchTodoGroupItems, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    enabled: false,
    notifyOnChangeProps: "tracked",
  });
}
