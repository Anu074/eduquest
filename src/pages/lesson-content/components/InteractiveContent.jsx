import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Image from '../../../components/AppImage';

const InteractiveContent = ({ 
  content, 
  onInteraction, 
  onComplete 
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [completedInteractions, setCompletedInteractions] = useState(new Set());

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));

    // Show immediate feedback
    const question = content?.interactions?.find(q => q?.id === questionId);
    const isCorrect = question?.correctAnswer === answerId;
    
    setShowFeedback(prev => ({
      ...prev,
      [questionId]: {
        isCorrect,
        message: isCorrect ? question?.correctFeedback : question?.incorrectFeedback
      }
    }));

    // Mark as completed
    setCompletedInteractions(prev => new Set([...prev, questionId]));

    if (onInteraction) {
      onInteraction(questionId, answerId, isCorrect);
    }

    // Check if all interactions are completed
    if (completedInteractions?.size + 1 === content?.interactions?.length) {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }
  };

  const handleHotspotClick = (hotspot) => {
    setShowFeedback(prev => ({
      ...prev,
      [hotspot?.id]: {
        isCorrect: true,
        message: hotspot?.description
      }
    }));

    if (onInteraction) {
      onInteraction(hotspot?.id, 'clicked', true);
    }
  };

  const renderTextContent = () => (
    <div className="prose prose-lg max-w-none">
      <div 
        className="text-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content?.text }}
      />
    </div>
  );

  const renderImageWithHotspots = () => (
    <div className="relative inline-block">
      <Image
        src={content?.image?.src}
        alt={content?.image?.alt}
        className="w-full h-auto rounded-lg"
      />
      
      {content?.image?.hotspots?.map((hotspot) => (
        <button
          key={hotspot?.id}
          className="absolute w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform animate-pulse"
          style={{
            left: `${hotspot?.x}%`,
            top: `${hotspot?.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => handleHotspotClick(hotspot)}
          title={hotspot?.title}
        >
          {hotspot?.id}
        </button>
      ))}

      {/* Hotspot Feedback */}
      {content?.image?.hotspots?.map((hotspot) => (
        showFeedback?.[hotspot?.id] && (
          <div
            key={`feedback-${hotspot?.id}`}
            className="absolute bg-popover border border-border rounded-lg p-3 shadow-lg max-w-xs z-10"
            style={{
              left: `${hotspot?.x}%`,
              top: `${hotspot?.y + 10}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-sm text-foreground">
              {showFeedback?.[hotspot?.id]?.message}
            </div>
            <button
              onClick={() => setShowFeedback(prev => ({ ...prev, [hotspot?.id]: null }))}
              className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center"
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        )
      ))}
    </div>
  );

  const renderQuizQuestions = () => (
    <div className="space-y-6">
      {content?.interactions?.map((question) => (
        <div key={question?.id} className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-lg font-medium text-foreground mb-4">
            {question?.question}
          </h4>

          <div className="space-y-3">
            {question?.options?.map((option) => (
              <button
                key={option?.id}
                onClick={() => handleAnswerSelect(question?.id, option?.id)}
                disabled={completedInteractions?.has(question?.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswers?.[question?.id] === option?.id
                    ? showFeedback?.[question?.id]?.isCorrect
                      ? 'border-success bg-success/10 text-success' :'border-error bg-error/10 text-error' :'border-border hover:border-primary hover:bg-primary/5'
                } ${
                  completedInteractions?.has(question?.id) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers?.[question?.id] === option?.id
                      ? showFeedback?.[question?.id]?.isCorrect
                        ? 'border-success bg-success text-white' :'border-error bg-error text-white' :'border-muted-foreground'
                  }`}>
                    {selectedAnswers?.[question?.id] === option?.id && (
                      <Icon 
                        name={showFeedback?.[question?.id]?.isCorrect ? "Check" : "X"} 
                        size={14} 
                      />
                    )}
                  </div>
                  <span className="text-foreground">{option?.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback?.[question?.id] && (
            <div className={`mt-4 p-4 rounded-lg ${
              showFeedback?.[question?.id]?.isCorrect
                ? 'bg-success/10 border border-success/20' :'bg-error/10 border border-error/20'
            }`}>
              <div className="flex items-start space-x-2">
                <Icon 
                  name={showFeedback?.[question?.id]?.isCorrect ? "CheckCircle" : "XCircle"} 
                  size={20} 
                  className={showFeedback?.[question?.id]?.isCorrect ? 'text-success' : 'text-error'}
                />
                <div>
                  <p className={`font-medium ${
                    showFeedback?.[question?.id]?.isCorrect ? 'text-success' : 'text-error'
                  }`}>
                    {showFeedback?.[question?.id]?.isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {showFeedback?.[question?.id]?.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDragAndDrop = () => (
    <div className="bg-card border border-border rounded-lg p-6">
      <h4 className="text-lg font-medium text-foreground mb-4">
        {content?.dragDrop?.instruction}
      </h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Draggable Items */}
        <div className="space-y-3">
          <h5 className="font-medium text-muted-foreground">Items to Match</h5>
          <div className="space-y-2">
            {content?.dragDrop?.items?.map((item) => (
              <div
                key={item?.id}
                className="p-3 bg-muted rounded-lg border border-border cursor-move hover:bg-muted-foreground/10 transition-colors"
                draggable
              >
                {item?.text}
              </div>
            ))}
          </div>
        </div>

        {/* Drop Zones */}
        <div className="space-y-3">
          <h5 className="font-medium text-muted-foreground">Drop Zones</h5>
          <div className="space-y-2">
            {content?.dragDrop?.zones?.map((zone) => (
              <div
                key={zone?.id}
                className="p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center text-muted-foreground hover:border-primary/50 transition-colors"
              >
                {zone?.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Text Content */}
      {content?.text && renderTextContent()}
      {/* Image with Hotspots */}
      {content?.image && renderImageWithHotspots()}
      {/* Interactive Quiz Questions */}
      {content?.interactions && renderQuizQuestions()}
      {/* Drag and Drop */}
      {content?.dragDrop && renderDragAndDrop()}
      {/* Completion Status */}
      {completedInteractions?.size === content?.interactions?.length && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <span className="font-medium text-success">
              Great job! You've completed all interactive elements.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveContent;