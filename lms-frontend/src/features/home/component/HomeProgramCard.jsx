import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { resolveProgramImage } from "@/features/program/utils/resolveProgramImage";
import "../styles/home-program-card.css"
const FALLBACK_IMG = "/noimg.png";

// fallback theo id: /img/programs/p-1.jpg... (nếu bạn có sẵn bộ ảnh)
function programFallbackById(id, count = 10) {
    const n = Number(id) || 1;
    const idx = (n % count) + 1;
    return `/img/programs/p-${idx}.jpg`;
}

export default function HomeProgramCard({ program }) {
    const nav = useNavigate();

    const imgResolved = resolveProgramImage(program);

    const img =
        !imgResolved || imgResolved === FALLBACK_IMG || imgResolved.endsWith(FALLBACK_IMG)
            ? programFallbackById(program?.id) || FALLBACK_IMG
            : imgResolved;


    return (
        <div className="home-program-card">
            <div className="home-program-card__img">
                <img
                    src={img}
                    alt={program.title}
                    loading="lazy"
                    onError={(e) => {
                        if (!e.currentTarget.src.endsWith(FALLBACK_IMG)) {
                            e.currentTarget.src = programFallbackById(program?.id) || FALLBACK_IMG;
                        }
                    }}
                />
            </div>

            <div className="home-program-card__body">
                <h4>{program.title}</h4>
                <p>{program.description || "Explore this learning program"}</p>

                <Button
                    label="View details"
                    size="small"
                    text
                    onClick={() => nav(`/programs/${program.id}`)}
                />
            </div>
        </div>
    );
}
