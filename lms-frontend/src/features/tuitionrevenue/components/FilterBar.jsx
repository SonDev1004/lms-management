import React from "react";
import MonthPicker from "./MonthPicker";

export default function FilterBar({
                                      primaryMonth, setPrimaryMonth,
                                      compareOn, setCompareOn,
                                      compareMonth, setCompareMonth,
                                      onExport
                                  }){
    return (
        <div className="card p-6 filter-grid">
            {/* Primary Month */}
            <div>
                <div className="sub" style={{marginBottom:8}}>Primary Month</div>
                <MonthPicker value={primaryMonth} onChange={setPrimaryMonth} />
            </div>

            {/* Compare toggle */}
            <div>
                <div className="sub" style={{marginBottom:8}}>Compare Mode</div>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div className={`toggle ${compareOn? 'on':''}`} onClick={()=>setCompareOn(!compareOn)}>
                        <div className="knob"/>
                    </div>
                    <span style={{color:'#374151',fontWeight:600}}>{compareOn? 'Enabled':'Disabled'}</span>
                </div>
            </div>

            {/* Compare Month */}
            <div>
                <div className="sub" style={{marginBottom:8}}>Compare Month</div>
                <MonthPicker value={compareMonth} onChange={setCompareMonth} disabled={!compareOn}/>
            </div>

            {/* View Data (chỉ minh họa) */}
            <div>
                <div className="sub" style={{marginBottom:8}}>View Data</div>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <button className="btn" title="Calendar view">📆</button>
                    <button className="btn" title="Search">🔍</button>
                    <span style={{fontWeight:600}}>View</span>
                </div>
            </div>

            {/* Export */}
            <div style={{display:'flex',alignItems:'end',justifyContent:'end'}}>
                <button className="btn" onClick={onExport} title="Export CSV">⬇️ <span style={{fontWeight:600}}>Export CSV</span></button>
            </div>
        </div>
    );
}
