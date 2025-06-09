import api from "../services/api.js";
import axios from "axios";
import { API_ROOT } from "../utils/constants.js";

//Login & Logout API
export const readLoginAPI = (data) => {
  return api.post("/v1/auth/login", data);
};

//Register API
export const readRegisterAPI = (data) => {
  return api.post("/v1/users/register", data);
};
