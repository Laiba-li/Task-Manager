import { useState, useMemo } from "react";
import { useTasks } from "../context/TaskContext";

/* ─── helpers ─────────────────────────────────────────────── */
const PRIORITY = {
  high: { label: "High", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", dot: "bg-red-500" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", dot: "bg-amber-400" },
  low: { label: "Low", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", dot: "bg-emerald-500" },
};

const STATUS = {
  pending: { label: "Pending", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  completed: { label: "Completed", color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300" },
};

const EMPTY_FORM = { name: "", description: "", dueDate: "", priority: "medium", status: "pending" };

function getDaysLabel(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  if (diff < 0) return { text: "Overdue", cls: "text-red-500" };
  if (diff === 0) return { text: "Due Today", cls: "text-amber-500" };
  if (diff === 1) return { text: "Due Tomorrow", cls: "text-amber-400" };
  return { text: `In ${diff} days`, cls: "text-gray-400 dark:text-gray-500" };
}

/* ─── Modal ────────────────────────────────────────────────── */
function TaskModal({ mode, task, onSave, onClose }) {
  const [form, setForm] = useState(task || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Task name is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 animate-modal">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === "add" ? "✨ Add New Task" : "✏️ Edit Task"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Task Name *</label>
            <input
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="e.g. Complete project report"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.name ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Optional details about the task…"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => set("dueDate", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.dueDate ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
              />
              {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => set("priority", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          {mode === "edit" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => set("status", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm shadow-blue-200 dark:shadow-none">
              {mode === "add" ? "Add Task" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ─────────────────────────────────── */
function DeleteConfirmModal({ count, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-7 text-center animate-modal">
        <div className="text-5xl mb-3">🗑️</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete {count > 1 ? `${count} Tasks` : "Task"}?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile Task Card ─────────────────────────────────────── */
function TaskCard({ task, isSelected, onSelect, onEdit, onDelete, onToggle }) {
  const isDone = task.status === "completed";
  const pri = PRIORITY[task.priority] || PRIORITY.medium;
  const stat = STATUS[task.status] || STATUS.pending;
  const dueInfo = getDaysLabel(task.dueDate);

  return (
    <div className={`p-4 rounded-xl border transition-all duration-150
      ${isSelected ? "bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"}
      ${isDone ? "opacity-60" : ""}`}
    >
      {/* Top row: checkbox + name + actions */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="w-4 h-4 mt-0.5 rounded accent-blue-600 cursor-pointer flex-shrink-0"
          checked={isSelected}
          onChange={() => onSelect(task.id)}
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${isDone ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-100"}`}>
            {task.name}
          </p>
          {task.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-sm">✏️</button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-sm">🗑️</button>
        </div>
      </div>

      {/* Bottom row: badges + due date */}
      <div className="flex items-center flex-wrap gap-2 mt-3 ml-7">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${pri.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
          {pri.label}
        </span>
        <button
          onClick={() => onToggle(task.id)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all hover:opacity-80 ${stat.color}`}
        >
          {isDone ? "✅" : "⏳"} {stat.label}
        </button>
        {task.dueDate && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            {dueInfo && <span className={`text-xs font-medium ${dueInfo.cls}`}>· {dueInfo.text}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks();

  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const displayed = useMemo(() => {
    let list = tasks.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(search.toLowerCase());
      const matchPriority = filterPriority === "all" || t.priority === filterPriority;
      const matchStatus = filterStatus === "all" || t.status === filterStatus;
      return matchSearch && matchPriority && matchStatus;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "priority") return ({ high: 0, medium: 1, low: 2 }[a.priority]) - ({ high: 0, medium: 1, low: 2 }[b.priority]);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [tasks, search, filterPriority, filterStatus, sortBy]);

  const allSelected = displayed.length > 0 && displayed.every(t => selected.has(t.id));
  const someSelected = selected.size > 0;

  const toggleSelect = (id) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(displayed.map(t => t.id)));
  };

  const handleSave = (form) => {
    if (modal.type === "add") addTask(form);
    else updateTask(modal.task.id, form);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget === "selected") {
      selected.forEach(id => deleteTask(id));
      setSelected(new Set());
    } else {
      deleteTask(deleteTarget);
      setSelected(prev => { const n = new Set(prev); n.delete(deleteTarget); return n; });
    }
    setDeleteTarget(null);
  };

  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.status === "completed").length;
  const highCount = tasks.filter(t => t.priority === "high" && t.status !== "completed").length;
  const overdueCount = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length;

  return (
    <>
      {modal && (
        <TaskModal
          mode={modal.type}
          task={modal.task}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {deleteTarget !== null && (
        <DeleteConfirmModal
          count={deleteTarget === "selected" ? selected.size : 1}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex flex-col gap-6">
        {/* ── Page Title ── */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">📋 Task Manager</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage all your tasks in one place</p>
          </div>
          <button
            onClick={() => setModal({ type: "add" })}
            className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 dark:shadow-none transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span className="text-base">＋</span>
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Total Tasks", value: totalCount, icon: "📁", cls: "from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/20 border-blue-200/70 dark:border-blue-800/50 text-blue-700 dark:text-blue-300" },
            { label: "Completed", value: doneCount, icon: "✅", cls: "from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/20 border-green-200/70 dark:border-green-800/50 text-green-700 dark:text-green-300" },
            { label: "High Priority", value: highCount, icon: "🔥", cls: "from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/20 border-red-200/70 dark:border-red-800/50 text-red-700 dark:text-red-300" },
            { label: "Overdue", value: overdueCount, icon: "⏰", cls: "from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/20 border-amber-200/70 dark:border-amber-800/50 text-amber-700 dark:text-amber-300" },
          ].map(c => (
            <div key={c.label} className={`bg-gradient-to-br ${c.cls} border rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 shadow-sm`}>
              <span className="text-2xl md:text-3xl">{c.icon}</span>
              <div>
                <p className="text-xl md:text-2xl font-bold">{c.value}</p>
                <p className="text-xs opacity-70 font-medium">{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters + Search ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-0 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-400 text-sm flex-shrink-0">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="bg-transparent flex-1 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none min-w-0"
            />
            {search && <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 text-xs flex-shrink-0">✕</button>}
          </div>

          {/* Selects row */}
          <div className="flex flex-wrap gap-2">
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              className="flex-1 min-w-28 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option value="all">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 min-w-28 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option value="all">All Statuses</option>
              <option value="pending">⏳ Pending</option>
              <option value="completed">✅ Completed</option>
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="flex-1 min-w-28 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="name">Sort: Name</option>
            </select>

            {someSelected && (
              <button
                onClick={() => setDeleteTarget("selected")}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition flex items-center gap-1.5 whitespace-nowrap"
              >
                🗑️ Delete ({selected.size})
              </button>
            )}
          </div>
        </div>

        {/* ── Task Table (desktop) / Cards (mobile) ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <span className="text-5xl">🔍</span>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters or add a new task</p>
            </div>
          ) : (
            <>
              {/* ── Desktop Table (md+) ── */}
              <div className="hidden md:block">
                <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] items-center gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                  <span>Task</span>
                  <span>Priority</span>
                  <span>Status</span>
                  <span>Due Date</span>
                  <span className="text-right">Actions</span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {displayed.map((task) => {
                    const isDone = task.status === "completed";
                    const pri = PRIORITY[task.priority] || PRIORITY.medium;
                    const stat = STATUS[task.status] || STATUS.pending;
                    const dueInfo = getDaysLabel(task.dueDate);
                    const isSelected = selected.has(task.id);

                    return (
                      <div
                        key={task.id}
                        className={`grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 transition-colors duration-150
                          ${isSelected ? "bg-blue-50/60 dark:bg-blue-950/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/40"}
                          ${isDone ? "opacity-60" : ""}`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleSelect(task.id)}
                        />
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${isDone ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-100"}`}>
                            {task.name}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{task.description}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${pri.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
                          {pri.label}
                        </span>
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit transition-all hover:opacity-80 ${stat.color}`}
                        >
                          {isDone ? "✅" : "⏳"} {stat.label}
                        </button>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                          </p>
                          {dueInfo && <p className={`text-xs mt-0.5 font-medium ${dueInfo.cls}`}>{dueInfo.text}</p>}
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => setModal({ type: "edit", task })} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-sm">✏️</button>
                          <button onClick={() => setDeleteTarget(task.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-sm">🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Mobile Cards (< md) ── */}
              <div className="md:hidden">
                {/* Select all bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {allSelected ? "Deselect All" : "Select All"} · {displayed.length} task{displayed.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-3">
                  {displayed.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isSelected={selected.has(task.id)}
                      onSelect={toggleSelect}
                      onEdit={(t) => setModal({ type: "edit", task: t })}
                      onDelete={(id) => setDeleteTarget(id)}
                      onToggle={toggleTask}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="px-4 md:px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Showing <strong>{displayed.length}</strong> of <strong>{totalCount}</strong> tasks</span>
            {someSelected && <span><strong>{selected.size}</strong> selected</span>}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .animate-modal { animation: modal-in 0.2s ease-out both; }
      `}</style>
    </>
  );
}