import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";

interface Note {
  name: string;
  url: string;
}

const ViewNotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [message, setMessage] = useState("");

  const fetchNotes = async () => {
    const token = "YOUR_FIREBASE_ID_TOKEN"; // Replace with actual token
    try {
      const response = await fetch("http://localhost:5000/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) setNotes(data);
      else setMessage(`Error: ${data.error}`);
    } catch (error) {
      setMessage("Failed to fetch notes.");
    }
  };

  const handleDelete = async (name: string) => {
    const token = "YOUR_FIREBASE_ID_TOKEN"; // Replace with actual token
    try {
      const response = await fetch(`http://localhost:5000/notes/${name}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setNotes((prev) => prev.filter((note) => note.name !== name));
        setMessage(`File "${name}" deleted successfully.`);
      } else {
        setMessage("Failed to delete the note.");
      }
    } catch (error) {
      setMessage("Failed to delete the note.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container">
      <h2>Uploaded Notes</h2>
      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.name}>
              <a href={note.url} target="_blank" rel="noopener noreferrer">
                {note.name}
              </a>
              <button onClick={() => handleDelete(note.name)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      {message && <p className="message">{message}</p>}
      <Navigation isLoggedIn={true} />
    </div>
  );
};

export default ViewNotesPage;