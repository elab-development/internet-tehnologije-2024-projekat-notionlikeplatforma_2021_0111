import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import useLocalStorage from "../hooks/useLocalStorage";

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useLocalStorage("notes", []);
  const [note, setNote] = useState({ title: "", content: "" });


  useEffect(() => {
    const current = notes.find((n) => n.id === parseInt(id));
    if (current) setNote(current);
  }, [id, notes]);

  const saveNote = () => {
    const updatedNotes = notes.map((n) => (n.id === parseInt(id) ? note : n));
    setNotes(updatedNotes);
    navigate("/dashboard");
  };

  return (
    <div className="note-editor">
      <Breadcrumbs notes={notes} />
      <input
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      />
      <Button label="Save Note" onClick={saveNote} />
    </div>
  );
}

export default NoteEditor;