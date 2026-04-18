import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

const initialTasks = [
    { id: 1, name: "HCI Project Report", description: "Complete the final report", dueDate: "2026-03-16", status: "pending", priority: "high" },
    { id: 2, name: "Study Database Chapter", description: "Read chapters 5-7", dueDate: "2026-03-18", status: "pending", priority: "medium" },
    { id: 3, name: "Math Homework", description: "Exercise set 4", dueDate: "2026-03-15", status: "completed", priority: "low" },
    { id: 4, name: "Physics Lab Report", description: "Write up experiment results", dueDate: "2026-03-20", status: "pending", priority: "high" },
    { id: 5, name: "English Essay", description: "500 word essay on Shakespeare", dueDate: "2026-03-22", status: "completed", priority: "medium" },
];

const weeklyData = [
    { day: "Mon", tasks: 4 },
    { day: "Tue", tasks: 7 },
    { day: "Wed", tasks: 12 },
    { day: "Thu", tasks: 18 },
    { day: "Fri", tasks: 22 },
    { day: "Sat", tasks: 8 },
    { day: "Sun", tasks: 3 },
];

const monthlyData = [
    { week: "Week 1", tasks: 23 },
    { week: "Week 2", tasks: 26 },
    { week: "Week 3", tasks: 28 },
    { week: "Week 4", tasks: 30 },
];

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : initialTasks;
});
    const [notifications, setNotifications] = useState([
        { id: 1, type: "warning", message: "HCI Project Report due tomorrow!", dismissed: false },
        { id: 2, type: "info", message: "Database Lab due in 2 days", dismissed: false },
        { id: 3, type: "success", message: "Math Homework completed!", dismissed: false },
    ]);
    useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

    const addTask = (task) => {
        setTasks((prev) => [...prev, { ...task, id: Date.now(), status: "pending" }]);
    };

    const toggleTask = (id) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t))
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const updateTask = (id, updatedFields) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
        );
    };

    const dismissNotification = (id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n)));
    };

    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const totalTasks = tasks.length;
    const weeklyProgress = totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);

    return (
        <TaskContext.Provider
            value={{
                tasks, addTask, toggleTask, deleteTask, updateTask,
                notifications, dismissNotification,
                weeklyData, monthlyData,
                completedTasks, totalTasks, weeklyProgress,
                studyStreak: 5,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => useContext(TaskContext);