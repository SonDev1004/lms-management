//Trạng thái của Courses

export const statusMap = {
    1: "teaching",
    0: "finished",
    2: "upcoming",
    3: "canceled"
};

export const statusLabelMap = {
    teaching: "Đang học",
    finished: "Đã kết thúc",
    upcoming: "Sắp mở",
    canceled: "Đã huỷ"
};

export const statusSeverityMap = {
    teaching: "success",
    upcoming: "warning",
    finished: "secondary",
    canceled: "danger"
};
