export const formatNumber = (n) =>
    typeof n === "number" ? n.toLocaleString() : n;

export const percent = (used, total) =>
    total === 0 ? 0 : Math.round((used / total) * 100);

export const toneToClass = (tone) => {
    switch (tone) {
        case "positive":
        case "ok":
            return "exb-badge exb-badge--ok";
        case "negative":
        case "error":
            return "exb-badge exb-badge--bad";
        case "warn":
            return "exb-badge exb-badge--warn";
        default:
            return "exb-badge";
    }
};
