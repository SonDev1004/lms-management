export function classifyReminder(text) {
    if (!text) return "normal";
    const t = text.toLowerCase();
    if (/(hoàn thành|nộp|deadline|bài thi|gấp|urgent|submit|due)/i.test(t)) return "urgent";
    if (/(chuẩn bị|prepare|presentation|agenda)/i.test(t)) return "prepare";
    if (/(ôn tập|ôn|review|practice|luyện)/i.test(t)) return "review";
    return "normal";
}
export const reminderIcons = {
    urgent:  { emoji: "⏰", label: "Deadline" },
    prepare: { emoji: "📝", label: "Chuẩn bị" },
    review:  { emoji: "📖", label: "Ôn tập" },
    normal:  { emoji: "🔔", label: "Nhắc" },
};