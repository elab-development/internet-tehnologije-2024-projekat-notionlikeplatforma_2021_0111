import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
//import useLocalStorage from "../hooks/useLocalStorage";
import api from "../axios";
import DashboardStats from "../components/DashboardStats";
function Dashboard() {
  const [holidays, setHolidays] = useState([]);
 const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [todos, setTodos] =  useState([]);
  const [searchToDo, setSearchToDo] = useState("");
  const [reminders, setReminders] =  useState([]);
  const [searchReminders, setSearchReminders] = useState("");
  const navigate = useNavigate();

  const [notePage, setNotePage] = useState(1);
  const [todoPage, setTodoPage] = useState(1);
  const [reminderPage, setReminderPage] = useState(1);
  const [showReminderForm, setShowReminderForm] = useState(false); // da otvara/zatvara modal
const [reminder, setReminder] = useState({
  title: "",
  description: "",
  remind_at: "",
});
const [editingReminder, setEditingReminder] = useState(null); // ako nije null, znači da uređujemo

  const itemsPerPage = 3;
  useEffect(() => {
  const fetchHolidays = async () => {
    try {
      const response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2025/RS");
      const data = await response.json();
      setHolidays(data.slice(0, 5)); // uzmi samo prvih 5 praznika
    } catch (error) {
      console.error("Greška pri učitavanju praznika:", error);
    }
  };
  fetchHolidays();
}, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get("/notes");
        console.log("Fetched notes:", response.data.data);
console.log("Fetched notes length:", response.data.data.length);
        setNotes(response.data.data); // proveri da li je data ili samo response.data
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };

    fetchNotes();
  }, []);
  

 const addNote = () => {
  navigate("/note/new"); // idemo na NoteEditor za novu belešku
};

  const openNote = (id) => navigate(`/note/${id}`);

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const filteredNotes =
  searchTerm.trim() === ""
    ? notes // ako nema pretrage, uzmi sve
    : notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

// broj stranica
const totalNotePages = Math.ceil(filteredNotes.length / itemsPerPage);

// izračunavanje opsega
const startNoteIndex = (notePage - 1) * itemsPerPage;

// beleške koje se prikazuju na trenutnoj stranici
const currentNotes = filteredNotes.slice(
  startNoteIndex,
  startNoteIndex + itemsPerPage
);

useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.get("/todolists");
        setTodos(response.data.data); // proveri da li je data ili samo response.data
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };

    fetchTodos();
  }, []);
  const addToDo = () => {
    navigate("/todo/new");
  };

  const openToDo = (todo) => navigate(`/todo/${todo.id}`, { state: { title: todo.title } });

  const deleteToDo = async (id) => {
    try {
      await api.delete(`/todolists/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Failed to delete todolist:", err);
    }
  };

    const filteredTodos =
  searchToDo.trim() === ""
    ? todos // ako nema pretrage, uzmi sve
    : todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchToDo.toLowerCase())
      );
      useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await api.get("/reminders");
        setReminders(response.data.data); // proveri da li je data ili samo response.data
      } catch (err) {
        console.error("Failed to fetch reminders:", err);
      }
    };

    fetchReminders();
  }, []);
 
      const filteredReminders =
  searchReminders.trim() === ""
    ? reminders // ako nema pretrage, uzmi sve
    : reminders.filter((reminder) =>
        reminder.title.toLowerCase().includes(searchReminders.toLowerCase())
      );
const deleteReminder = async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
    } catch (err) {
      console.error("Failed to delete reminders:", err);
    }
  };
  const saveReminder = async () => {
  try {
    if (editingReminder) {
      const response = await api.put(`/reminders/${editingReminder.id}`, {
        ...reminder,
      });

      setReminders((prev) =>
        prev.map((r) =>
          r.id === editingReminder.id ? response.data.data : r
        )
      );
    } else {
      const response = await api.post("/reminders", { ...reminder });
      setReminders((prev) => [...prev, response.data.data]);
    }

    setReminder({ title: "", description: "", remind_at: "" });
    setEditingReminder(null);
    setShowReminderForm(false);
  } catch (err) {
    console.error("Greška pri čuvanju reminder-a:", err);
  }
};
  const totalTodoPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startTodoIndex = (todoPage - 1) * itemsPerPage;
  const currentTodos = filteredTodos.slice(startTodoIndex, startTodoIndex + itemsPerPage);
 const totalReminders = Math.ceil(filteredReminders.length / itemsPerPage);
  const startReminderIndex = (reminderPage - 1) * itemsPerPage;
  const currentReminders = filteredReminders.slice(startReminderIndex, startReminderIndex + itemsPerPage);
  return (
    <div className="dashboard">
      <h2 style={{WebkitTextStroke: "1px #2a5078", color: "white"}}>Welcome back!</h2>
      <section>
  <h3>Upcoming Holidays in Serbia</h3>
  {holidays.length === 0 ? (
    <p>Loading holidays...</p>
  ) : (
    <div className="holidays-container">
      {holidays.map((holiday) => (
        <Card
          key={holiday.date}
          title={holiday.localName}
          description={`Date: ${holiday.date}`}
        />
      ))}
    </div>
  )}
</section>
      
      <section>
        <h3>Your Notes</h3>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5em",
            marginBottom: "1em",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <Button label="Add Note" onClick={addNote} />
        <div className="notes-container">
          {currentNotes.map((note) => (
            <div key={note.id} className="note-wrapper">
              <Card
                title={note.title}
                description={note.content}
                onClick={() => openNote(note.id)}
              />
              <Button label="Delete" onClick={() => deleteNote(note.id)} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1em" }}>
          <Button
            label="Previous"
            onClick={() => setNotePage((p) => Math.max(p - 1, 1))}
            disabled={notePage === 1}
          />
          <span style={{ margin: "0 1em" }}>
            Page {notePage} of {totalNotePages || 1}
          </span>
          <Button
            label="Next"
            onClick={() => setNotePage((p) => Math.min(p + 1, totalNotePages))}
            disabled={notePage === totalNotePages || totalNotePages === 0}
          />
        </div>
      </section>

      <section>
        <h3>Your To-Do Lists</h3>
        <input
          type="text"
          placeholder="Search To-Do lists..."
          value={searchToDo}
          onChange={(e) => setSearchToDo(e.target.value)}
          style={{
            padding: "0.5em",
            marginBottom: "1em",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <Button label="Add To-Do List" onClick={addToDo} />
        <div className="todos-container">
          {currentTodos.map((todo) => (
            <div key={todo.id} className="todo-wrapper">
              <Card
                title={todo.title}
                description={`${todo.tasks.length} tasks`}
                onClick={() => openToDo(todo)}
              />
              <Button label="Delete" onClick={() => deleteToDo(todo.id)} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1em" }}>
          <Button
            label="Previous"
            onClick={() => setTodoPage((p) => Math.max(p - 1, 1))}
            disabled={todoPage === 1}
          />
          <span style={{ margin: "0 1em" }}>
            Page {todoPage} of {totalTodoPages || 1}
          </span>
          <Button
            label="Next"
            onClick={() => setTodoPage((p) => Math.min(p + 1, totalTodoPages))}
            disabled={todoPage === totalTodoPages || totalTodoPages === 0}
          />
        </div>
      </section>
      <section>
        <h3>Your Reminders</h3>
        <input
          type="text"
          placeholder="Search Reminders..."
          value={searchReminders}
          onChange={(e) => setSearchReminders(e.target.value)}
          style={{
            padding: "0.5em",
            marginBottom: "1em",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <Button label="Add Reminder" onClick={() => {
          setReminder({ title: "", description: "", remind_at: "" });
    setEditingReminder(null);
        setShowReminderForm(true);     // otvara modal
      }} />
        <div className="todos-container">
          {currentReminders.map((reminder) => (
            <div key={reminder.id} className="todo-wrapper">
              <Card
                title={reminder.title}
                description={reminder.remind_at}
                onClick={() => {
                 setReminder({
      title: reminder.title,
      description: reminder.description,
      remind_at: reminder.remind_at.slice(0, 16), // datetime-local format
    });
    setEditingReminder(reminder); // postavi da uređujemo
    setShowReminderForm(true);
  }}
              />
              <Button label="Delete" onClick={() => deleteReminder(reminder.id)} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1em" }}>
          <Button
            label="Previous"
            onClick={() => setReminderPage((p) => Math.max(p - 1, 1))}
            disabled={reminderPage === 1}
          />
          <span style={{ margin: "0 1em" }}>
            Page {reminderPage} of {totalReminders || 1}
          </span>
          <Button
            label="Next"
            onClick={() => setReminderPage((p) => Math.min(p + 1, totalReminders))}
            disabled={reminderPage === totalReminders || totalReminders === 0}
          />
        </div>
      </section>
       {showReminderForm && (
  <div className="modal-overlay" onClick={() => setShowReminderForm(false)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
     <h3>{editingReminder ? "Edit Reminder" : "Add Reminder"}</h3>
      <input
        value={reminder.title}
        onChange={(e) => setReminder({...reminder, title: e.target.value})}
        placeholder="Title"
      />
      <input
        value={reminder.description}
        onChange={(e) => setReminder({...reminder, description: e.target.value})}
        placeholder="Description"
      />
      <input
        type="datetime-local"
        value={reminder.remind_at}
        onChange={(e) => setReminder({...reminder, remind_at: e.target.value})}
      />
      <button onClick={saveReminder}>{editingReminder ? "Update" : "Save"}</button>
      <button onClick={() => setShowReminderForm(false)}>Cancel</button>
    </div>
  </div>
)}
 <DashboardStats notes={notes} todos={todos}/>
  </div>
  );
}

export default Dashboard;