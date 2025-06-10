import api from "../services/api.js";
import axios from "axios";
import { API_ROOT } from "../utils/constants.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Login & Logout API
export const readLoginAPI = async (data) => {
  const res = await api.post("/v1/auth/login", data);
  return res.data;
};

export const readLogoutAPI = async () => {
  const res = await api.post("/v1/auth/logout", {
    token: AsyncStorage.getItem("accessToken"),
  });
  return res.data;
};

//Register API
export const readRegisterAPI = async (data) => {
  const res = await api.post("/v1/users/register", data);
  return res.data;
};

//User API
export const readInfoAPI = async () => {
  const res = await api.get("/v1/users/my-info");
  return res.data;
};
