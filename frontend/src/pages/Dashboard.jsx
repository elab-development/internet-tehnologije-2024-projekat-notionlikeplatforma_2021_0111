import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Breadcrumbs from "../components/Breadcrumbs";
import useLocalStorage from "../hooks/useLocalStorage";

function Dashboard() {
  const [notes, setNotes] = useLocalStorage("notes", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [searchToDo, setSearchToDo] = useState("");
  const navigate = useNavigate();

  const [notePage, setNotePage] = useState(1);
  const [todoPage, setTodoPage] = useState(1);
  const itemsPerPage = 5;

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: `New Note ${notes.length + 1}`,
      content: "Empty note...",
    };
    setNotes([...notes, newNote]);
  };

  const openNote = (id) => navigate(`/note/${id}`);

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalNotePages = Math.ceil(filteredNotes.length / itemsPerPage);
  const startNoteIndex = (notePage - 1) * itemsPerPage;
  const currentNotes = filteredNotes.slice(startNoteIndex, startNoteIndex + itemsPerPage);

  const addToDo = () => {
    const newToDo = {
      id: Date.now(),
      title: `New To-Do ${todos.length + 1}`,
      tasks: [],
    };
    setTodos([...todos, newToDo]);
  };

  const openToDo = (id) => navigate(`/todo/${id}`);

  const deleteToDo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchToDo.toLowerCase())
  );

  const totalTodoPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startTodoIndex = (todoPage - 1) * itemsPerPage;
  const currentTodos = filteredTodos.slice(startTodoIndex, startTodoIndex + itemsPerPage);

  return (
    <div className="dashboard">
      <h2>Welcome back!</h2>

      <Breadcrumbs notes={notes} todos={todos} />
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
                onClick={() => openToDo(todo.id)}
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
    </div>
  );
}

export default Dashboard;