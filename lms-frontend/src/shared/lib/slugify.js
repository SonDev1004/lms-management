// utils/slugify.js
export function toSlug(str = "") {
  return (
    String(str)
      .normalize("NFD") // tách dấu
      .replace(/\p{Diacritic}/gu, "") // bỏ toàn bộ dấu (cần flag u)
      .replace(/đ/gi, "d") // quan trọng: đ/Đ -> d
      .toLowerCase()
      // nếu muốn giữ sẵn dấu gạch đang có trong tiêu đề, cho phép "-" ở đây:
      .replace(/[^a-z0-9\s-]/g, "") // chỉ giữ chữ, số, khoảng trắng, dấu gạch
      .replace(/\s+/g, "-") // space -> -
      .replace(/-+/g, "-") // gộp nhiều - liên tiếp
      .replace(/^-+|-+$/g, "")
  ); // bỏ - đầu/cuối
}
