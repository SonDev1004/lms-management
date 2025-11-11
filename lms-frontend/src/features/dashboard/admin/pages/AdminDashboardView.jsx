import useDashboardData from "../hooks/useDashboardData";
import MetricCard from "../components/MetricCard";
import SystemHeader from "../components/SystemHeader";
import QuickActionsPanel from "../components/QuickActionsPanel";
import RecentActivity from "../components/RecentActivity";
import LicenseStatus from "../components/LicenseStatus";
import "../styles/dashboard.css";


export default function AdminDashboardView() {
    const { loading, kpis, quickActions, activities, licenses } = useDashboardData();

    return (
        <div className="adm-shell">
            <div className="adm-grid">
                <div className="header card" style={{padding:18}}>
                    <div style={{color:"#64748b", fontWeight:700, marginBottom:6}}>Dashboard</div>
                    <SystemHeader />
                </div>

                {/* KPI cards */}
                <div className="kpi-grid">
                    {(!loading ? kpis : Array.from({length:4}).map((_,i)=>({id:i}))).map((k) => (
                        loading
                            ? <div key={k.id} className="card kpi skeleton" style={{height:108, background:"#f1f5f9"}} />
                            : <MetricCard key={k.id} {...k} />
                    ))}
                </div>

                {/* Panels */}
                <div className="panels">
                    <QuickActionsPanel items={quickActions} />
                    <RecentActivity items={activities} />
                    <LicenseStatus items={licenses} />
                </div>
            </div>
        </div>
    );
}
