import React from 'react';
import Icon from '../../../components/AppIcon';

const QuizProgress = ({ 
  currentQuestion, 
  totalQuestions, 
  timeRemaining = null,
  score = null,
  isCompleted = false,
  currentLanguage = 'en'
}) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  
  const formatTime = (seconds) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (!timeRemaining) return 'text-muted-foreground';
    if (timeRemaining <= 60) return 'text-error';
    if (timeRemaining <= 300) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-primary" />
            <h2 className="font-heading font-semibold text-lg text-foreground">
              {currentLanguage === 'hi' ? 'प्रश्नोत्तरी प्रगति' : 'Quiz Progress'}
            </h2>
          </div>
          
          {timeRemaining && !isCompleted && (
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className={getTimeColor()} />
              <span className={`font-mono font-medium text-sm ${getTimeColor()}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-caption text-muted-foreground">
              {currentLanguage === 'hi' ? 'प्रगति' : 'Progress'}
            </span>
            <span className="font-mono font-medium text-primary">
              {currentQuestion}/{totalQuestions}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="font-medium">
              {Math.round(progressPercentage)}% {currentLanguage === 'hi' ? 'पूर्ण' : 'Complete'}
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Score Display (if available) */}
        {score !== null && (
          <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={18} className="text-success" />
              <span className="font-caption text-sm text-success">
                {currentLanguage === 'hi' ? 'वर्तमान स्कोर' : 'Current Score'}
              </span>
            </div>
            <span className="font-mono font-bold text-lg text-success">
              {score}/{currentQuestion}
            </span>
          </div>
        )}

        {/* Question Navigation Dots */}
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionNumber = index + 1;
            const isCurrentQuestion = questionNumber === currentQuestion;
            const isAnswered = questionNumber < currentQuestion;
            const isQuestionCompleted = questionNumber <= currentQuestion && isCompleted;
            
            return (
              <div
                key={questionNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all duration-200 ${
                  isCurrentQuestion
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                    : isAnswered || isQuestionCompleted
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isAnswered || isQuestionCompleted ? (
                  <Icon name="Check" size={12} />
                ) : (
                  questionNumber
                )}
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        <div className="text-center">
          {isCompleted ? (
            <div className="flex items-center justify-center space-x-2 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="font-caption text-sm">
                {currentLanguage === 'hi' ? 'प्रश्नोत्तरी पूर्ण!' : 'Quiz Complete!'}
              </span>
            </div>
          ) : (
            <p className="font-caption text-sm text-muted-foreground">
              {currentLanguage === 'hi' 
                ? `प्रश्न ${currentQuestion} का ${totalQuestions} उत्तर दें`
                : `Answer question ${currentQuestion} of ${totalQuestions}`
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizProgress;