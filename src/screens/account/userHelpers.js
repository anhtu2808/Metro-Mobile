import { updateUserAPI } from "../../apis";
import { loginSuccess } from "../../store/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

// Hàm cập nhật user, truyền vào userId, data, dispatch, accessToken
export const handleUpdateUser = async ({
  userId,
  data,
  dispatch,
  accessToken,
  onSuccess,
  onError,
}) => {
  try {
    // Thêm header Authorization nếu API cần 
    console.log("userrrrrrrrrr", userId);
    console.log("dataaaaaaaaa", data);
    const res = await api.put(`/v1/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.data.code === 200 && res.data.result) {
      await AsyncStorage.setItem("user", JSON.stringify(res.data.result));
      dispatch(
        loginSuccess({
          user: res.data.result,
          accessToken,
        })
      );
      if (onSuccess) onSuccess(res.data.result);
      return true;
    } else {
      if (onError) onError(res.data);
      return false;
    }
  } catch (e) {
    if (onError) onError(e);
    return false;
  }
};

export const uploadImageToServer = async (uri) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  });
  const token = await AsyncStorage.getItem("accessToken");
  const uploadRes = await api.post("/v1/uploads/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  if (uploadRes?.data?.code === 200 && uploadRes.data.result) {
    return uploadRes.data.result;
  }
  throw new Error("Upload ảnh thất bại");
};

export const handleVerifyUser = async ({
  userId,
  data,
  dispatch,
  accessToken,
  onSuccess,
  onError,
}) => {
  try {
    // Thêm header Authorization nếu API cần 
    console.log("userrrrrrrrrr", userId);
    console.log("dataaaaaaaaa", data);
    const res = await api.put(`/v1/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.data.code === 200 && res.data.result) {
      await AsyncStorage.setItem("user", JSON.stringify(res.data.result));
      dispatch(
        loginSuccess({
          user: res.data.result,
          accessToken,
        })
      );
      if (onSuccess) onSuccess(res.data.result);
      return true;
    } else {
      if (onError) onError(res.data);
      return false;
    }
  } catch (e) {
    if (onError) onError(e);
    return false;
  }
};
