import "../styles/FeedbackFilter.css";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const RATINGS = ["All Ratings", "5★", "4★+", "3★+", "2★+"].map(v => ({ label: v, value: v }));

export default function FeedbackFilter({ value, onChange, onSearch, onClear }) {
    return (
        <>
            <div className="fb-filter--search">
        <span className="p-input-icon-left fb-filter__search">
          <i className="pi pi-search" />
          <InputText
              value={value.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="Search feedback, names, or courses..."
          />
        </span>
            </div>

            {/* CHỈ Course & Rating */}
            <div className="fb-filter-row">
                <div className="fb-filter__label">Filters:</div>

                {/* Course */}
                <div className="fb-dd fb-dd--course">
                    <Dropdown
                        options={value.courses || [{ label: "All Courses", value: "All" }]}
                        value={value.course || "All"}
                        onChange={(e) => onChange({ course: e.value, page: 0 })}
                    />
                </div>

                {/* Rating */}
                <div className="fb-dd fb-dd--rating">
                    <Dropdown
                        options={RATINGS}
                        value={value.rating || "All Ratings"}
                        onChange={(e) => onChange({ rating: e.value, page: 0 })}
                    />
                </div>

                <Button label="Apply" className="fb-apply" onClick={onSearch} />
                <button type="button" className="fb-clear" onClick={onClear}>Clear All</button>
            </div>
        </>
    );
}
