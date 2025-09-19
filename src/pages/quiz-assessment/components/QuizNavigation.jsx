import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizNavigation = ({ 
  currentQuestion, 
  totalQuestions, 
  canGoBack = true,
  canGoNext = false,
  canSubmit = false,
  isSubmitted = false,
  onPrevious,
  onNext,
  onSubmit,
  onReview,
  currentLanguage = 'en'
}) => {
  const isFirstQuestion = currentQuestion === 1;
  const isLastQuestion = currentQuestion === totalQuestions;

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Button */}
        <div className="flex-1 flex justify-start">
          {!isFirstQuestion && canGoBack && !isSubmitted && (
            <Button
              variant="outline"
              iconName="ChevronLeft"
              iconPosition="left"
              onClick={onPrevious}
              className="micro-scale"
            >
              {currentLanguage === 'hi' ? 'पिछला' : 'Previous'}
            </Button>
          )}
        </div>

        {/* Question Counter */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-sm font-caption text-muted-foreground mb-1">
              {currentLanguage === 'hi' ? 'प्रश्न' : 'Question'}
            </div>
            <div className="font-mono font-bold text-lg text-primary">
              {currentQuestion} / {totalQuestions}
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center space-x-1">
            {Array.from({ length: Math.min(totalQuestions, 5) }, (_, index) => {
              const questionNumber = index + 1;
              const isActive = questionNumber === currentQuestion;
              const isPassed = questionNumber < currentQuestion;
              
              return (
                <div
                  key={questionNumber}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-primary scale-125'
                      : isPassed
                      ? 'bg-success' :'bg-muted'
                  }`}
                />
              );
            })}
            {totalQuestions > 5 && (
              <span className="text-xs text-muted-foreground ml-2">...</span>
            )}
          </div>
        </div>

        {/* Next/Submit Button */}
        <div className="flex-1 flex justify-end">
          {isSubmitted ? (
            <Button
              variant="outline"
              iconName="Eye"
              iconPosition="left"
              onClick={onReview}
              className="micro-scale"
            >
              {currentLanguage === 'hi' ? 'समीक्षा करें' : 'Review Answers'}
            </Button>
          ) : isLastQuestion ? (
            <Button
              variant="default"
              iconName="Check"
              iconPosition="right"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="micro-scale"
            >
              {currentLanguage === 'hi' ? 'जमा करें' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button
              variant="default"
              iconName="ChevronRight"
              iconPosition="right"
              onClick={onNext}
              disabled={!canGoNext}
              className="micro-scale"
            >
              {currentLanguage === 'hi' ? 'अगला' : 'Next'}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="sm:hidden mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{currentLanguage === 'hi' ? 'प्रगति' : 'Progress'}</span>
          <span>{Math.round((currentQuestion / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-center">
        {isSubmitted ? (
          <p className="text-sm font-caption text-success">
            <Icon name="CheckCircle" size={14} className="inline mr-1" />
            {currentLanguage === 'hi' ?'प्रश्नोत्तरी सफलतापूर्वक जमा की गई' :'Quiz submitted successfully'
            }
          </p>
        ) : !canGoNext && !isLastQuestion ? (
          <p className="text-sm font-caption text-muted-foreground">
            {currentLanguage === 'hi' ?'आगे बढ़ने के लिए एक विकल्प चुनें' :'Select an answer to continue'
            }
          </p>
        ) : !canSubmit && isLastQuestion ? (
          <p className="text-sm font-caption text-muted-foreground">
            {currentLanguage === 'hi' ?'जमा करने के लिए सभी प्रश्नों के उत्तर दें' :'Answer all questions to submit'
            }
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default QuizNavigation;