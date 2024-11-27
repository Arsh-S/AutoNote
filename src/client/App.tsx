import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import ViewNotesPage from "./pages/ViewNotesPage";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/view-notes" element={<ViewNotesPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;