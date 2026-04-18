import { useTasks } from "../context/TaskContext";

const typeConfig = {
    warning: { icon: "⚠️", bg: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900" },
    info: { icon: "🕐", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900" },
    success: { icon: "✅", bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900" },
};

export default function NotificationPanel() {
    const { notifications, dismissNotification } = useTasks();
    const visible = notifications.filter((n) => !n.dismissed);

    return (
        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
            {visible.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-3">All caught up! 🎉</p>
            )}
            {visible.map((n) => {
                const cfg = typeConfig[n.type] || typeConfig.info;
                return (
                    <div
                        key={n.id}
                        className={`flex items-start gap-2 p-3 rounded-xl border text-xs transition-all duration-200 ${cfg.bg}`}
                    >
                        <span className="text-sm flex-shrink-0 mt-0.5">{cfg.icon}</span>
                        <div className="flex-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{n.type === "warning" ? "Reminder: " : n.type === "info" ? "Upcoming: " : "Congrats! "}</span>
                            <span className="text-gray-600 dark:text-gray-400">{n.message}</span>
                        </div>
                        <button
                            onClick={() => dismissNotification(n.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs px-2 py-0.5 rounded-md bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 transition-colors flex-shrink-0"
                        >
                            Dismiss
                        </button>
                    </div>
                );
            })}
        </div>
    );
}