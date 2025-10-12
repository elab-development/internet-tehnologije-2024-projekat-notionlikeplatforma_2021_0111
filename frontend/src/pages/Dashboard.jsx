import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  // Note functions
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: `New Note ${notes.length + 1}`,
      content: "Empty note...",
    };
    setNotes([...notes, newNote]);
  };

  const openNote = (id) => navigate(`/note/${id}`);

  // To-Do functions
  const addToDo = () => {
    const newToDo = {
      id: Date.now(),
      title: `New To-Do ${todos.length + 1}`,
      tasks: [],
    };
    setTodos([...todos, newToDo]);
  };

  const openToDo = (id) => navigate(`/todo/${id}`);

  return (
    <div className="dashboard">
      <h2>Welcome back!</h2>

      <section>
        <h3>Your Notes</h3>
        <Button label="Add Note" onClick={addNote} />
        <div className="notes-container">
          {notes.map((note) => (
            <Card
              key={note.id}
              title={note.title}
              description={note.content}
              onClick={() => openNote(note.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h3>Your To-Do Lists</h3>
        <Button label="Add To-Do List" onClick={addToDo} />
        <div className="todos-container">
          {todos.map((todo) => (
            <Card
              key={todo.id}
              title={todo.title}
              description={`${todo.tasks.length} tasks`}
              onClick={() => openToDo(todo.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;