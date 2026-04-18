import { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function AddTaskForm() {
    const { addTask } = useTasks();
    const [form, setForm] = useState({ name: "", description: "", dueDate: "", priority: "medium" });
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        addTask(form);
        setForm({ name: "", description: "", dueDate: "", priority: "medium" });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Add Task</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <FormRow label="Task Name">
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Finish HCI Project"
                        className="input-field"
                        required
                    />
                </FormRow>

                <FormRow label="Description">
                    <input
                        type="text"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="e.g. Complete the report for HCI class"
                        className="input-field"
                    />
                </FormRow>

                <div className="grid grid-cols-2 gap-3">
                    <FormRow label="Due Date">
                        <input
                            type="date"
                            value={form.dueDate}
                            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                            className="input-field"
                        />
                    </FormRow>

                    <FormRow label="Priority">
                        <select
                            value={form.priority}
                            onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            className="input-field"
                        >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </FormRow>
                </div>

                <button
                    type="submit"
                    className="mt-1 w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-sm"
                >
                    {success ? "✓ Task Added!" : "Add Task"}
                </button>
            </form>
        </div>
    );
}

function FormRow({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</label>
            {children}
        </div>
    );
}