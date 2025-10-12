import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import useLocalStorage from "../hooks/useLocalStorage";

function Dashboard() {
  const [notes, setNotes] = useLocalStorage("notes", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [searchToDo, setSearchToDo] = useState("");
  const navigate = useNavigate();

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

  return (
    <div className="dashboard">
      <h2>Welcome back!</h2>

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
          {filteredNotes.map((note) => (
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
          {filteredTodos.map((todo) => (
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
      </section>
    </div>
  );
}

export default Dashboard;