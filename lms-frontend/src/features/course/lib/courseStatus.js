//Trạng thái của Courses

export const statusMap = {
    1: "teaching",
    0: "finished",
    2: "upcoming",
    3: "canceled"
};

export const statusLabelMap = {
    teaching: "Teaching",
    finished: "Finished",
    upcoming: "Upcoming",
    canceled: "Canceled"
};

export const statusSeverityMap = {
    teaching: "success",
    upcoming: "warning",
    finished: "secondary",
    canceled: "danger"
};
