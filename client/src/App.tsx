import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import PDFUploadPage from './pages/PDFUploadPage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className='navbar-spacer'></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<PDFUploadPage />} />
      </Routes>
    </Router>
  );
};

export default App;