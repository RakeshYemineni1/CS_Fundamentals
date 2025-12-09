import React from 'react';

const Sidebar = ({ categories, activeCategory, activeTopicId, onTopicChange }) => {
  const currentCategory = categories[activeCategory];
  
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <ul className="topic-list">
          {currentCategory.topics.map(topic => (
            <li
              key={topic.id}
              className={`topic-item ${activeTopicId === topic.id ? 'active' : ''}`}
              onClick={() => onTopicChange(topic.id)}
            >
              {topic.title}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;