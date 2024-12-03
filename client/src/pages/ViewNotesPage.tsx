import React, { useEffect, useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import { useAuthUser } from "../auth/AuthUserProvider";
import ReactMarkdown from "react-markdown";
import Header from "../components/Header";

const ViewNotesPage = () => {
    const { user } = useAuthUser();
    const [notes, setNotes] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [selectedNote, setSelectedNote] = useState<any | null>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [noteContent, setNoteContent] = useState("");

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

    const handleDelete = async (noteName: string) => {
        try {
            const idToken = await user?.getIdToken();
            const response = await fetch(`http://localhost:5174/api/notes/${noteName}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (response.ok) {
                setNotes(notes.filter((note) => note.name !== noteName));
                setMessage(`Note "${noteName}" deleted successfully.`);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete note: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            setMessage("Error deleting note.");
        }
    };

    const handleDownload = (note: any) => {
        const link = document.createElement("a");
        link.href = note.url;
        link.download = note.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleView = async (note: any) => {
        try {
            if (note.name.endsWith(".md")) {
                const idToken = await user?.getIdToken();
                const response = await fetch(`http://localhost:5174/api/proxy-file?url=${encodeURIComponent(note.url)}`, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });
                const markdownContent = await response.text();
                setNoteContent(markdownContent);
            } else {
                setNoteContent("");
            }
            setSelectedNote(note);
            setPopupVisible(true);
        } catch (error) {
            console.error("Error loading note content:", error);
            setMessage("Error loading note content.");
        }
    };

    const closePopup = () => {
        setPopupVisible(false);
        setSelectedNote(null);
        setNoteContent("");
    };

    return (
        <div className="centered-container">
            <Header />
            <div className="container center-content">
                <NavigationButtons />
                <h1>Your Notes</h1>
                {!user ? (
                    <p>You must be signed in to view notes.</p>
                ) : (
                    <>
                        {message && <p>{message}</p>}
                        <div className="notes-container">
                            {notes.length === 0 ? (
                                <p>No notes found.</p>
                            ) : (
                                notes.map((note) => (
                                    <div className="note-card" key={note.name}>
                                        <p>{note.name}</p>
                                        <div className="note-actions">
                                            <button onClick={() => handleView(note)}>View</button>
                                            <button onClick={() => handleDownload(note)}>Download</button>
                                            <button onClick={() => handleDelete(note.name)} className="delete-btn">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            {popupVisible && selectedNote && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedNote.name}</h2>
                        {selectedNote.name.endsWith(".md") ? (
                            <div className="markdown-preview">
                                <ReactMarkdown>{noteContent}</ReactMarkdown>
                            </div>
                        ) : (
                            <iframe src={selectedNote.url} title={selectedNote.name} className="note-preview"></iframe>
                        )}
                        <button onClick={closePopup} className="close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewNotesPage;
