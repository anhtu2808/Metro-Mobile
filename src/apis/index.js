import api from "../services/api.js";
import axios from "axios";
import { API_ROOT } from "../utils/constants.js";

//Register API
export const readRegisterAPI = (data) => {
  return api.post("/v1/users/register", data);
};
