import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import WeeklyTracker from "./pages/WeeklyTracker";
import MonthlyTracker from "./pages/MonthlyTracker";
import Tasks from "./pages/Tasks";
import { TaskProvider } from "./context/TaskContext";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [activePage, setActivePage] = useState("dashboard");

  const isDark = theme === "dark";

  return (
    <TaskProvider>
      <div className={isDark ? "dark" : ""}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
          {/* Header */}
         <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex flex-wrap md:flex-nowrap items-center gap-3 shadow-sm overflow-x-hidden">

  {/* LEFT: Title */}
  <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">
    📚 Smart Student Dashboard
  </h1>

  {/* CENTER: Navigation */}
  <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full">
  {[
    { id: "dashboard", label: "Dashboard" },
    { id: "tasks", label: "📋 Tasks" },
    { id: "weekly", label: "Weekly Tracker" },
    { id: "monthly", label: "Monthly Tracker" },
  ].map(({ id, label }) => (
    <button
      key={id}
      onClick={() => setActivePage(id)}
      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        activePage === id
          ? "bg-blue-600 text-white shadow"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </button>
  ))}
</nav>

  {/* RIGHT: Theme Toggle */}
  <button
    onClick={() => setTheme(isDark ? "light" : "dark")}
    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all whitespace-nowrap"
  >
    {isDark ? "☀️" : "🌙"}
    <span className="hidden sm:inline">
      {isDark ? "Light Mode" : "Dark Mode"}
    </span>
  </button>

</header>

          {/* Page Content */}
          <main className="max-w-6xl mx-auto px-4 py-6">
            {activePage === "dashboard" && <Dashboard />}
            {activePage === "tasks" && <Tasks />}
            {activePage === "weekly" && <WeeklyTracker />}
            {activePage === "monthly" && <MonthlyTracker />}
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}