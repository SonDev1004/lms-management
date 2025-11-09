export const buildMonthSeries = (monthLabel) => {
    const seed = monthLabel.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
    const rnd = (i) => (Math.sin(i+seed)*10000)%1;
    return Array.from({length:30}).map((_,i)=>({
        day: i+1,
        revenue: Math.max(0, Math.round((rnd(i+1)+.2)*1_000_000* (i%7===0? 16 : 6)))
    }));
};

const METHODS = ["Cash","Credit Card","Bank Transfer"];
const BANKS   = ["TCB","MB","BIDV","VIB","VCB","SHB","VTB"];
const SUBJECTS = [
    ["Engineering","Statistics"],
    ["Business Administration","Finance"],
    ["Mathematics","Programming"],
    ["Physics","Statistics"],
    ["Mathematics","Calculus"],
];

export function buildTransactions(count=50){
    const list = [];
    for(let i=0;i<count;i++){
        const d = 30 - (i%30);
        const [program,subject] = SUBJECTS[i%SUBJECTS.length];
        const amount = Math.round((2_000_000 + (i%9)*413_000) * (1 + (i%5)*0.12));
        const status = i%7===3? "Failed" : "Success";
        const method = METHODS[i%METHODS.length];
        const bank   = BANKS[i%BANKS.length];
        list.push({
            id: i+1,
            date: `2025-11-${String(d).padStart(2,'0')}`,
            student: `${["Vu","Nguyen","Tran","Pham","Bui","Hoang"][i%6]} ${["Van","Thi","Duc","Mai","Hoa","Thu"][i%6]} ${["A","B","C","D","E","F"][i%6]}`,
            code: `ST${50000+i}`,
            program, subject,
            amount, method, bank,
            tranNo: `TXN${Date.now().toString().slice(-7)}${5300+i}`,
            status,
            orderInfo:`Tuition payment for ${program} - ${subject}`
        })
    }
    return list;
}
