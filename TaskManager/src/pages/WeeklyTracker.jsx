import { useTasks } from "../context/TaskContext";
import BarChart from "../components/BarChart";

export default function WeeklyTracker() {
    const { weeklyData, completedTasks, weeklyProgress, studyStreak } = useTasks();
    const monthlyCompleted = 70;
    const monthlyProgress = 58;

    return (
        <div className="flex flex-col gap-6">
            {/* Weekly Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Weekly Tracker</h2>
                <BarChart data={weeklyData} xKey="day" yKey="tasks" height={220} />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard
                    label="Study Streak"
                    value={`${studyStreak} Days 🔥`}
                    onDismiss={() => { }}
                />
                <InfoCard
                    label="Tasks Completed this week"
                    value={`${completedTasks * 4} this week`}
                    onDismiss={() => { }}
                />
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weekly Progress</p>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">{weeklyProgress}%</span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${weeklyProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <SummaryItem label="Tasks Completed" value={monthlyCompleted} />
                        <SummaryItem label="Best Week" value="30 Tasks" />
                        <div className="col-span-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Progress: <span className="text-green-500 font-semibold">{monthlyProgress}%</span></p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${monthlyProgress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400">{monthlyProgress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Donut */}
                    <DonutChart percent={75} label="Completed" />
                </div>
            </div>
        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
                <p className="text-base font-bold text-gray-800 dark:text-white">{value}</p>
            </div>
            <button className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Dismiss
            </button>
        </div>
    );
}

function SummaryItem({ label, value }) {
    return (
        <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
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