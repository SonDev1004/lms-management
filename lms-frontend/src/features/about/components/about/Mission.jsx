import React from "react";

export default function Mission() {
    return (
        <section className="section section--mission">
            <div className="mission-grid">
                {/* Left copy */}
                <div>
                    <h2 className="mission-title">Our Mission: English Success for Every Vietnamese Learner</h2>
                    <p className="mission-sub">
                        We believe every Vietnamese student deserves world-class English
                        education that fits their learning style and schedule.
                    </p>

                    <ul className="checklist">
                        <li className="check">
                            <i className="pi pi-check-circle" />
                            <div>
                                <h4>Personalized Learning</h4>
                                <p>Every student gets a custom study plan based on their current level and target goals</p>
                            </div>
                        </li>
                        <li className="check">
                            <i className="pi pi-check-circle" />
                            <div>
                                <h4>Practical Focus</h4>
                                <p>Learn English that works in real Vietnamese contexts – from university applications to job interviews</p>
                            </div>
                        </li>
                        <li className="check">
                            <i className="pi pi-check-circle" />
                            <div>
                                <h4>Proven Results</h4>
                                <p>Our method has helped 85% of students achieve their target band scores within 6 months</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Right illustration */}
                <div className="illus-wrap">
                    <div className="illus-box">
                        <i className="pi pi-users" />
                    </div>
                    <div className="illus-caption">
                        Diverse group of Vietnamese students studying English together
                    </div>
                </div>
            </div>
        </section>
    );
}
