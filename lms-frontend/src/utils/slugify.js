// hàm chuyển đổi title thành slug:

export function toSlug(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')   // loại bỏ dấu tiếng Việt
        .replace(/[^a-z0-9 ]/g, '')        // loại bỏ ký tự đặc biệt
        .replace(/\s+/g, '-')              // chuyển khoảng trắng thành dấu gạch ngang
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');          // loại bỏ dấu - ở đầu hoặc cuối
}
