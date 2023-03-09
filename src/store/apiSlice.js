import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

import { baseURL } from "assets/strings/Strings";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, body, params, headers }) => {
    try {
      axios.interceptors.response.use(function (response) {
        if (response.status === 401) {
          localStorage.removeItem("user-info-token");
          window.location.reload();
        }

        return response;
      });

      const result = await axios({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: `${baseURL}/api/xjour-app/rest/`,
  }),
  tagTypes: ["Destination", "Note"],
  endpoints: () => ({}),
});
