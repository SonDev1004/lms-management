import React from "react";
import {Toast} from "primereact/toast";
import useProgramDetail from "../hook/useProgramDetail.js";

import ProgramHero from "../components/ProgramHero";
import ProgramTracks from "../components/ProgramTracks";

const ProgramDetail = () => {
    const {
        program, loading, error, toastRef,
        onConsult, onRegisterTrack, onSelectCourse, loadCoursesByTrack, goBack,
    } = useProgramDetail();

    if (loading) {
        return (
            <div className="flex flex-column align-items-center justify-content-center p-6">
                <Toast ref={toastRef}/>
                <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"/>
                <span className="text-lg">Đang tải chương trình...</span>
            </div>
        );
    }


    if (error || !program) {
        return (
            <div className="text-center p-6">
                <Toast ref={toastRef}/>
                <h3 className="mb-3">{error || "Không có dữ liệu chương trình"}</h3>
                <button className="p-button" onClick={goBack}>
                    <i className="pi pi-arrow-left mr-2"/>
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <section className="p-4">
            <Toast ref={toastRef}/>

            {/* Container trung tâm, rộng “đủ đẹp” cho layout 2 cột */}
            <div className="max-w-6xl mx-auto">

                {/* Action bar tối giản */}
                <div className="flex align-items-center justify-content-between mb-3">
                    <button className="p-button p-button-text" onClick={goBack}>
                        <i className="pi pi-arrow-left mr-2"/>
                        Quay lại
                    </button>
                </div>

                {/* ROW: HERO (trái) + TRACKS (phải) */}
                <div className="grid md:align-start md:gap-3">
                    {/* Cột trái: Hero lớn, nổi bật */}
                    <div className="col-12 md:col-8">
                        <ProgramHero program={program} onConsult={onConsult}/>
                    </div>

                    {/* Cột phải: Tracks sticky để CTA luôn hiện */}
                    <aside className="col-12 md:col-4">
                        <div className="md:sticky md:top-3">
                            <ProgramTracks
                                tracks={program.tracks}
                                subjects={program.subjects}
                                loadCourses={loadCoursesByTrack}
                                onRegisterTrack={onRegisterTrack}
                                onSelectCourse={onSelectCourse}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default ProgramDetail;
