import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginSuccess, logout } from "./store/userSlice";
import { readInfoAPI } from "./apis";
import { isTokenExpired } from "./isTokenExpired";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const userStr = await AsyncStorage.getItem("user");
        if (token && userStr) {
          if (isTokenExpired(token)) {
            // Token hết hạn => logout
            dispatch(logout());
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("user");
          } else {
          const user = JSON.parse(userStr);
          // Có thể gọi readInfoAPI để lấy user mới nhất nếu cần
          dispatch(loginSuccess({ user, accessToken: token }));
          }
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.log("Load user error:", error);
        dispatch(logout());
      }
    };
    loadUserFromStorage();
  }, [dispatch]);

  return children;
};

export default AuthLoader;
