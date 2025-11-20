import React from "react";
import { Divider } from "primereact/divider";
import Hero from "../components/about/Hero";
import Mission from "../components/about/Mission";
import StatsRow from "../components/about/StatsRow";
import MethodGrid from "../components/about/MethodGrid";
import TeachersGrid from "../components/about/TeachersGrid";
import BadgesGrid from "../components/about/BadgesGrid";
import TimeLine from "../components/about/TimeLine.jsx";
import Testimonials from "../components/about/Testimonials";
import FAQ from "../components/about/FAQ";

import "../styles/about.css";
import '../styles/hero.css';
import '../styles/mission.css';
import '../styles/methodgrid.css';
import '../styles/teachergrid.css';

export default function AboutPage() {
    return (
        <div className="about-page">
            <Hero />
            <main>
                <section className="section">
                    <Mission />
                </section>

                <section className="section">
                    <StatsRow />
                </section>

                <section className="section">
                    <MethodGrid />
                </section>

                <section className="section">
                    <TeachersGrid />
                </section>

                <section className="section">
                    <BadgesGrid />
                </section>

                <section className="section section--soft">
                    <h2 className="section-title">5 Years of Growing with Vietnamese Learners</h2>
                    <TimeLine />
                </section>

                <section className="section">
                    <Testimonials />
                </section>

                <section className="section section--faq">
                    <FAQ />
                </section>

                <Divider />
            </main>
        </div>
    );
}
