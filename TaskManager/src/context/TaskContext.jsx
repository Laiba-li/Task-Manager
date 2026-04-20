import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const TaskContext = createContext();

/* ─── Storage helpers ─────────────────────────────────────── */
function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}

/* ─── Notification generator ──────────────────────────────── */
function buildNotifications(tasks, dismissedIds) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const notifications = [];

  tasks.forEach((task) => {
    if (!task.dueDate) return;

    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.round((due - now) / 86400000);

    if (task.status === "completed") {
      const id = `success-${task.id}`;
      notifications.push({
        id,
        taskId: task.id,
        type: "success",
        message: `"${task.name}" has been completed! 🎉`,
        dismissed: dismissedIds.includes(id),
      });
      return;
    }

    if (diffDays < 0) {
      const id = `overdue-${task.id}`;
      notifications.push({
        id,
        taskId: task.id,
        type: "warning",
        message: `"${task.name}" is overdue by ${Math.abs(diffDays)} day(s)!`,
        dismissed: dismissedIds.includes(id),
      });
      return;
    }

    if (diffDays === 0) {
      const id = `today-${task.id}`;
      notifications.push({
        id,
        taskId: task.id,
        type: "warning",
        message: `"${task.name}" is due today!`,
        dismissed: dismissedIds.includes(id),
      });
      return;
    }

    if (diffDays === 1) {
      const id = `tomorrow-${task.id}`;
      notifications.push({
        id,
        taskId: task.id,
        type: "warning",
        message: `"${task.name}" is due tomorrow!`,
        dismissed: dismissedIds.includes(id),
      });
      return;
    }

    if (diffDays <= 3) {
      const id = `soon-${task.id}`;
      notifications.push({
        id,
        taskId: task.id,
        type: "info",
        message: `"${task.name}" is due in ${diffDays} days.`,
        dismissed: dismissedIds.includes(id),
      });
    }
  });

  const typePriority = { warning: 0, info: 1, success: 2 };
  return notifications.sort((a, b) => {
    if (a.dismissed !== b.dismissed) return a.dismissed ? 1 : -1;
    return (typePriority[a.type] ?? 9) - (typePriority[b.type] ?? 9);
  });
}

/* ─── Weekly data ─────────────────────────────────────────── */
function buildWeeklyData(tasks) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts = Object.fromEntries(days.map((d) => [d, 0]));

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  tasks.forEach((task) => {
    if (!task.dueDate) return;
    const due = new Date(task.dueDate);
    if (due >= startOfWeek && due <= endOfWeek) {
      counts[days[due.getDay()]]++;
    }
  });

  return days.map((day) => ({ day, tasks: counts[day] }));
}

/* ─── Monthly data ────────────────────────────────────────── */
function buildMonthlyData(tasks) {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const counts = [0, 0, 0, 0];

  tasks.forEach((task) => {
    if (task.status !== "completed" || !task.dueDate) return;
    const due = new Date(task.dueDate);
    const day = due.getDate();
    const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
    counts[weekIndex]++;
  });

  return weeks.map((week, i) => ({ week, tasks: counts[i] }));
}

/* ─── Initial seed tasks ──────────────────────────────────── */
const INITIAL_TASKS = [
  { id: "seed-1", name: "HCI Project Report", description: "Complete the final report", dueDate: "2026-04-20", status: "pending", priority: "high", createdAt: new Date().toISOString() },
  { id: "seed-2", name: "Study Database Chapter", description: "Read chapters 5-7", dueDate: "2026-04-21", status: "pending", priority: "medium", createdAt: new Date().toISOString() },
  { id: "seed-3", name: "Math Homework", description: "Exercise set 4", dueDate: "2026-04-18", status: "completed", priority: "low", createdAt: new Date().toISOString() },
  { id: "seed-4", name: "Physics Lab Report", description: "Write up experiment results", dueDate: "2026-04-22", status: "pending", priority: "high", createdAt: new Date().toISOString() },
  { id: "seed-5", name: "English Essay", description: "500 word essay on Shakespeare", dueDate: "2026-04-24", status: "completed", priority: "medium", createdAt: new Date().toISOString() },
];

/* ─── Provider ────────────────────────────────────────────── */
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => loadStorage("ssd_tasks", INITIAL_TASKS));
  const [dismissedIds, setDismissedIds] = useState(() => loadStorage("ssd_dismissed", []));

  /* Persist on change */
  useEffect(() => { saveStorage("ssd_tasks", tasks); }, [tasks]);
  useEffect(() => { saveStorage("ssd_dismissed", dismissedIds); }, [dismissedIds]);

  /* Derived: notifications */
  const notifications = useMemo(
    () => buildNotifications(tasks, dismissedIds),
    [tasks, dismissedIds]
  );

  /* Derived: chart data */
  const weeklyData = useMemo(() => buildWeeklyData(tasks), [tasks]);
  const monthlyData = useMemo(() => buildMonthlyData(tasks), [tasks]);

  /* Derived: stats */
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed").length, [tasks]);
  const totalTasks = tasks.length;
  const weeklyProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  /* Derived: study streak */
  const studyStreak = useMemo(() => {
    const completedDates = tasks
      .filter((t) => t.status === "completed" && t.dueDate)
      .map((t) => new Date(t.dueDate).toDateString());
    const unique = [...new Set(completedDates)];
    let streak = 0;
    const check = new Date();
    while (unique.includes(check.toDateString())) {
      streak++;
      check.setDate(check.getDate() - 1);
    }
    return streak;
  }, [tasks]);

  /* ── CRUD ── */
  const addTask = useCallback((form) => {
    const newTask = {
      ...form,
      id: crypto.randomUUID(),
      status: form.status || "pending",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    if (updatedFields.status === "pending") {
      setDismissedIds((prev) => prev.filter((did) => did !== `success-${id}`));
    }
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDismissedIds((prev) => prev.filter((did) => !did.endsWith(`-${id}`)));
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newStatus = t.status === "completed" ? "pending" : "completed";
        if (newStatus === "pending") {
          setDismissedIds((ids) => ids.filter((did) => did !== `success-${id}`));
        }
        return { ...t, status: newStatus };
      })
    );
  }, []);

  const dismissNotification = useCallback((notifId) => {
    setDismissedIds((prev) =>
      prev.includes(notifId) ? prev : [...prev, notifId]
    );
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        notifications,
        dismissNotification,
        weeklyData,
        monthlyData,
        completedTasks,
        totalTasks,
        weeklyProgress,
        studyStreak,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => useContext(TaskContext);