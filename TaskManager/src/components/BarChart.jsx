export default function BarChart({ data, xKey, yKey, height = 200 }) {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map((d) => d[yKey])) * 1.2 || 1;
    const padLeft = 32, padRight = 10, padTop = 10, padBottom = 28;
    const chartWidth = 500;
    const chartHeight = height;
    const innerW = chartWidth - padLeft - padRight;
    const innerH = chartHeight - padTop - padBottom;
    const barW = Math.min((innerW / data.length) * 0.55, 36);
    const gap = innerW / data.length;

    const yTicks = 4;

    return (
        <div className="w-full" style={{ height }}>
            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
            >
                {/* Y grid lines */}
                {Array.from({ length: yTicks + 1 }).map((_, i) => {
                    const val = Math.round((maxVal / yTicks) * (yTicks - i));
                    const y = padTop + (i / yTicks) * innerH;
                    return (
                        <g key={i}>
                            <line x1={padLeft} x2={chartWidth - padRight} y1={y} y2={y}
                                stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" className="text-gray-500" />
                            <text x={padLeft - 4} y={y + 4} textAnchor="end"
                                fontSize="10" fill="currentColor" className="text-gray-400" opacity="0.6">
                                {val}
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const barH = (d[yKey] / maxVal) * innerH;
                    const x = padLeft + i * gap + gap / 2 - barW / 2;
                    const y = padTop + innerH - barH;

                    return (
                        <g key={i}>
                            {/* Background bar */}
                            <rect
                                x={x} y={padTop} width={barW} height={innerH}
                                rx="4" fill="currentColor" className="text-gray-100 dark:text-gray-800" opacity="0.5"
                            />
                            {/* Colored bar */}
                            <rect
                                x={x} y={y} width={barW} height={barH}
                                rx="4" fill="#3b82f6"
                                style={{ transition: "height 0.5s ease, y 0.5s ease" }}
                            />
                            {/* X label */}
                            <text
                                x={x + barW / 2} y={chartHeight - 8}
                                textAnchor="middle" fontSize="11"
                                fill="currentColor" className="text-gray-400" opacity="0.7"
                            >
                                {d[xKey]}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}