import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import api from "../axios"; // koristi backend umesto useLocalStorage

function NoteEditor() {
  const { id } = useParams(); // id može biti "new" ili broj
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });

  // Ako je edit postojeće beleške, fetchuj je iz baze
  useEffect(() => {
    if (id !== "new") {
      const fetchNote = async () => {
        try {
          const response = await api.get(`/notes/${id}`);
          setNote(response.data.data);
        } catch (err) {
          console.error("Failed to fetch note:", err);
        }
      };
      fetchNote();
    }
  }, [id]);

  const saveNote = async () => {
    try {
      if (id === "new") {
        // kreiranje nove beleške
        const response = await api.post("/notes", note);
        // posle kreiranja idemo nazad na dashboard
        navigate("/dashboard");
      } else {
        // update postojeće beleške
        await api.put(`/notes/${id}`, note);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  return (
    <div className="note-editor">
      <Breadcrumbs note={note}  />
      <input
        placeholder="Title"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      />
      <Button label={id === "new" ? "Add Note" : "Save Note"} onClick={saveNote} />
    </div>
  );
}

export default NoteEditor;
