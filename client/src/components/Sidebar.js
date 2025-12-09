import React from 'react';

const Sidebar = ({ categories, activeCategory, activeTopicId, onTopicChange, isOpen, onClose }) => {
  const currentCategory = categories[activeCategory];
  
  const handleTopicClick = (topicId) => {
    onTopicChange(topicId);
    if (onClose) onClose();
  };
  
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <ul className="topic-list">
          {currentCategory.topics.map(topic => (
            <li
              key={topic.id}
              className={`topic-item ${activeTopicId === topic.id ? 'active' : ''}`}
              onClick={() => handleTopicClick(topic.id)}
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