import axios from "axios";
import { baseURL } from "../../assets/strings/Strings";


const axiosClient = axios.create({
  baseURL: baseURL,
  // withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});
// console.log(axiosClient.headers);

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log("Error Response:", error.response);

    return error.response;
  }
);

export default axiosClient;
