// Shared types

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
};

export type Note = {
    id: string;
    title: string;
    description?: string;
    fileUrl: string;
    createdAt: string;
    updatedAt?: string;
    ownerId: string;
};

export type NotesAPIResponse = {
    message: string;
    data: Note[];
};

export type UploadNoteRequest = {
    title: string;
    description?: string;
    fileData: string;
};

export type UploadNoteResponse = {
    message: string;
    data: Note;
};

export type DeleteNoteResponse = {
    message: string;
};

export type NoteLog = {
    noteId: string;
    action: "created" | "updated" | "deleted";
    timestamp: string;
    userId: string;
};
