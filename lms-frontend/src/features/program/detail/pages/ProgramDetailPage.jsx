import { useParams } from "react-router-dom";
import useProgramDetail from "../hooks/useProgramDetail";
import ProgramHero from "../components/ProgramHero";
import ProgramFacts from "../components/ProgramFacts";
import ProgramSubjects from "../components/ProgramSubjects";
import ProgramSidebar from "../components/ProgramSidebar";
import "../styles/program-detail.css";

export default function ProgramDetailPage(){
    const { id } = useParams();
    const { data: program, loading, error } = useProgramDetail(id);

    if (loading) return <div style={{padding:30}}>Loading…</div>;
    if (error || !program) return <div style={{padding:30}}>Can’t load this program.</div>;

    return (
        <div className="program-detail">
            <div className="container">
                <ProgramHero program={program} />

                <div className="program-grid" style={{marginTop:24}}>
                    <div style={{display:'grid', gap:18}}>
                        <ProgramFacts program={program}/>
                        <ProgramSubjects program={program}/>
                    </div>

                    <ProgramSidebar program={program}/>
                </div>
            </div>
        </div>
    );
}
