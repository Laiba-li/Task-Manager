export default function LineChart({ data, xKey, yKey, height = 200 }) {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map((d) => d[yKey])) * 1.2 || 1;
    const padLeft = 36, padRight = 20, padTop = 20, padBottom = 28;
    const chartWidth = 500;
    const chartHeight = height;
    const innerW = chartWidth - padLeft - padRight;
    const innerH = chartHeight - padTop - padBottom;

    const points = data.map((d, i) => ({
        x: padLeft + (i / (data.length - 1)) * innerW,
        y: padTop + innerH - (d[yKey] / maxVal) * innerH,
        val: d[yKey],
        label: d[xKey],
    }));

    const pathD = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

    const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + innerH} L ${points[0].x} ${padTop + innerH} Z`;

    const yTicks = 4;

    return (
        <div className="w-full" style={{ height }}>
            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {/* Y grid lines */}
                {Array.from({ length: yTicks + 1 }).map((_, i) => {
                    const val = Math.round((maxVal / yTicks) * (yTicks - i));
                    const y = padTop + (i / yTicks) * innerH;
                    return (
                        <g key={i}>
                            <line x1={padLeft} x2={chartWidth - padRight} y1={y} y2={y}
                                stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" className="text-gray-500" />
                            <text x={padLeft - 6} y={y + 4} textAnchor="end"
                                fontSize="10" fill="currentColor" className="text-gray-400" opacity="0.6">
                                {val}
                            </text>
                        </g>
                    );
                })}

                {/* Area fill */}
                <path d={areaD} fill="url(#lineAreaGrad)" />

                {/* Line */}
                <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Points & labels */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="5" fill="#3b82f6" stroke="white" strokeWidth="2" />
                        <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#3b82f6">
                            {p.val}
                        </text>
                        <text x={p.x} y={chartHeight - 8} textAnchor="middle" fontSize="11"
                            fill="currentColor" className="text-gray-400" opacity="0.7">
                            {p.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}