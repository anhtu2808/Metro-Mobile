// Đọc biến môi trường từ Expo
export const API_ROOT = process.env.EXPO_PUBLIC_API_ROOT;
export const INTERNAL_SECRET = process.env.EXPO_PUBLIC_INTERNAL_SECRET; 
//export const INTERNAL_SECRET = "5jE!b2X9pLz@MvRgnt9Vg*@"; // Thay thế bằng giá trị thực tế nếu cần
// Bạn có thể thêm một giá trị mặc định phòng trường hợp biến không được set
// export const API_ROOT = process.env.EXPO_PUBLIC_API_ROOT || "http://localhost:3000/api";
