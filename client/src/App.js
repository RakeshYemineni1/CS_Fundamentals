import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopicContent from './components/TopicContent';
import { topics } from './data/topics';
import { osTopics } from './data/osTopics';
import { dbmsTopics } from './data/dbmsTopics';
import { cnTopics } from './data/cnTopics';
import { interviewTopics } from './data/interviewTopics';


function App() {
  const [activeCategory, setActiveCategory] = useState('oop');
  const [activeTopicId, setActiveTopicId] = useState('encapsulation');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  const categories = {
    oop: { name: 'Object-Oriented Programming', topics: topics },
    os: { name: 'Operating Systems', topics: osTopics },
    dbms: { name: 'Database Management Systems', topics: dbmsTopics },
    cn: { name: 'Computer Networks', topics: cnTopics },
    interview: { name: 'Interview Questions', topics: interviewTopics },

  };

  const currentTopics = categories[activeCategory].topics;
  const activeTopic = currentTopics.find(topic => topic.id === activeTopicId);

  const handleCategoryChange = (category) => {
    const firstTopicId = categories[category].topics[0].id;
    setActiveTopicId(firstTopicId);
    setActiveCategory(category);
  };

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="header-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <h1>CS Fundamentals</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                className="contact-btn"
                onClick={() => alert('📧 Contact Us\n\nWe welcome your contributions to improve this platform:\n\n• Submit interview questions and experiences\n• Suggest missing topics or concepts\n• Provide feedback and improvements\n• Report issues or bugs\n\nEmail: yrk122005@gmail.com\n\nThank you for helping us build a comprehensive CS learning resource!')}
              >
                Contact
              </button>
              <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? (
                  <>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/>
                      <line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <nav className="navbar">
            {Object.entries(categories).map(([categoryKey, category]) => (
              <button
                key={categoryKey}
                className={`nav-item ${activeCategory === categoryKey ? 'active' : ''}`}
                onClick={() => handleCategoryChange(categoryKey)}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </header>
        
        <div className="main-layout">
          <Sidebar 
            key={activeCategory}
            categories={categories}
            activeCategory={activeCategory}
            activeTopicId={activeTopicId}
            onCategoryChange={handleCategoryChange}
            onTopicChange={setActiveTopicId}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          
          <main className="content">
            <div className="content-container">
              {activeTopic && <TopicContent topic={activeTopic} />}
            </div>
          </main>
        </div>
        
        <footer className="footer">
          <div className="container">
            <p>Comprehensive CS Fundamentals Guide - Master Computer Science Concepts</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;