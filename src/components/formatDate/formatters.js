// Hàm định dạng ngày tháng cho dễ đọc
export const formatDate = (dateString) => {
  if (!dateString) return "Mới đây";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
