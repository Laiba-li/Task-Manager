import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import WeeklyTracker from "./pages/WeeklyTracker";
import MonthlyTracker from "./pages/MonthlyTracker";
import Tasks from "./pages/Tasks";
import { TaskProvider } from "./context/TaskContext";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [activePage, setActivePage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === "dark";

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "tasks", label: "📋 Tasks" },
    { id: "weekly", label: "Weekly Tracker" },
    { id: "monthly", label: "Monthly Tracker" },
  ];

  return (
    <TaskProvider>
      <div className={isDark ? "dark" : ""}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">

          {/* Header */}
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">

            {/* Top Row */}
            <div className="relative px-4 py-3 flex items-center justify-between">

              {/* LEFT: Title */}
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap transition-colors duration-300">
                📚 Smart Student Dashboard
              </h1>

              {/* CENTER: Desktop Nav (hidden on mobile) */}
              <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2">
                {navItems.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActivePage(id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activePage === id
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* RIGHT: Theme Toggle + Hamburger */}
              <div className="flex items-center gap-2">

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all whitespace-nowrap"
                >
                  {isDark ? "☀️" : "🌙"}
                  <span className="hidden sm:inline">
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </span>
                </button>

                {/* Hamburger (mobile only) */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all gap-1"
                  aria-label="Toggle menu"
                >
                  <span
                    className={`block w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 origin-center ${
                      menuOpen ? "rotate-45 translate-y-[6px]" : ""
                    }`}
                  />
                  <span
                    className={`block w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
                      menuOpen ? "opacity-0 scale-x-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 origin-center ${
                      menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                    }`}
                  />
                </button>

              </div>
            </div>

            {/* Mobile Dropdown (visible only when menuOpen) */}
            <div
              className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <nav className="flex flex-col gap-1 px-4 pt-2 pb-3 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
                {navItems.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActivePage(id);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activePage === id
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

          </header>

          {/* Page Content */}
          <main className="max-w-6xl mx-auto px-4 py-6 transition-colors duration-300">
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