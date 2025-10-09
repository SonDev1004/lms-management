import { Rating } from "primereact/rating";
import '../styles/RatingStars.css';
export default function RatingStars({ value, onChange, readOnly=false }) {
    return (
        <Rating value={value} onChange={(e) => onChange?.(e.value)} cancel={false} readOnly={readOnly} />
    );
}