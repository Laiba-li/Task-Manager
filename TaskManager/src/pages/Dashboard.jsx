// import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import NotificationPanel from "../components/NotificationPanel";
import BarChart from "../components/BarChart";

export default function Dashboard() {
    const { weeklyData, completedTasks, totalTasks, weeklyProgress } = useTasks();

    return (
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 min-w-0">
                <AddTaskForm />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Tasks */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Tasks</h2>
                        <TaskList />
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
                        <NotificationPanel />

                        {/* Progress Circle */}
                        <div className="mt-4 sm:mt-6 flex flex-col items-center">
                            <ProgressRing percent={weeklyProgress} />
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Add all tasks</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Weekly Progress */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm min-w-0 w-full">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Weekly Progress</h2>
                <BarChart data={weeklyData} xKey="day" yKey="tasks" height={180} />

                {/* Stats */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <StatCard label="Tasks Completed" value={completedTasks} color="blue" />
                    <StatCard label="Total Tasks" value={totalTasks} color="gray" />
                    <StatCard label="Progress" value={`${weeklyProgress}%`} color="green" />
                    <StatCard label="Study Streak" value="5 Days 🔥" color="orange" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        blue: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
        green: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
        orange: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
        gray: "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    };
    return (
        <div className={`rounded-xl p-3 ${colors[color]}`}>
            <p className="text-xs opacity-70 mb-1">{label}</p>
            <p className="text-lg font-bold">{value}</p>
        </div>
    );
}

function ProgressRing({ percent }) {
    const r = 40, cx = 50, cy = 50;
    const circ = 2 * Math.PI * r;
    const dash = (percent / 100) * circ;

    return (
        <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" className="dark:stroke-gray-700" />
                <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke="#22c55e" strokeWidth="10"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
            </svg>
            <div className="text-center z-10">
                <p className="text-xl font-bold text-gray-900 dark:text-white">{percent}%</p>
                <p className="text-xs text-gray-400">Done</p>
            </div>
        </div>
    );
}