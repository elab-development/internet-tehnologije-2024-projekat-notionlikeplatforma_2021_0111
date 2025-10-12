import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });

  useEffect(() => {
    // Ovde bi kasnije učitala note iz localStorage ili API
    setNote({ title: `Note ${id}`, content: "Edit your note here..." });
  }, [id]);

  const saveNote = () => {
    alert("Note saved! (demo)");
    navigate("/dashboard");
  };

  return (
    <div className="note-editor">
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