import { TabView, TabPanel } from 'primereact/tabview';
import ProgramCard from './ProgramCard';
import { usePrograms } from '../hooks/usePrograms';
import '../styles/programs-section.css';

const TABS = ['IELTS', 'TOEIC', 'Junior', 'Speaking', 'Grammar & Vocab'];

function SkeletonCard() {
    return <div className="program-skeleton card-shadow" />;
}

export default function ProgramsTabs() {
    const { loading, error, byCategory } = usePrograms();

    return (
        <section className="programs-wrap">
            <h2 className="programs-title">Programs</h2>
            <p className="programs-sub">Clear roadmap — flexible classes — guaranteed outcomes</p>

            <div className="programs">
                <TabView>
                    {TABS.map((tab) => {
                        const list = byCategory.get(tab) || [];
                        return (
                            <TabPanel header={tab} key={tab}>
                                <div className="programs-grid">
                                    {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                                    {!loading && list.length === 0 && (
                                        <div className="programs-empty">No suitable courses available yet.</div>
                                    )}
                                    {!loading && list.map((p) => <ProgramCard key={p.id} program={p} />
                                    )}
                                </div>
                                {error && <div className="programs-error">Failed to load data. Please try again.</div>}
                            </TabPanel>
                        );
                    })}
                </TabView>
            </div>
        </section>
    );
}
