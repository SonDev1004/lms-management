import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

export default function MonthlyRevenueChart({series}) {
    if (!series || !series.length) return null;

    return (
        <div
            style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 16,
                background: "var(--surface)",
                boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
            }}
        >
            <div
                style={{
                    fontWeight: 600,
                    marginBottom: 12,
                    fontSize: 14,
                    color: "var(--ink-strong)",
                }}
            >
                Monthly Revenue Trend
            </div>

            <div style={{width: "100%", height: 260}}>
                <ResponsiveContainer>
                    <AreaChart data={series}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="label" tickLine={false} fontSize={12}/>
                        <YAxis
                            tickLine={false}
                            fontSize={12}
                            tickFormatter={(v) =>
                                v >= 1_000_000
                                    ? `${Math.round(v / 1_000_000)}m`
                                    : v.toLocaleString()
                            }
                        />
                        <Tooltip
                            formatter={(value) =>
                                value.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })
                            }
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
