import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const posts = [
    {
        id: 1,
        title: 'Lộ trình Frontend cho người mới (2025)',
        excerpt: 'HTML/CSS/JS — nên bắt đầu từ đâu, học gì trước, học gì sau?',
        cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Mẹo tăng Listening IELTS nhanh',
        excerpt: 'Các kỹ thuật “shadowing”, “dictation” và lựa chọn nguồn nghe phù hợp.',
        cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'Nhập môn phân tích dữ liệu',
        excerpt: 'Hiểu data pipeline, thao tác dữ liệu và trực quan hoá cơ bản.',
        cover: 'https://images.unsplash.com/photo-1534759846116-57968a6b17f4?q=80&w=1200&auto=format&fit=crop'
    }
];

const Blog = () => {
    return (
        <div className="px-3 py-4 max-w-6xl mx-auto">
            <h2 className="m-0 mb-3">Blog</h2>
            <div className="grid">
                {posts.map(p => (
                    <div className="col-12 md:col-4" key={p.id}>
                        <Card className="h-full">
                            <img src={p.cover} alt={p.title} className="w-full h-12rem object-cover border-round mb-3" loading="lazy" />
                            <h4 className="m-0">{p.title}</h4>
                            <p className="mt-2 text-700">{p.excerpt}</p>
                            <Button
                                label="Xem chi tiết"
                                icon="pi pi-arrow-right"
                                onClick={() => alert('Demo – thêm trang bài viết chi tiết sau')}
                            />
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
