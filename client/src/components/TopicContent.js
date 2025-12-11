import React, { useState } from 'react';

const QuestionItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="question-item" onClick={() => setIsOpen(!isOpen)}>
      <div className="question-text">{question}</div>
      {isOpen && <div className="answer">{answer}</div>}
    </div>
  );
};

const TopicContent = ({ topic }) => {
  return (
    <div className="topic-section">
      {/* Header Section */}
      <div className="topic-header">
        <h2 className="topic-title">{topic.title}</h2>
        {topic.subtitle && <p className="topic-subtitle">{topic.subtitle}</p>}
      </div>

      {/* Quick Summary */}
      {topic.summary && (
        <div className="topic-summary">
          <div className="summary-content">
            <h4>Quick Summary</h4>
            <p>{topic.summary}</p>
          </div>
        </div>
      )}

      {/* Main Explanation */}
      {topic.explanation && (
        <div className="explanation-section">
          <h3 className="section-header">Detailed Explanation</h3>
          <div className="explanation">
            {topic.explanation.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              if (trimmed.endsWith(':') && trimmed.length < 100) {
                return <h4 key={index} className="explanation-heading">{trimmed}</h4>;
              }
              if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                return <li key={index} className="explanation-list-item">{trimmed.substring(2)}</li>;
              }
              return <p key={index} className="explanation-paragraph">{trimmed}</p>;
            })}
          </div>
        </div>
      )}

      {/* Real World Analogy */}
      {topic.analogy && (
        <div className="analogy-box">
          <div className="analogy-header">
            <h4>Real-World Analogy</h4>
          </div>
          <p className="analogy-content">{topic.analogy}</p>
        </div>
      )}

      {/* Key Points */}
      {topic.keyPoints && (
        <div className="key-points-section">
          <h3 className="section-header">Key Points</h3>
          {topic.id === 'interview-discussions' ? (
            <div className="discussion-key-points">
              {topic.keyPoints.map((point, index) => (
                <div key={index} className="discussion-point">
                  <span className="point-bullet">•</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="key-points-grid">
              {topic.keyPoints.map((point, index) => (
                <div key={index} className="key-point-card">
                  <span className="point-number">{index + 1}</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visual Diagram */}
      {topic.diagram && (
        <div className="diagram-section">
          <h3 className="section-header">Visual Diagram</h3>
          <div className="diagram-container">
            <img src={topic.diagram} alt="Diagram" className="diagram-image" />
          </div>
        </div>
      )}

      {/* Code Examples */}
      {topic.codeExamples && topic.codeExamples.length > 0 && (
        <div className="code-examples-section">
          <h3 className="section-header">Code Examples</h3>
          {topic.codeExamples.map((example, index) => (
            <div key={index} className="code-example-card">
              <div className="example-header">
                <span className="example-number">Example {index + 1}</span>
                <h4 className="example-title">{example.title}</h4>
              </div>
              {example.description && (
                <p className="example-description">{example.description}</p>
              )}
              <div className="code-block">
                <pre>{example.code}</pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Learning Resources */}
      {topic.resources && topic.resources.length > 0 && (
        <div className="resources-section">
          <h3 className="section-header">{topic.id === 'interview-discussions' ? 'Discussion Platforms' : 'Learning Resources'}</h3>
          {topic.id === 'interview-discussions' ? (
            <div className="discussion-resources">
              {topic.resources.map((resource, index) => (
                <div key={index} className="discussion-resource">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="resource-link"
                  >
                    {resource.title}
                  </a>
                  <p className="resource-desc">{resource.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="resources-grid">
              {topic.resources.map((resource, index) => (
                <a 
                  key={index} 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="resource-card"
                >
                  <div className="resource-content">
                    <h5 className="resource-title">{resource.title}</h5>
                    {resource.description && (
                      <p className="resource-description">{resource.description}</p>
                    )}
                  </div>
                  <div className="resource-arrow">→</div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Technical Interview Questions */}
      {topic.questions && topic.questions.length > 0 && (
        <div className="questions-section">
          <h3 className="section-header">Technical Interview Questions ({topic.questions.length})</h3>
          <div className="questions-list">
            {topic.questions.map((question, index) => (
              <QuestionItem 
                key={index} 
                question={question.question} 
                answer={question.answer} 
                index={index} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Behavioral Interview Questions */}
      {topic.behavioralQuestions && topic.behavioralQuestions.length > 0 && (
        <div className="questions-section">
          <h3 className="section-header">Behavioral & Communication Questions ({topic.behavioralQuestions.length})</h3>
          <div className="questions-list">
            {topic.behavioralQuestions.map((question, index) => (
              <QuestionItem 
                key={index} 
                question={question.question} 
                answer={question.answer} 
                index={index} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Discussion Links */}
      {topic.discussions && topic.discussions.length > 0 && (
        <div className="resources-section">
          <h3 className="section-header">Discussion Links</h3>
          <div className={topic.id === 'community-discussion-links' ? 'discussion-resources' : 'resources-grid'}>
            {topic.discussions.map((discussion, index) => (
              topic.id === 'community-discussion-links' ? (
                <div key={index} className="discussion-resource">
                  <a 
                    href={discussion.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="resource-link"
                  >
                    {discussion.title}
                  </a>
                  <p className="resource-desc">{discussion.description}</p>
                </div>
              ) : (
                <a 
                  key={index} 
                  href={discussion.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="resource-card"
                >
                  <div className="resource-content">
                    <h5 className="resource-title">{discussion.title}</h5>
                    {discussion.description && (
                      <p className="resource-description">{discussion.description}</p>
                    )}
                  </div>
                  <div className="resource-arrow">→</div>
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicContent;