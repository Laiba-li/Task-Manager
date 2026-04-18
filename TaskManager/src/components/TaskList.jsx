import { useTasks } from "../context/TaskContext";

const priorityConfig = {
    high: { icon: "⚠️", color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900" },
    medium: { icon: "🕐", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900" },
    low: { icon: "✅", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900" },
};

function getDaysUntil(dateStr) {
    if (!dateStr) return null;
    const today = new Date();
    const due = new Date(dateStr);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Overdue";
    if (diff === 0) return "Due Today";
    if (diff === 1) return "Due Tomorrow";
    return `Due in ${diff} days`;
}

export default function TaskList() {
    const { tasks, toggleTask, deleteTask } = useTasks();

    return (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {tasks.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No tasks yet. Add one above!</p>
            )}
            {tasks.map((task) => {
                const cfg = priorityConfig[task.priority] || priorityConfig.medium;
                const dueLabel = getDaysUntil(task.dueDate);
                const isDone = task.status === "completed";

                return (
                    <div
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${isDone ? "opacity-60 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" : cfg.bg
                            }`}
                    >
                        <button
                            onClick={() => toggleTask(task.id)}
                            className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                            style={{
                                borderColor: isDone ? "#22c55e" : "#d1d5db",
                                background: isDone ? "#22c55e" : "transparent",
                            }}
                        >
                            {isDone && <span className="text-white text-xs">✓</span>}
                        </button>

                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isDone ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200"}`}>
                                <span className="mr-1">{cfg.icon}</span>
                                {task.name}
                            </p>
                            {dueLabel && (
                                <p className={`text-xs mt-0.5 ${isDone ? "text-gray-400" : cfg.color}`}>
                                    {dueLabel}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => deleteTask(task.id)}
                            className="flex-shrink-0 text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors text-xs px-1"
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
        </div>
    );
}