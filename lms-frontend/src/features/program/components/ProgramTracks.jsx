// Chọn lich học
import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const ProgramTracks = ({ tracks = [], onRegisterTrack }) => {
    if (!tracks.length) return null;

    return (
        <div className="mb-4">
            <h2 className="text-2xl font-bold mb-4">Chọn Lịch Học</h2>
            <div className="grid">
                {tracks.map((track) => (
                    <div key={track.id} className="col-12 md:col-6">
                        <Card className="h-full">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-primary">{track.label}</h3>
                                <div className="flex justify-content-center gap-2 mb-3">
                                    <Tag value={track.dow} severity="info" />
                                    <Tag value={track.time} severity="warning" />
                                </div>
                                <p className="text-lg font-semibold text-900">Khai giảng: {track.start}</p>
                            </div>

                            {/* Mini timeline */}
                            <div className="mb-4">
                                <h4 className="text-sm font-bold text-600 mb-2">Tiến độ dự kiến:</h4>
                                <div className="flex flex-column gap-2">
                                    {track.mini?.map((item, index) => (
                                        <div key={index} className="flex align-items-center gap-2">
                                            <div
                                                className={`w-2rem h-2rem border-circle flex align-items-center justify-content-center text-xs font-bold ${
                                                    index === 0 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold">{item.label}</span>
                                                <span className="text-sm text-600 ml-2">{item.range}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                label={`Đăng ký ${track.label}`}
                                icon="pi pi-shopping-cart"
                                className="w-full"
                                onClick={() => onRegisterTrack(track.id)}
                            />
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgramTracks;
