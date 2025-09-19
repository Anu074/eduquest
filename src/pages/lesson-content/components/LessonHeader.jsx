import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LessonHeader = ({ 
  lesson, 
  currentSegment, 
  totalSegments, 
  onBack, 
  onBookmark, 
  isBookmarked,
  offlineStatus 
}) => {
  return (
    <div className="bg-card border-b border-border p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={onBack}
            className="micro-scale"
          >
            Back
          </Button>
          
          {offlineStatus && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 text-warning rounded-full">
              <Icon name="WifiOff" size={14} />
              <span className="text-xs font-caption">Offline Mode</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName={isBookmarked ? "Bookmark" : "BookmarkPlus"}
            onClick={onBookmark}
            className="micro-scale"
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {currentSegment} of {totalSegments}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          {lesson?.title}
        </h1>
        <p className="text-muted-foreground font-caption">
          {lesson?.subject} • Grade {lesson?.grade} • {lesson?.duration} min
        </p>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Est. {lesson?.estimatedTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">{lesson?.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonHeader;