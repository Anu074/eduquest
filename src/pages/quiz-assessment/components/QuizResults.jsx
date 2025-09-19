import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizResults = ({ 
  score, 
  totalQuestions, 
  pointsEarned, 
  badgesEarned = [], 
  timeSpent,
  onRetakeQuiz,
  onNextLesson,
  onBackToDashboard,
  currentLanguage = 'en'
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getPerformanceLevel = () => {
    if (percentage >= 90) return { level: 'excellent', color: 'success', icon: 'Trophy' };
    if (percentage >= 75) return { level: 'good', color: 'primary', icon: 'Award' };
    if (percentage >= 60) return { level: 'average', color: 'accent', icon: 'Star' };
    return { level: 'needs-improvement', color: 'warning', icon: 'Target' };
  };

  const performance = getPerformanceLevel();

  const getPerformanceMessage = () => {
    if (currentLanguage === 'hi') {
      switch (performance?.level) {
        case 'excellent': return 'उत्कृष्ट! आपने बहुत अच्छा प्रदर्शन किया है।';
        case 'good': return 'बहुत अच्छा! आप सही रास्ते पर हैं।';
        case 'average': return 'अच्छा प्रयास! अभ्यास से और बेहतर होंगे।';
        default: return 'कोई बात नहीं! अभ्यास से सब कुछ संभव है।';
      }
    } else {
      switch (performance?.level) {
        case 'excellent': return 'Excellent! You have mastered this topic.';
        case 'good': return 'Great job! You\'re on the right track.';
        case 'average': return 'Good effort! Keep practicing to improve.';
        default: return 'Don\'t worry! Practice makes perfect.';
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return currentLanguage === 'hi' 
        ? `${minutes} मिनट ${remainingSeconds} सेकंड`
        : `${minutes}m ${remainingSeconds}s`;
    }
    return currentLanguage === 'hi' ? `${remainingSeconds} सेकंड` : `${remainingSeconds}s`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Results Header */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm text-center">
        <div className={`w-20 h-20 mx-auto mb-4 bg-${performance?.color}/10 rounded-full flex items-center justify-center`}>
          <Icon name={performance?.icon} size={40} className={`text-${performance?.color}`} />
        </div>
        
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
          {currentLanguage === 'hi' ? 'प्रश्नोत्तरी परिणाम' : 'Quiz Results'}
        </h2>
        
        <p className="font-body text-muted-foreground mb-6">
          {getPerformanceMessage()}
        </p>

        {/* Score Display */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className={`text-4xl md:text-5xl font-bold text-${performance?.color} mb-1`}>
              {percentage}%
            </div>
            <div className="text-sm font-caption text-muted-foreground">
              {currentLanguage === 'hi' ? 'स्कोर' : 'Score'}
            </div>
          </div>
          
          <div className="w-px h-16 bg-border" />
          
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {score}/{totalQuestions}
            </div>
            <div className="text-sm font-caption text-muted-foreground">
              {currentLanguage === 'hi' ? 'सही उत्तर' : 'Correct'}
            </div>
          </div>
        </div>
      </div>
      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Points Earned */}
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Coins" size={24} className="text-accent" />
          </div>
          <div className="text-xl font-bold text-accent mb-1">+{pointsEarned}</div>
          <div className="text-sm font-caption text-muted-foreground">
            {currentLanguage === 'hi' ? 'अंक अर्जित' : 'Points Earned'}
          </div>
        </div>

        {/* Time Spent */}
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={24} className="text-primary" />
          </div>
          <div className="text-xl font-bold text-primary mb-1">{formatTime(timeSpent)}</div>
          <div className="text-sm font-caption text-muted-foreground">
            {currentLanguage === 'hi' ? 'समय लगा' : 'Time Spent'}
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Target" size={24} className="text-success" />
          </div>
          <div className="text-xl font-bold text-success mb-1">{percentage}%</div>
          <div className="text-sm font-caption text-muted-foreground">
            {currentLanguage === 'hi' ? 'सटीकता' : 'Accuracy'}
          </div>
        </div>
      </div>
      {/* Badges Earned */}
      {badgesEarned?.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Award" size={20} className="text-accent" />
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {currentLanguage === 'hi' ? 'नए बैज अर्जित' : 'New Badges Earned'}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badgesEarned?.map((badge, index) => (
              <div key={index} className="text-center p-3 bg-accent/10 rounded-lg achievement-bounce">
                <div className="text-2xl mb-2">{badge?.icon}</div>
                <div className="text-sm font-medium text-foreground">{badge?.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{badge?.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onRetakeQuiz}
          className="micro-scale"
        >
          {currentLanguage === 'hi' ? 'फिर से कोशिश करें' : 'Retake Quiz'}
        </Button>
        
        {percentage >= 60 && (
          <Button
            variant="default"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={onNextLesson}
            className="micro-scale"
          >
            {currentLanguage === 'hi' ? 'अगला पाठ' : 'Next Lesson'}
          </Button>
        )}
        
        <Button
          variant="ghost"
          iconName="Home"
          iconPosition="left"
          onClick={onBackToDashboard}
          className="micro-scale"
        >
          {currentLanguage === 'hi' ? 'डैशबोर्ड पर वापस' : 'Back to Dashboard'}
        </Button>
      </div>
      {/* Improvement Suggestions */}
      {percentage < 75 && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={18} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-heading font-semibold text-sm mb-2 text-accent">
                {currentLanguage === 'hi' ? 'सुधार के सुझाव' : 'Improvement Tips'}
              </h4>
              <ul className="text-sm text-foreground space-y-1">
                <li>• {currentLanguage === 'hi' ? 'पाठ को दोबारा पढ़ें' : 'Review the lesson content again'}</li>
                <li>• {currentLanguage === 'hi' ? 'अभ्यास प्रश्न हल करें' : 'Practice with additional exercises'}</li>
                <li>• {currentLanguage === 'hi' ? 'शिक्षक से सहायता लें' : 'Ask your teacher for help'}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResults;