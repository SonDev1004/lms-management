import { Card } from 'primereact/card';
import '../styles/why-section.css';

const items = [
    { icon: 'pi pi-sitemap',  title: 'Linear Thinking Method',     desc: 'Linear thinking helps learners grasp the essence of the language', c1:'#3B82F6', c2:'#4F46E5' },
    { icon: 'pi pi-bullseye', title: 'Results Guarantee',          desc: 'Guaranteed +0.5–1.0 band or free re-study',                         c1:'#22C55E', c2:'#16A34A' },
    { icon: 'pi pi-users',    title: 'Qualified Teaching Team',    desc: '77+ teachers holding IELTS 8.0–8.5+',                               c1:'#8B5CF6', c2:'#7C3AED' },
    { icon: 'pi pi-cog',      title: 'Modern Tech Platform',       desc: 'AI-assisted grading and progress tracking',                          c1:'#6366F1', c2:'#3B82F6' },
    { icon: 'pi pi-id-card',  title: 'Small Class Sizes',          desc: 'Maximum 8–12 students to ensure quality',                           c1:'#F97316', c2:'#EA580C' },
    { icon: 'pi pi-calendar', title: 'Flexible Schedule',          desc: 'Online/Offline with multiple time slots',                           c1:'#10B981', c2:'#059669' },
];

export default function FeaturesGrid() {
    return (
        <section className="why-wrap">
            <h2 className="why-title">Why choose us?</h2>

            <div className="why-container">
                <div className="why-grid">
                    {items.map((f) => (
                        <Card
                            key={f.title}
                            className="why-card"
                            header={
                                <span className="why-card__icon" style={{ '--ic1': f.c1, '--ic2': f.c2 }}>
                  <i className={f.icon} />
                </span>
                            }
                        >
                            <h3 className="why-card__title">{f.title}</h3>
                            <p className="why-card__desc">{f.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
