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
