import React from 'react';
import Icon from '../../../components/AppIcon';


const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult = false,
  isSubmitted = false,
  currentLanguage = 'en'
}) => {
  const getQuestionTypeIcon = () => {
    switch (question?.type) {
      case 'multiple-choice': return 'CheckCircle';
      case 'true-false': return 'ToggleLeft';
      case 'text-input': return 'Edit3';
      default: return 'HelpCircle';
    }
  };

  const getAnswerStatus = (optionId) => {
    if (!showResult) return null;
    
    if (question?.type === 'multiple-choice') {
      if (optionId === question?.correctAnswer) return 'correct';
      if (optionId === selectedAnswer && optionId !== question?.correctAnswer) return 'incorrect';
    }
    
    return null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct': return 'bg-success text-success-foreground border-success';
      case 'incorrect': return 'bg-error text-error-foreground border-error';
      default: return '';
    }
  };

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question?.options?.map((option) => {
        const status = getAnswerStatus(option?.id);
        const isSelected = selectedAnswer === option?.id;
        
        return (
          <button
            key={option?.id}
            onClick={() => !isSubmitted && onAnswerSelect(option?.id)}
            disabled={isSubmitted}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
              isSelected && !showResult 
                ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
            } ${
              status ? getStatusColor(status) : ''
            } ${
              isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected && !showResult 
                    ? 'border-primary bg-primary' :'border-muted-foreground'
                } ${
                  status === 'correct' ? 'border-success bg-success' :
                  status === 'incorrect' ? 'border-error bg-error' : ''
                }`}>
                  {(isSelected || status === 'correct') && (
                    <Icon 
                      name={status === 'incorrect' ? 'X' : 'Check'} 
                      size={14} 
                      color="white" 
                    />
                  )}
                </div>
                <span className="font-body text-sm md:text-base">{option?.text}</span>
              </div>
              
              {status === 'correct' && (
                <Icon name="CheckCircle" size={20} className="text-success" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="flex flex-col sm:flex-row gap-4">
      {[
        { id: 'true', text: currentLanguage === 'hi' ? 'सत्य' : 'True', value: true },
        { id: 'false', text: currentLanguage === 'hi' ? 'असत्य' : 'False', value: false }
      ]?.map((option) => {
        const isSelected = selectedAnswer === option?.value;
        const isCorrect = question?.correctAnswer === option?.value;
        const status = showResult ? (isCorrect ? 'correct' : (isSelected && !isCorrect ? 'incorrect' : null)) : null;
        
        return (
          <button
            key={option?.id}
            onClick={() => !isSubmitted && onAnswerSelect(option?.value)}
            disabled={isSubmitted}
            className={`flex-1 p-6 border-2 rounded-lg transition-all duration-200 ${
              isSelected && !showResult 
                ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
            } ${
              status ? getStatusColor(status) : ''
            } ${
              isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <Icon 
                name={option?.value ? 'Check' : 'X'} 
                size={32} 
                className={isSelected && !showResult ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className="font-heading font-semibold text-lg">{option?.text}</span>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderTextInput = () => (
    <div className="space-y-4">
      <textarea
        value={selectedAnswer || ''}
        onChange={(e) => !isSubmitted && onAnswerSelect(e?.target?.value)}
        disabled={isSubmitted}
        placeholder={currentLanguage === 'hi' ? 'अपना उत्तर यहाँ लिखें...' : 'Type your answer here...'}
        className="w-full p-4 border-2 border-border rounded-lg resize-none focus:border-primary focus:outline-none transition-colors duration-200"
        rows={4}
      />
      
      {showResult && question?.sampleAnswer && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-heading font-semibold text-sm mb-2 text-muted-foreground">
            {currentLanguage === 'hi' ? 'नमूना उत्तर:' : 'Sample Answer:'}
          </h4>
          <p className="font-body text-sm text-foreground">{question?.sampleAnswer}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      {/* Question Header */}
      <div className="flex items-start space-x-3 mb-6">
        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={getQuestionTypeIcon()} size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
              {currentLanguage === 'hi' ? 'प्रश्न' : 'Question'}
            </span>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span className="text-xs font-caption text-muted-foreground">
              {question?.difficulty === 'easy' ? (currentLanguage === 'hi' ? 'आसान' : 'Easy') :
               question?.difficulty === 'medium' ? (currentLanguage === 'hi' ? 'मध्यम' : 'Medium') :
               (currentLanguage === 'hi' ? 'कठिन' : 'Hard')}
            </span>
          </div>
          <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground leading-relaxed">
            {question?.question}
          </h3>
        </div>
      </div>
      {/* Question Content */}
      <div className="mb-6">
        {question?.type === 'multiple-choice' && renderMultipleChoice()}
        {question?.type === 'true-false' && renderTrueFalse()}
        {question?.type === 'text-input' && renderTextInput()}
      </div>
      {/* Explanation (shown after submission) */}
      {showResult && question?.explanation && (
        <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={18} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-heading font-semibold text-sm mb-1 text-accent">
                {currentLanguage === 'hi' ? 'व्याख्या' : 'Explanation'}
              </h4>
              <p className="font-body text-sm text-foreground">{question?.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;