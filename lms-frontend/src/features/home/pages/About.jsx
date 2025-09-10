import React from 'react';
import { Card } from 'primereact/card';

const About = () => {
    return (
        <div className="px-3 py-4 max-w-6xl mx-auto">
            <Card className="mb-4">
                <h2 className="m-0">Về EduCenter</h2>
                <p className="mt-3 text-700 line-height-3">
                    EduCenter là nền tảng học tập dành cho mọi lứa tuổi, tập trung vào hiệu quả và trải nghiệm.
                    Chúng tôi cung cấp các chương trình Frontend, IELTS và Data Fundamentals với lộ trình rõ ràng.
                </p>
            </Card>

            <div className="grid">
                <div className="col-12 md:col-6">
                    <Card title="Sứ mệnh" className="h-full">
                        <p className="m-0 text-700 line-height-3">
                            Trao quyền cho người học phát triển kỹ năng thực tế thông qua chương trình tinh gọn và mentor kèm cặp.
                        </p>
                    </Card>
                </div>
                <div className="col-12 md:col-6">
                    <Card title="Giá trị cốt lõi" className="h-full">
                        <ul className="m-0 pl-3 text-700 line-height-3">
                            <li>Tập trung kết quả</li>
                            <li>Minh bạch học phí</li>
                            <li>Liên tục cải tiến</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default About;
