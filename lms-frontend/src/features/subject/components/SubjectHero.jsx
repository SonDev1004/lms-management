import React from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";

const SubjectHero = ({ subject, onEnrollClick }) => {
    if (!subject) return null;
    const {
        title, level, audience, summary,
        rating = 4.7, reviewCount = 186,
        hero = "https://images.unsplash.com/photo-1523246191167-6f4546b14880?q=80&w=1600&auto=format&fit=crop"
    } = subject;

    return (
        <header className="sd-hero grid md:grid-cols-5 gap-4 mb-3">
            <div className="md:col-span-3">
                <img src={hero} alt="cover" className="w-full h-64 object-cover rounded-xl" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{title}</h1>

                <div className="flex flex-wrap gap-2">
                    {audience && <Tag value={audience} className="bg-blue-50 border-blue-100 text-blue-700" />}
                    {level && <Tag value={level} className="bg-emerald-50 border-emerald-100 text-emerald-700" />}
                </div>

                <div className="flex items-center gap-2">
                    <Rating value={Number(rating)} readOnly cancel={false} />
                    <span className="font-semibold">{Number(rating).toFixed(1)}</span>
                    <span className="text-600">• {reviewCount} reviews</span>
                </div>

                {summary && <p className="text-600">{summary}</p>}

                <Button
                    label="Enroll now"
                    className="p-button-primary p-button-lg"
                    onClick={onEnrollClick}
                />
            </div>
        </header>
    );
};

export default SubjectHero;
