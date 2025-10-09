import { Button } from 'primereact/button';
import StatBadge from './StatBadge';

export default function Hero({ onClickPrimary, onClickSecondary }) {
    return (
        <section className="hero">
            <div className="container hero__grid">
                <div className="hero__left">
                    <div className="hero__badges">
                        <StatBadge icon="pi pi-globe" text="Internationally Certified" />
                        <StatBadge icon="pi pi-check-circle" text="Results Guaranteed" />
                    </div>

                    <h1 className="hero__title">A clear English roadmap with measurable results</h1>
                    <p className="hero__sub">Learn smarter with a modern platform and methodology</p>

                    <div className="hero__cta">
                        <Button
                            label="Take the free placement test"
                            size="large"
                            onClick={onClickPrimary}
                            className="btn-primary btn-lg"
                        />
                        <Button
                            label="Browse programs"
                            size="large"
                            onClick={onClickSecondary}
                            className="btn-outline btn-lg"
                        />
                    </div>

                    <div className="hero__trust">
                        <div className="hero__trust-item"><i className="pi pi-shield" /> Estimated 10–15 minutes</div>
                        <span className="hero__divider" />
                        <i className="pi pi-star" style={{ color: '#f59e0b' }} />
                        <span>4.9/5 from 300+ verified reviews</span>
                    </div>
                </div>

                <div className="hero__right">
                    <div className="hero-card">
                        <div className="hero-card__pills">
                            <div className="hero-pill"><strong>8.5+</strong> IELTS Score</div>
                            <div className="hero-pill"><i className="pi pi-video" /> Video Lessons</div>
                            <div className="hero-pill"><i className="pi pi-bolt" /> Live Learning</div>
                        </div>

                        <div className="hero-card__stat">
                            <div>
                                <div className="hero-card__title">300+ Successful Students</div>
                                <div className="hero-card__desc">Achieved IELTS & TOEIC Goals</div>
                            </div>
                            <div className="hero-pill" aria-label="Success Rate"><strong>95%</strong> Success<br/>Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
