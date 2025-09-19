import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LessonNavigation = ({ 
  currentSegment, 
  totalSegments, 
  onPrevious, 
  onNext, 
  onQuiz, 
  onDashboard,
  canProceed = true,
  isLastSegment = false 
}) => {
  const progressPercentage = (currentSegment / totalSegments) * 100;

  return (
    <div className="bg-card border-t border-border p-4 lg:p-6">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button
          variant="outline"
          iconName="ChevronLeft"
          iconPosition="left"
          onClick={onPrevious}
          disabled={currentSegment === 1}
          className="micro-scale"
        >
          Previous
        </Button>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-mono text-primary">
              {Math.round(progressPercentage)}%
            </span>
          </div>

          {/* Mobile Progress */}
          <div className="sm:hidden text-sm text-muted-foreground">
            {currentSegment} / {totalSegments}
          </div>
        </div>

        {/* Next/Action Buttons */}
        <div className="flex items-center space-x-2">
          {isLastSegment ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                iconName="Home"
                iconPosition="left"
                onClick={onDashboard}
                className="micro-scale"
              >
                Dashboard
              </Button>
              <Button
                variant="default"
                iconName="FileText"
                iconPosition="left"
                onClick={onQuiz}
                disabled={!canProceed}
                className="micro-scale"
              >
                Take Quiz
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              iconName="ChevronRight"
              iconPosition="right"
              onClick={onNext}
              disabled={!canProceed || currentSegment === totalSegments}
              className="micro-scale"
            >
              Next
            </Button>
          )}
        </div>
      </div>
      {/* Additional Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={16} />
              <span>Est. 5 min remaining</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="BookOpen" size={16} />
              <span>Segment {currentSegment} of {totalSegments}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              onClick={() => window.location?.reload()}
              className="micro-scale"
            >
              Restart
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="Share2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'EduQuest Lesson',
                    text: 'Check out this lesson on EduQuest!',
                    url: window.location?.href
                  });
                }
              }}
              className="micro-scale"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonNavigation;