import React, { useEffect, useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import { useAuthUser } from "../auth/AuthUserProvider";

const ViewNotesPage = () => {
  const { user } = useAuthUser();
  const [notes, setNotes] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const idToken = await user?.getIdToken();
        const response = await fetch("http://localhost:5174/api/notes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setNotes(data);
        } else {
          setMessage(`Failed to fetch notes: ${data.error}`);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        setMessage("Error fetching notes.");
      }
    };

    if (user) {
      fetchNotes();
    }
  }, [user]);

  return (
    <div className="centered-container">
      <div className="container center-content">
        <NavigationButtons />
        <h1>Your Notes</h1>
        {!user ? (
          <p>You must be signed in to view notes.</p>
        ) : (
          <>
            {message && <p>{message}</p>}
            <div className="notes-container">
              {notes.map((note) => (
                <div className="note-card" key={note.name}>
                  <a href={note.url} target="_blank" rel="noopener noreferrer">
                    {note.name}
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