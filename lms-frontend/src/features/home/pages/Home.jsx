import {useRef} from 'react';
import Hero from '../component/Hero';
import FeaturesGrid from '../component/FeaturesGrid';
import CTARegisterTest from '../component/CTARegisterTest';
import RegisterForm from '../component/RegisterForm';
import PopularCourseComparison from '../component/PopularCourseComparison';
import {programsPopular} from '../mocks/mocks';
import '../styles/home.css';
import ProgramsTabsHome from "@/features/home/component/ProgramsTabsHome.jsx";

export default function Home() {
    const programsRef = useRef(null);
    const testRef = useRef(null);

    const scrollTo = (ref) =>
        ref?.current?.scrollIntoView({behavior: 'smooth', block: 'start'});

    return (
        <div className="home">
            {/* If a global site header already exists, keep Hero header elements minimal */}
            <Hero
                onClickPrimary={() => scrollTo(testRef)}
                onClickSecondary={() => scrollTo(programsRef)}
            />

            {/* Why / Features */}
            <section className="home__why">
                <div className="container">
                    <FeaturesGrid/>
                </div>
            </section>

            {/* Popular Course Comparison */}
            <section className="container">
                <PopularCourseComparison
                    items={programsPopular}
                    onViewAll={() => scrollTo(programsRef)}
                />
            </section>

            {/* Programs */}
            <section className="container" ref={programsRef}>
                <ProgramsTabsHome/>
            </section>


            {/* CTA: placement test */}
            <section className="container">
                <CTARegisterTest onClickStart={() => scrollTo(testRef)}/>
            </section>

            {/* Registration form */}
            <section className="home__register" ref={testRef}>
                <div className="container">
                    <RegisterForm/>
                </div>
            </section>
        </div>
    );
}
