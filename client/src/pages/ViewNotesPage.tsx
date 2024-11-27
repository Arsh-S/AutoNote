import React, { useEffect, useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import { useAuthUser } from "../auth/AuthUserProvider";

const ViewNotesPage = () => {
  const { user, loading } = useAuthUser();
  const [notes, setNotes] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetch("http://localhost:5000/api/notes", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setNotes(data))
        .catch((error) => {
          console.error("Error fetching notes:", error);
          setMessage("Error fetching notes.");
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="centered-container">
      <div className="container center-content">
        <NavigationButtons />
        <h1>Your Notes</h1>
        {!user ? (
          <p>You must be signed in to view your notes.</p>
        ) : (
          <>
            {message && <p>{message}</p>}
            <div className="notes-container">
              {notes.map((note) => (
                <div className="note-card" key={note.id}>
                  <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                    {note.title}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewNotesPage;