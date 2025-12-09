import React from 'react';
import CodeBlock from './CodeBlock';
import QuestionsList from './QuestionsList';

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
      <div className="explanation-section">
        <h3 className="section-header">Detailed Explanation</h3>
        <div className="explanation">
          {topic.explanation.split('\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            if (trimmed.endsWith(':') && trimmed.length < 100) {
              return <h4 key={index} className="explanation-heading">{trimmed}</h4>;
            }
            if (trimmed.startsWith('- ')) {
              return <li key={index} className="explanation-list-item">{trimmed.substring(2)}</li>;
            }
            return <p key={index} className="explanation-paragraph">{trimmed}</p>;
          })}
        </div>
      </div>

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
          <div className="key-points-grid">
            {topic.keyPoints.map((point, index) => (
              <div key={index} className="key-point-card">
                <span className="point-number">{index + 1}</span>
                <p>{point}</p>
              </div>
            ))}
          </div>
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
              <CodeBlock code={example.code} language={example.language} />
            </div>
          ))}
        </div>
      )}

      {/* Learning Resources */}
      {topic.resources && topic.resources.length > 0 && (
        <div className="resources-section">
          <h3 className="section-header">Learning Resources</h3>
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
        </div>
      )}

      {/* Interview Questions */}
      {topic.questions && topic.questions.length > 0 && (
        <div className="questions-section">
          <h3 className="section-header">Interview Questions ({topic.questions.length})</h3>
          <QuestionsList questions={topic.questions} />
        </div>
      )}
    </div>
  );
};

export default TopicContent;