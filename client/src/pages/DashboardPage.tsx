import React from 'react';
import "./DashboardPage.css";

const DashboardPage: React.FC = () => {
  // placeholder data 
  const pdfs = [
    { id: '1', title: 'Trends in Web Dev' },
    { id: '2', title: 'CS 2110' },
    { id: '3', title: 'Math 1920' },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your PDFs</h1>
      <div className="pdf-list">
        {pdfs.map((pdf) => (
          <div key={pdf.id} className="pdf-card">
            <h3 className="pdf-title">{pdf.title}</h3>
            <button className="view-button">View</button>
            <button className="delete-button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;