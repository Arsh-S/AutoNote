import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthUserProvider, useAuthUser } from "./auth/AuthUserProvider";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import ViewNotesPage from "./pages/ViewNotesPage";
import AuthButton from "./components/AuthButton";

const App = () => {
  return (
    <AuthUserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PageWrapper component={<HomePage />} />} />
          <Route path="/upload" element={<PageWrapper component={<UploadPage />} />} />
          <Route path="/view" element={<PageWrapper component={<ViewNotesPage />} />} />
        </Routes>
      </Router>
    </AuthUserProvider>
  );
};

const PageWrapper = ({ component }: { component: React.ReactNode }) => {
  const { user, loading } = useAuthUser();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {component}
    </div>
  );
};

export default App;