import { useRef, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "../styles/register.css";

export default function RegisterForm() {
    const [form, setForm] = useState({ name: "", phone: "", email: "", agree: false });
    const toast = useRef(null);

    const bind = (k) => ({
        value: form[k],
        onChange: (e) => setForm((s) => ({ ...s, [k]: e.target.value })),
    });

    const submit = () => {
        if (!form.name || !form.phone || !form.email || !form.agree) {
            toast.current?.show({
                severity: "warn",
                summary: "Missing information",
                detail: "Please complete all fields and agree to the terms.",
            });
            return;
        }
        toast.current?.show({
            severity: "success",
            summary: "Registered",
            detail: "We will contact you within 15 minutes.",
        });
    };

    return (
        <section className="rg">
            <Toast ref={toast} />
            <div className="container rg__container">
                <div className="rg__grid">
                    {/* LEFT */}
                    <div className="rg__left">
                        <h2 className="rg__heading">Free Placement Test</h2>
                        <p className="rg__sub">Get your level assessment and a personalized learning roadmap.</p>

                        <ul className="rg__points">
                            <li>
                                <span className="rg__bullet"><i className="pi pi-bullseye" /></span>
                                Accurate assessment across 4 skills
                            </li>
                            <li>
                                <span className="rg__bullet"><i className="pi pi-users" /></span>
                                Personalized learning pathway
                            </li>
                            <li>
                                <span className="rg__bullet"><i className="pi pi-comments" /></span>
                                Free consultation with experts
                            </li>
                        </ul>

                        <div className="rg__metrics">
                            <Card className="rg__metric card-shadow">
                                <strong>10–15</strong>
                                <div>Minutes</div>
                            </Card>
                            <Card className="rg__metric card-shadow">
                                <strong>300+</strong>
                                <div>Completed</div>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="rg__right">
                        <span className="rg__tick"><i className="pi pi-check" /></span>

                        <Card className="rg__card card-shadow">
                            <h3 className="rg__form-title">Register for Test</h3>
                            <p className="rg__form-sub">Fill in your details to start the assessment</p>

                            {/* Name */}
                            <div className="field">
                                <label>Full name</label>
                                <div className="rg__control">
                                    <i className="pi pi-user rg__i" />
                                    <InputText className="rg__text" placeholder="Enter your full name" {...bind("name")} />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="field">
                                <label>Phone number</label>
                                <div className="rg__control">
                                    <i className="pi pi-phone rg__i" />
                                    <InputText className="rg__text" placeholder="Enter your phone number" {...bind("phone")} />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="field">
                                <label>Email</label>
                                <div className="rg__control">
                                    <i className="pi pi-envelope rg__i" />
                                    <InputText className="rg__text" placeholder="Enter your email address" {...bind("email")} />
                                </div>
                            </div>

                            {/* Agree */}
                            <div className="rg__agree">
                                <Checkbox
                                    inputId="agree"
                                    checked={form.agree}
                                    onChange={(e) => setForm((s) => ({ ...s, agree: e.checked }))}
                                />
                                <label htmlFor="agree">
                                    I agree to the Privacy Policy and Terms of Use
                                </label>
                            </div>

                            <Button
                                label="Start the test"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                className="rg-btn w-full"
                                onClick={submit}
                            />
                            <div className="rg__muted">
                                We will contact you within 15 minutes after registration
                            </div>
                        </Card>

                        <span className="rg__bubble"><i className="pi pi-bullseye" /></span>
                    </div>
                </div>
            </div>
        </section>
    );
}
