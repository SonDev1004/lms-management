export async function fetchEnrollments() {
    const base = [
        {
            id:1000, name:'Do Thi J', email:'do.thi.j@example.com', phone:'0985851681',
            program:'TOEIC Fast-track', course:'TOEIC 800+ Target', payStatus:'Paid', payMethod:'Cash',
            enrollStatus:'Pending', applied:'2025-10-20T11:04:00Z'
        },
        {
            id:1001, name:'Dang Minh G', email:'dang.minh.g@example.com', phone:'0912285598',
            program:'Academic Writing', course:'IELTS 6.0 Booster', payStatus:'Unpaid', payMethod:'Credit_card',
            enrollStatus:'Pending', applied:'2025-11-09T04:18:00Z'
        },
        { id:1002, name:'Hoang Van E', email:'hoang.van.e@example.com', phone:'0927173493',
            program:'Academic Writing', course:'Grammar A1', payStatus:'Unpaid', payMethod:'Cash',
            enrollStatus:'Pending', applied:'2025-10-28T20:06:00Z'
        },
        { id:1003, name:'Bui Thu H', email:'bui.thu.h@example.com', phone:'0904444936',
            program:'Academic Writing', course:'Grammar A1', payStatus:'Refunded', payMethod:'Bank_transfer',
            enrollStatus:'Pending', applied:'2025-10-30T04:55:00Z'
        },
        { id:1004, name:'Hoang Van E', email:'hoang.van.e@example.com', phone:'0955827529',
            program:'TOEIC Fast-track', course:'Grammar A1', payStatus:'Paid', payMethod:'Bank_transfer',
            enrollStatus:'Pending', applied:'2025-11-06T08:54:00Z'
        },
        { id:1005, name:'Dang Minh G', email:'dang.minh.g@example.com', phone:'0945610471',
            program:'Business English', course:'Business Communication', payStatus:'Refunded', payMethod:'Cash',
            enrollStatus:'Pending', applied:'2025-11-02T16:54:00Z'
        },
        { id:1006, name:'Do Thi J', email:'do.thi.j@example.com', phone:'0908398167',
            program:'Academic Writing', course:'IELTS 6.0 Booster', payStatus:'Refunded', payMethod:'Credit_card',
            enrollStatus:'Pending', applied:'2025-10-18T13:33:00Z'
        },
        { id:1007, name:'Tran Thi B', email:'tran.thi.b@example.com', phone:'0977284919',
            program:'TOEIC Fast-track', course:'TOEIC 800+ Target', payStatus:'Partial', payMethod:'Credit_card',
            enrollStatus:'Pending', applied:'2025-10-26T12:09:00Z'
        },
    ];

    const more = [...base];
    while (more.length < 21) more.push({ ...base[(more.length)%base.length], id:1000 + more.length });
    return new Promise(res => setTimeout(()=>res(more), 250));
}
