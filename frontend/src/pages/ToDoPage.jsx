import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import useLocalStorage from "../hooks/useLocalStorage";

function ToDoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [todo, setTodo] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [newReminder, setNewReminder] = useState("");

  useEffect(() => {
    const current = todos.find((t) => t.id === parseInt(id));
    if (current) setTodo(current);
  }, [id, todos]);

  if (!todo) return <p>Loading...</p>;

  const handleTitleChange = (e) => {
    const updated = { ...todo, title: e.target.value };
    setTodo(updated);
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newItem = {
      id: Date.now(),
      text: newTask,
      done: false,
      reminder: newReminder,
    };
    const updatedTasks = [...todo.tasks, newItem];
    const updated = { ...todo, tasks: updatedTasks };
    setTodo(updated);
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    setNewTask("");
    setNewReminder("");
  };

  const toggleDone = (taskId) => {
    const updatedTasks = todo.tasks.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    const updated = { ...todo, tasks: updatedTasks };
    setTodo(updated);
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
  };

  const setReminder = (taskId, reminder) => {
    const updatedTasks = todo.tasks.map((t) =>
      t.id === taskId ? { ...t, reminder } : t
    );
    const updated = { ...todo, tasks: updatedTasks };
    setTodo(updated);
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = todo.tasks.filter((t) => t.id !== taskId);
    const updated = { ...todo, tasks: updatedTasks };
    setTodo(updated);
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
  };

  const deleteList = () => {
    const updatedTodos = todos.filter((t) => t.id !== todo.id);
    setTodos(updatedTodos);
    navigate("/dashboard");
  };

  return (
    <div className="todo-page" style={{ padding: "1em" }}>
      <Breadcrumbs todos={todos} />
      <h2>Edit To-Do List</h2>

      <input
        type="text"
        value={todo.title}
        onChange={handleTitleChange}
        style={{
          padding: "0.5em",
          marginBottom: "1em",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "300px",
        }}
      />

      <div className="add-task" style={{ marginBottom: "1em" }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
          style={{ marginRight: "0.5em" }}
        />
        <input
          type="datetime-local"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          style={{ marginRight: "0.5em" }}
        />
        <Button label="Add Task" onClick={addTask} />
      </div>

      <ul>
        {todo.tasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleDone(task.id)}
              style={{ marginRight: "0.5em" }}
            />
            <span
              style={{
                textDecoration: task.done ? "line-through" : "none",
                marginRight: "1em",
              }}
            >
              {task.text}
            </span>
            <input
              type="datetime-local"
              value={task.reminder}
              onChange={(e) => setReminder(task.id, e.target.value)}
            />
            <Button
              label="Delete"
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: "0.5em" }}
            />
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "1em" }}>
        <Button label="Back to Dashboard" onClick={() => navigate("/dashboard")} />
        <Button
          label="Delete Entire List"
          onClick={deleteList}
          style={{ backgroundColor: "red", marginLeft: "0.5em" }}
        />
      </div>
    </div>
  );
}

export default ToDoPage;