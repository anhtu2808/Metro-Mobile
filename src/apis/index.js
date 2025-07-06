import api from "../services/api.js";
import axios from "axios";
import { API_ROOT } from "../utils/constants.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Login & Logout API
export const fectchLoginAPI = async (data) => {
  const res = await api.post("/v1/auth/login", data);
  return res.data;
};

export const fetchLogoutAPI = async () => {
  const res = await api.post("/v1/auth/logout", {
    token: AsyncStorage.getItem("accessToken"),
  });
  return res.data;
};

export const fetchLoginGoogleAPI = async (data) => {
  const res = await api.post("/v1/auth/oauth/google", data);
  return res.data;
};

//Register API
export const createRegisterAPI = async (data) => {
  const res = await api.post("/v1/users/register", data);
  return res.data;
};

//User API
export const readInfoAPI = async () => {
  const res = await api.get("/v1/users/my-info");
  return res.data;
};

//Line API
export const readLinesAPI = async () => {
  const res = await api.get("/v1/lines?page=1&size=10&sort=id");
  return res.data;
};

export const readStartStationsByLineIdAPI = async (lineId) => {
  const res = await api.get(`/v1/lines/${lineId}/start-stations`);
  return res.data;
};

export const readEndStationByLineIdStationIdAPI = async (
  lineId,
  startStationId
) => {
  const res = await api.get(
    `/v1/lines/${lineId}/start-stations/${startStationId}`
  );
  return res.data;
};

//Station API
export const readStationsAPI = async () => {
  const res = await api.get(`/v1/stations?page=1&size=10&sort=id`);
  return res.data;
};

//Bus API
export const readBusByStationAPI = async (stationId) => {
  const res = await api.get(
    `/v1/bus-routes/${stationId}/station?page=1&size=10&sort=id`
  );
  return res.data;
};

//Content API
export const readContentAPI = async (content) => {
  const res = await api.get(
    `/v1/contents/by-type?type=${content}&page=0&size=10`
  );
  return res.data;
};

export const createUploadImageAPI = async (image) => {
  const res = await api.post("/v1/uploads/users", image);
  return res.data;
};
