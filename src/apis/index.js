import api from "../services/api.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { INTERNAL_SECRET } from "../utils/constants.js";

/////USER SERVICE
//Authentication-Controller
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

export const createForgotPasswordAPI = async (data) => {
  const res = await api.post("/v1/auth/forgot-password", data);
  return res.data;
}

export const createResetPasswordAPI = async (data) => {
  const res = await api.post("/v1/auth/reset-password", data);
  return res.data;
}

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

export const updateUserAPI = async (userId, data) => {
  const res = await api.put(`/v1/users/${userId}`, data);
  return res.data;
};

//Student verification
export const createVerificationStudentAPI = async (data) => {
  const res = await api.post("/v1/student-verifications", data);
  return res.data;
}

/////ROUTE SERVICE
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
  const res = await api.get("/v1/stations?page=1&size=10&sort=id");
  return res.data;
};

//Bus API
export const readBusByStationAPI = async (stationId) => {
  const res = await api.get(
    `/v1/bus-routes?stationId=${stationId}&page=1&size=10&sort=id`
  );
  return res.data;
};

/////CONTENT SERVICE
//Content API
export const readContentAPI = async (content) => {
  const res = await api.get(
    `/v1/contents/by-type?type=${content}&page=1&size=10`
  );
  return res.data;
};

//API NÀY ĐỂ UPLOAD ẢNH LÊN AWS ĐỂ NÓ GỬI VỀ CHO MÌNH 1 CÁI URL https mới hiện được ảnh onl
export const createUploadImageAPI = async (image) => {
  const res = await api.post("/v1/uploads/users", image);
  return res.data;
};

/////ORDER SERVICE
//ticket-order API
export const createTicketOrderAPI = async (data) => {
  const res = await api.post("/v1/ticket-orders", data);
  return res.data;
};

//ticket order all
export const updateStatusActiveTicketOrderAPI = async (orderId, status) => {
  const token = await AsyncStorage.getItem("accessToken");
  const res = await api.put(
    `/v1/ticket-orders/${orderId}/status?status=${status}`,
    {},
    {
      headers: {
        "X-INTERNAL-SECRET": INTERNAL_SECRET,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("API response status:", res.status);
  return res.status; // Trả về status HTTP
};

export const readTicketOrderByIdAPI = async (orderId) => {
  const res = await api.get(`/v1/ticket-orders/${orderId}`);
  return res.data;
};

//ticket-order by dynamic parameters
export const getTicketOrdersAPI = async (params) => {
  const queryParams = new URLSearchParams();

  // Set default page and size if not provided
  if (params.page !== undefined) queryParams.append("page", params.page);
  if (params.size !== undefined) queryParams.append("size", params.size);

  // Optional filters
  if (params.userId !== undefined) queryParams.append("userId", params.userId);
  if (params.isStatic !== undefined)
    queryParams.append("isStatic", params.isStatic);
  if (params.isStudent !== undefined)
    queryParams.append("isStudent", params.isStudent);
  if (params.status !== undefined && params.status !== "")
    queryParams.append("status", params.status);

  const res = await api.get(`/v1/ticket-orders?${queryParams.toString()}`);
  return res.data;
};

//adjustment fare
export const createAdjustmentFare = async (ticketOrderId, newEndStationId) => {
  const res = await api.post(
    `/v1/ticket-orders/${ticketOrderId}/adjust-fare?newEndStationId=${newEndStationId}`
  );
  return res.data;
};


/////TICKET SERVICE
//ticket
export const readTicketTypeAPI = async () => {
  const res = await api.get("/v1/ticket-types?page=1&size=10&sort=id");
  return res.data;
};

/////PAYMENT SERVICE
export const createPaymentAPI = async (orderId) => {
  const res = await api.get(
    `/v1/payments/vn-pay?ticketOrderId=${orderId}&bankCode=NCB`
  );
  return res.data.data.paymentUrl;
};

export const readTransactionAPI = async (userId ) => {
  const res = await api.get(`/v1/transactions/user/${userId}?page=0&size=10`);
  return res.data;
}
