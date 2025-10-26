export function formatDateTime(ts){
    const d = new Date(ts);
    const date = d.toLocaleDateString("en-US", { month:"short", day:"2-digit", year:"numeric" }); // "Oct 25, 2024"
    const time = d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", hour12:false }); // "17:30"
    return { date, time };
}
