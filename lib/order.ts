export function getStatusMessage(status: string): string {
  switch (status) {
    case "pending":
      return "Khởi tạo đơn hàng";
    case "confirmed":
      return "Đơn hàng được xác nhận";
    case "delivering":
      return "Đơn hàng đang được giao";
    case "completed":
      return "Đơn hàng giao thành công";
    case "canceled":
      return "Đơn hàng bị hủy";
    default:
      return "Trạng thái chưa xác định";
  }
}

export function getStatusStyle(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "confirmed":
      return "bg-blue-100 text-blue-700";

    case "delivering":
      return "bg-purple-100 text-purple-700";

    case "completed":
      return "bg-green-100 text-green-700";

    case "canceled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}
