import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentProgress = 0, 
  totalProgress = 100, 
  showDetails = true,
  size = 'default',
  variant = 'circular',
  achievements = [],
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState(null);

  const progressPercentage = Math.min((currentProgress / totalProgress) * 100, 100);

  // Animate progress on mount and updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  // Handle new achievements
  useEffect(() => {
    if (achievements?.length > 0) {
      const newest = achievements?.[achievements?.length - 1];
      if (newest && newest?.isNew) {
        setLatestAchievement(newest);
        setShowAchievement(true);
        
        // Auto-hide achievement after 3 seconds
        const timer = setTimeout(() => {
          setShowAchievement(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [achievements]);

  const getProgressColor = () => {
    if (progressPercentage >= 80) return 'text-success';
    if (progressPercentage >= 60) return 'text-primary';
    if (progressPercentage >= 40) return 'text-accent';
    return 'text-muted-foreground';
  };

  const getProgressBgColor = () => {
    if (progressPercentage >= 80) return 'bg-success';
    if (progressPercentage >= 60) return 'bg-primary';
    if (progressPercentage >= 40) return 'bg-accent';
    return 'bg-muted-foreground';
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    default: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  if (variant === 'linear') {
    return (
      <div className={`space-y-2 ${className}`}>
        {showDetails && (
          <div className="flex items-center justify-between text-sm">
            <span className="font-caption text-muted-foreground">Progress</span>
            <span className={`font-mono font-medium ${getProgressColor()}`}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        )}
        
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getProgressBgColor()} transition-all duration-500 ease-out progress-ring`}
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
        
        {showDetails && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{currentProgress} completed</span>
            <span>{totalProgress} total</span>
          </div>
        )}
      </div>
    );
  }

  // Circular progress (default)
  const radius = size === 'sm' ? 20 : size === 'lg' ? 32 : size === 'xl' ? 40 : 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      {/* Circular Progress */}
      <div className={`relative ${sizeClasses?.[size]} flex items-center justify-center`}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 64 64">
          {/* Background circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className={`${getProgressColor()} progress-ring`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-out'
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {progressPercentage === 100 ? (
            <Icon name="CheckCircle" size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} className="text-success" />
          ) : (
            <span className={`font-mono font-bold ${getProgressColor()} ${
              size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : size === 'xl' ? 'text-base' : 'text-xs'
            }`}>
              {Math.round(progressPercentage)}%
            </span>
          )}
        </div>
      </div>
      {/* Progress Details */}
      {showDetails && (
        <div className="mt-2 text-center">
          <div className="text-sm font-caption text-muted-foreground">
            {currentProgress} of {totalProgress}
          </div>
          {progressPercentage === 100 && (
            <div className="text-xs text-success font-medium mt-1">
              <Icon name="Star" size={12} className="inline mr-1" />
              Complete!
            </div>
          )}
        </div>
      )}
      {/* Achievement Notification */}
      {showAchievement && latestAchievement && (
        <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-2 shadow-lg achievement-bounce">
          <Icon name="Award" size={16} />
          <div className="absolute -bottom-8 right-0 bg-popover border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
            {latestAchievement?.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;