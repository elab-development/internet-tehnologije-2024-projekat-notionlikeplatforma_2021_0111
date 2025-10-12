import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import useLocalStorage from "../hooks/useLocalStorage";

function ToDoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Učitaj zadatke za trenutno todo
  useEffect(() => {
    const current = todos.find((t) => t.id === parseInt(id));
    if (current) setTasks(current.tasks);
  }, [id, todos]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newItem = { id: Date.now(), text: newTask, done: false, reminder: "" };
    const updatedTasks = [...tasks, newItem];
    setTasks(updatedTasks);

    // Ažuriraj lokalno todos
    const updatedTodos = todos.map((t) =>
      t.id === parseInt(id) ? { ...t, tasks: updatedTasks } : t
    );
    setTodos(updatedTodos);

    setNewTask("");
  };

  const toggleDone = (taskId) => {
    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
    setTasks(updatedTasks);

    const updatedTodos = todos.map((t) =>
      t.id === parseInt(id) ? { ...t, tasks: updatedTasks } : t
    );
    setTodos(updatedTodos);
  };

  const setReminder = (taskId, reminder) => {
    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, reminder } : t));
    setTasks(updatedTasks);

    const updatedTodos = todos.map((t) =>
      t.id === parseInt(id) ? { ...t, tasks: updatedTasks } : t
    );
    setTodos(updatedTodos);
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