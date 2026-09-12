export function formatDateVN(date: string): string {
  return new Date(date).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

export function formatPriceVN(price: number): string {
  return `${price.toLocaleString("vi-VN")}₫`;
}
