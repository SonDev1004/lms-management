import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';

const FAQ = () => {
    return (
        <div className="px-3 py-4 max-w-4xl mx-auto">
            <Card className="mb-3">
                <h2 className="m-0">Câu hỏi thường gặp</h2>
                <p className="mt-2 text-700">Những thắc mắc phổ biến về chương trình và học phí.</p>
            </Card>

            <Accordion multiple>
                <AccordionTab header="Học phí được tính như thế nào?">
                    Học phí hiển thị theo từng chương trình & gói thời lượng. Bạn có thể xem chi tiết tại trang chương trình.
                </AccordionTab>
                <AccordionTab header="Lịch học có linh hoạt không?">
                    Có. Chúng tôi có nhiều khung giờ; bạn có thể đổi lớp nếu còn chỗ trống.
                </AccordionTab>
                <AccordionTab header="Có hoàn tiền không nếu bận đột xuất?">
                    Có chính sách hoàn/đổi khoá tùy trường hợp. Liên hệ hỗ trợ để được tư vấn.
                </AccordionTab>
                <AccordionTab header="Có cấp chứng chỉ hoàn thành không?">
                    Có. Sau khi hoàn tất yêu cầu đầu ra, bạn sẽ nhận chứng nhận hoàn thành của EduCenter.
                </AccordionTab>
            </Accordion>
        </div>
    );
};

export default FAQ;
