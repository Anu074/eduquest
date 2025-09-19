import React from 'react';
import Icon from '../../../components/AppIcon';

const LessonProgress = ({ 
  currentSegment, 
  totalSegments, 
  completedSegments, 
  progressPercentage,
  onSegmentClick 
}) => {
  const segments = Array.from({ length: totalSegments }, (_, index) => ({
    id: index + 1,
    isCompleted: index < completedSegments,
    isCurrent: index + 1 === currentSegment,
    title: `Segment ${index + 1}`
  }));

  return (
    <div className="bg-card border-b border-border p-4 lg:p-6">
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-caption text-muted-foreground">Lesson Progress</span>
            <span className="font-mono font-medium text-primary">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Segment Navigation */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {segments?.map((segment) => (
            <button
              key={segment?.id}
              onClick={() => onSegmentClick(segment?.id)}
              className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 ${
                segment?.isCurrent
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : segment?.isCompleted
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
              }`}
              title={segment?.title}
            >
              {segment?.isCompleted ? (
                <Icon name="Check" size={14} />
              ) : (
                segment?.id
              )}
            </button>
          ))}
        </div>

        {/* Current Segment Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground font-medium">
            Segment {currentSegment}: Current Topic
          </span>
          <span className="text-muted-foreground">
            {completedSegments} of {totalSegments} completed
          </span>
        </div>
      </div>
    </div>
  );
};

export default LessonProgress;