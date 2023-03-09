import getAxiosClient, { getConfig } from "./axiosClient";

const axiosClient = getAxiosClient("todoItems");

class TodoItemsService {
  readTodoItems(config, todoGroupKey) {
    return axiosClient.get(
      `/read/${todoGroupKey}`,
      getConfig({ token: config.token })
    );
  }

  createTodoItem(config, data) {
    return axiosClient.post(
      `/create`,
      data,
      getConfig({ token: config.token })
    );
  }

  updateTodoItem(config, data) {
    return axiosClient.put(`/update`, data, getConfig({ token: config.token }));
  }

  updateTodoItemPosition(config, todoItemKey, movePosition = "+1") {
    return axiosClient.put(
      `/reposition/${todoItemKey}/${movePosition}`,
      null,
      getConfig({ token: config.token })
    );
  }

  deleteTodoItem(config, todoItemKey) {
    return axiosClient.delete(
      `/delete/${todoItemKey}`,
      getConfig({ token: config.token })
    );
  }
}

export default new TodoItemsService();
