import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";

function ToDoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newItem = { id: Date.now(), text: newTask, done: false, reminder: "" };
    setTasks([...tasks, newItem]);
    setNewTask("");
  };

  const toggleDone = (taskId) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  };

  const setReminder = (taskId, reminder) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, reminder } : t)));
  };

  return (
    <div className="todo-page">
      <h2>To-Do List {id}</h2>

      <div className="add-task">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
        />
        <Button label="Add Task" onClick={addTask} />
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            <span onClick={() => toggleDone(task.id)}>{task.text}</span>
            <input
              type="datetime-local"
              value={task.reminder}
              onChange={(e) => setReminder(task.id, e.target.value)}
            />
          </li>
        ))}
      </ul>

      <Button label="Back to Dashboard" onClick={() => navigate("/dashboard")} />
    </div>
  );
}

export default ToDoPage;