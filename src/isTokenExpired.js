import jwtDecode from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true; // Không có exp coi như hết hạn
    const expiryTime = decoded.exp * 1000; // exp là timestamp giây, đổi ra ms
    return Date.now() > expiryTime;
  } catch (e) {
    return true; // Lỗi decode coi như hết hạn
  }
};
