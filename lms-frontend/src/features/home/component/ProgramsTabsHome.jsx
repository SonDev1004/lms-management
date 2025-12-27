import { TabView, TabPanel } from "primereact/tabview";
import { usePrograms } from "../hooks/usePrograms";
import HomeProgramCard from "./HomeProgramCard";
import "../styles/programs-tabs-home.css";
import { useRef, useEffect } from "react";

const TABS = ["IELTS", "TOEIC", "Junior", "Speaking", "Grammar & Vocab"];

function AutoScrollCarousel({ programs, loading }) {
    const trackRef = useRef(null);

    useEffect(() => {
        if (loading || !programs.length) return;

        const track = trackRef.current;
        if (!track) return;

        let scrollPosition = 0;
        const speed = 0.8; // pixels per frame (giảm để mượt hơn)
        let animationId;

        const animate = () => {
            scrollPosition += speed;

            // Lấy chiều rộng của một item + gap
            const itemWidth = 340; // 320px card + 20px gap
            const totalWidth = itemWidth * programs.length;

            // Reset khi scroll qua hết bộ đầu tiên
            if (scrollPosition >= totalWidth) {
                scrollPosition = 0;
            }

            if (track) {
                track.style.transform = `translateX(-${scrollPosition}px)`;
            }

            animationId = requestAnimationFrame(animate);
        };

        // Bắt đầu animation
        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [programs, loading]);

    if (loading) {
        return (
            <div className="programs-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div className="program-skeleton" key={i} />
                ))}
            </div>
        );
    }

    if (programs.length === 0) {
        return (
            <div className="programs-empty">
                No courses available yet.
            </div>
        );
    }

    // Nhân 3 lần để infinite loop
    const triplePrograms = [...programs, ...programs, ...programs];

    return (
        <div className="programs-carousel">
            <div className="programs-carousel__wrapper">
                <div className="programs-carousel__track" ref={trackRef}>
                    {triplePrograms.map((program, idx) => (
                        <div className="programs-carousel__card" key={`${program.id}-${idx}`}>
                            <HomeProgramCard program={program} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProgramsTabsHome() {
    const { loading, byCategory } = usePrograms();

    return (
        <section className="programs-home">
            <div className="programs-home__header">
                <h2 className="section-title">Our Programs</h2>
                <p className="section-subtitle">
                    Explore our comprehensive courses designed for your success
                </p>
            </div>

            <TabView className="programs-tabs">
                {TABS.map((tab) => {
                    const list = byCategory.get(tab) || [];
                    const shown = list.slice(0, 6);

                    return (
                        <TabPanel header={tab} key={tab}>
                            <AutoScrollCarousel programs={shown} loading={loading} />
                        </TabPanel>
                    );
                })}
            </TabView>
        </section>
    );
}