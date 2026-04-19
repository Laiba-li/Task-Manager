import { useTasks } from "../context/TaskContext";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";

export default function MonthlyTracker() {
    const { monthlyData, completedTasks, totalTasks } = useTasks();

    const monthlyProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="flex flex-col gap-6">
            {/* Weekly line chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Weekly Breakdown</h2>
                <LineChart data={monthlyData} xKey="week" yKey="tasks" height={220} />
            </div>

            {/* Monthly Bar Chart — uses real monthlyData */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Monthly Tracker</h2>
                <BarChart data={monthlyData} xKey="week" yKey="tasks" height={200} />
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tasks Completed:</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
                            <span className="text-green-500 text-lg">📈</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Monthly Progress: <span className="text-green-500 font-semibold">{monthlyProgress}%</span>
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-green-500 h-3 rounded-full transition-all duration-700"
                                        style={{ width: `${monthlyProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DonutChart percent={monthlyProgress} label="Completed" />
                </div>
            </div>
        </div>
    );
}

function DonutChart({ percent, label }) {
    const r = 45, cx = 55, cy = 55;
    const circ = 2 * Math.PI * r;
    const dash = (percent / 100) * circ;

    return (
        <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 110 110" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" className="dark:stroke-gray-700" />
                <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke="#22c55e" strokeWidth="12"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="text-center z-10">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{percent}%</p>
                <p className="text-xs text-gray-400">{label}</p>
            </div>
        </div>
    );
}