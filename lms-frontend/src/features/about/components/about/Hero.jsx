import React from "react";
import { Button } from "primereact/button";
import '../../styles/hero.css';
export default function Hero() {
    return (
        <header className="about-hero">
            <div className="container">
                <h1 className="hero-title">
                    Master English Fast with Vietnam's Top<br />
                    <span>IELTS Learning Platform</span>
                </h1>
                <p className="hero-sub">
                    Join 50,000+ Vietnamese students who achieved their target IELTS, TOEIC, and
                    English speaking goals with our proven personalized method.
                </p>
                <div className="hero-actions">
                    <Button
                        label="Browse Programs"
                        icon="pi pi-arrow-right"
                        className="p-button-rounded p-button-lg"
                        onClick={() => (window.location.href = "/programs")}
                    />
                    <Button
                        label="Get Free Consultation"
                        className="p-button-rounded p-button-lg p-button-outlined"
                        onClick={() => (window.location.href = "/free-consultation")}
                    />
                </div>
            </div>
        </header>
    );
}
