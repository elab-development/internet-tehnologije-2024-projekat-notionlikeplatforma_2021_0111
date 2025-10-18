import { useState, useEffect } from "react";
import { useParams, useNavigate , useLocation} from "react-router-dom";
import api from "../axios";
import Button from "../components/Button";

function ToDoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
const location = useLocation();
const title = location.state?.title || "";
const [todo, setTodo] = useState({
    title: title,
    description: "",
  });
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    details: "",
    due_date: "",
  });
  const [loading, setLoading] = useState(true);
const [showReminderForm, setShowReminderForm] = useState(false); // da otvara/zatvara modal
const [reminder, setReminder] = useState({
  title: "",
  description: "",
  remind_at: "",
});
const [selectedTaskId, setSelectedTaskId] = useState(null); 
useEffect(() => {
    const fetchToDo = async () => {
      if (id === "new") {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/todolists/${id}`);
        setTodo({
          title: response.data.data.title,
          description: response.data.data.description,
        });

        const tasksResponse = await api.get(`/todolists/${id}/tasks`);
        setTasks(tasksResponse.data.data);
      } catch (err) {
        console.error("Greška pri učitavanju to-do liste:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToDo();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  // ✅ Dodaj novu To-Do listu
  const addToDoList = async () => {
    if (!todo.title.trim()) return alert("Naslov je obavezan.");
    try {
      const response = await api.post("/todolists", todo);
      const newId = response.data.data.id;
      navigate(`/todo/${newId}`, { state: { title: todo.title } });
    } catch (err) {
      console.error("Greška pri dodavanju To-Do liste:", err);
    }
  };


  if (loading) return <p>Loading tasks...</p>;

  // ✅ Toggle status (pending/done)
  const toggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "done" ? "pending" : "done";
    try {
      await api.put(`/todolists/${id}/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error("Greška pri promeni statusa:", err);
    }
  };

  // ✅ Dodavanje novog taska
 const addTask = async () => {
  if (!newTask.title.trim()) return;
  try {
    const response = await api.post(`/todolists/${id}/tasks`, {
      title: newTask.title,
      details: newTask.details,
      due_date: newTask.due_date,
    });

    // Novi task se nalazi u response.data.data
    setTasks([...tasks, response.data.data]);
    setNewTask({ title: "", details: "", due_date: "" });
  } catch (err) {
    console.error("Greška pri dodavanju taska:", err);
  }
};

const saveReminder = async () => {
  try {
    const response = await api.post("/reminders", {
      ...reminder,
      task_id: selectedTaskId, // ovo moraš imati negde u state ili proslediti
    });

    // ovde možeš dodati reminder u lokalni state taska, npr:
    setTasks(prev =>
      prev.map(t =>
        t.id === selectedTaskId
          ? { ...t, reminders: [...(t.reminders || []), response.data.reminder] }
          : t
      )
    );

    // resetuj formu i zatvori modal
    setReminder({ title: "", description: "", remind_at: "" });
    setShowReminderForm(false);
  } catch (err) {
    console.error("Greška pri dodavanju reminder-a:", err);
  }
};
  return (
    <div style={{ padding: "1em" }}>
      {/* ✅ Ako je nova lista — prikaz forme */}
      {id === "new" ? (
        <>
          <h2>Create New To-Do List</h2>
          <input
            type="text"
            placeholder="Title"
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
            style={{ display: "block", margin: "0.5em 0", width: "100%" }}
          />
          <textarea
            placeholder="Description"
            value={todo.description}
            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
            style={{ display: "block", marginBottom: "1em", width: "100%" }}
          />
          <Button label="Add To-Do List" onClick={addToDoList} />
        </>
      ) : (
        <>
          {/* ✅ Postojeća lista */}
          <h2>{todo.title}</h2>
          <p style={{ color: "#555" }}>{todo.description}</p>

          {/* Lista taskova */}
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className={task.status === "done" ? "done" : ""}>
                <input
                  type="checkbox"
                  checked={task.status === "done"}
                  onChange={() => toggleStatus(task.id, task.status)}
                  style={{ marginRight: "0.5em" }}
                />
                <span
                  style={{
                    textDecoration:
                      task.status === "done" ? "line-through" : "none",
                    marginRight: "1em",
                  }}
                >
                  {task.title}
                </span>
                {task.details && (
                  <small style={{ marginRight: "1em" }}>({task.details})</small>
                )}
                <input
                  type="datetime-local"
                  value={task.due_date ? task.due_date.slice(0, 16) : ""}
                  readOnly
                />
                <Button
                  label="Add Reminder"
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setShowReminderForm(true);
                  }}
                  style={{ marginLeft: "0.5em" }}
                />
              </li>
            ))}

            {/* Novi task */}
            <li style={{ display: "flex", alignItems: "center", marginTop: "1em" }}>
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                style={{ flex: 1, marginRight: "0.5em" }}
              />
              <input
                type="text"
                placeholder="Task details..."
                value={newTask.details}
                onChange={(e) =>
                  setNewTask({ ...newTask, details: e.target.value })
                }
                style={{ flex: 1, marginRight: "0.5em" }}
              />
              <input
                type="datetime-local"
                value={newTask.due_date}
                onChange={(e) =>
                  setNewTask({ ...newTask, due_date: e.target.value })
                }
                style={{ marginRight: "0.5em" }}
              />
              <Button label="Add Task" onClick={addTask} />
            </li>
          </ul>
        </>
      )}

      <div style={{ marginTop: "1em" }}>
        <Button label="Back to Dashboard" onClick={() => navigate("/dashboard")} />
      </div>

      {/* Reminder modal */}
      {showReminderForm && (
        <div className="modal-overlay" onClick={() => setShowReminderForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Reminder</h3>
            <input
              value={reminder.title}
              onChange={(e) =>
                setReminder({ ...reminder, title: e.target.value })
              }
              placeholder="Title"
            />
            <input
              value={reminder.description}
              onChange={(e) =>
                setReminder({ ...reminder, description: e.target.value })
              }
              placeholder="Description"
            />
            <input
              type="datetime-local"
              value={reminder.remind_at}
              onChange={(e) =>
                setReminder({ ...reminder, remind_at: e.target.value })
              }
            />
            <button onClick={saveReminder}>Save</button>
            <button onClick={() => setShowReminderForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToDoPage;
