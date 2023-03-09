import axios from "axios";

function getAxiosClient(apiType) {
  const apiTypesURL = {
    todoGroups: `/api/xjour-app/rest/todoGroups`,
    todoItems: `/api/xjour-app/rest/todoGroupItems`,
  };

  const baseURL =
    "https://xjour-dev.malta1896.startdedicated.de" + apiTypesURL[apiType];

  const axiosClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return axiosClient;
}

const getConfig = (params) => {
  return {
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  };
};

export { getConfig };
export default getAxiosClient;
