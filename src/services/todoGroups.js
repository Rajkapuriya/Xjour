import getAxiosClient, { getConfig } from "./axiosClient";

const axiosClient = getAxiosClient("todoGroups");

class TodoGroupsService {
  retrieveTodoGroupList(config) {
    return axiosClient.get(`/current`, getConfig({ token: config.token }));
  }

  createTodoGroup(config, data) {
    return axiosClient.post(
      `/create`,
      data,
      getConfig({ token: config.token })
    );
  }

  updateTodoGroup(config, data) {
    return axiosClient.put(`/update`, data, getConfig({ token: config.token }));
  }

  deleteTodoGroup(config, todoGroupKey, variant = 1) {
    return axiosClient.delete(
      `/delete/${todoGroupKey}/${variant}`,
      getConfig({ token: config.token })
    );
  }
}

export default new TodoGroupsService();
