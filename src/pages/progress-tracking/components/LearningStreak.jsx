import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LearningStreak = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedDate, setSelectedDate] = useState(null);

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('eduquest-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const translations = {
    en: {
      learningStreak: 'Learning Streak',
      currentStreak: 'Current Streak',
      longestStreak: 'Longest Streak',
      days: 'days',
      studyTime: 'Study Time',
      minutes: 'minutes',
      keepGoing: 'Keep going! You\'re doing great!',
      almostThere: 'Almost there! Don\'t break the chain!',
      getBack: 'Get back on track today!',
      today: 'Today',
      completed: 'Completed',
      missed: 'Missed',
      upcoming: 'Upcoming'
    },
    hi: {
      learningStreak: 'अध्ययन श्रृंखला',
      currentStreak: 'वर्तमान श्रृंखला',
      longestStreak: 'सबसे लंबी श्रृंखला',
      days: 'दिन',
      studyTime: 'अध्ययन समय',
      minutes: 'मिनट',
      keepGoing: 'चलते रहें! आप बहुत अच्छा कर रहे हैं!',
      almostThere: 'लगभग पहुंच गए! श्रृंखला न तोड़ें!',
      getBack: 'आज वापस पटरी पर आ जाएं!',
      today: 'आज',
      completed: 'पूर्ण',
      missed: 'छूटा',
      upcoming: 'आगामी'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  // Generate calendar data for the current month
  const generateCalendarData = () => {
    const today = new Date();
    const currentMonth = today?.getMonth();
    const currentYear = today?.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay());

    const calendar = [];
    const streakData = {
      // Mock streak data - in real app this would come from backend
      '2025-01-01': { studied: true, minutes: 45, streak: 15 },
      '2025-01-02': { studied: true, minutes: 60, streak: 16 },
      '2025-01-03': { studied: true, minutes: 30, streak: 17 },
      '2025-01-04': { studied: false, minutes: 0, streak: 0 },
      '2025-01-05': { studied: true, minutes: 75, streak: 1 },
      '2025-01-06': { studied: true, minutes: 50, streak: 2 },
      '2025-01-07': { studied: true, minutes: 40, streak: 3 },
      '2025-01-08': { studied: true, minutes: 65, streak: 4 },
      '2025-01-09': { studied: true, minutes: 55, streak: 5 },
      '2025-01-10': { studied: true, minutes: 70, streak: 6 },
      '2025-01-11': { studied: true, minutes: 45, streak: 7 }
    };

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date?.setDate(startDate?.getDate() + i);
      const dateStr = date?.toISOString()?.split('T')?.[0];
      const dayData = streakData?.[dateStr] || { studied: false, minutes: 0, streak: 0 };
      
      calendar?.push({
        date: date,
        dateStr: dateStr,
        day: date?.getDate(),
        isCurrentMonth: date?.getMonth() === currentMonth,
        isToday: date?.toDateString() === today?.toDateString(),
        isPast: date < today,
        isFuture: date > today,
        ...dayData
      });
    }

    return calendar;
  };

  const calendarData = generateCalendarData();
  const currentStreak = 7; // Mock current streak
  const longestStreak = 17; // Mock longest streak
  const totalStudyTime = calendarData?.reduce((total, day) => total + day?.minutes, 0);

  const getMotivationMessage = () => {
    if (currentStreak >= 7) return t?.keepGoing;
    if (currentStreak >= 3) return t?.almostThere;
    return t?.getBack;
  };

  const getDayClassName = (day) => {
    let baseClass = "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200 micro-scale";
    
    if (!day?.isCurrentMonth) {
      return `${baseClass} text-muted-foreground/50`;
    }
    
    if (day?.isToday) {
      baseClass += " ring-2 ring-primary";
    }
    
    if (day?.studied && day?.isPast) {
      return `${baseClass} bg-success text-white hover:bg-success/80`;
    }
    
    if (!day?.studied && day?.isPast) {
      return `${baseClass} bg-error/20 text-error hover:bg-error/30`;
    }
    
    if (day?.isFuture) {
      return `${baseClass} bg-muted text-muted-foreground hover:bg-muted/80`;
    }
    
    return `${baseClass} bg-muted text-foreground hover:bg-muted/80`;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          {t?.learningStreak}
        </h3>
        <Icon name="Flame" size={24} className="text-orange-500" />
      </div>
      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">{currentStreak}</div>
          <div className="text-sm font-caption text-muted-foreground">{t?.currentStreak}</div>
          <div className="text-xs text-muted-foreground">{t?.days}</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-accent mb-1">{longestStreak}</div>
          <div className="text-sm font-caption text-muted-foreground">{t?.longestStreak}</div>
          <div className="text-xs text-muted-foreground">{t?.days}</div>
        </div>
      </div>
      {/* Motivation Message */}
      <div className="text-center p-4 bg-primary/10 rounded-lg mb-6">
        <Icon name="Target" size={20} className="text-primary mx-auto mb-2" />
        <p className="text-sm font-medium text-primary">
          {getMotivationMessage()}
        </p>
      </div>
      {/* Calendar */}
      <div className="space-y-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays?.map((day) => (
            <div key={day} className="text-center text-xs font-caption text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData?.map((day, index) => (
            <div
              key={index}
              onClick={() => setSelectedDate(day)}
              className={getDayClassName(day)}
              title={`${day?.date?.toLocaleDateString()}: ${day?.studied ? `${day?.minutes} ${t?.minutes}` : t?.missed}`}
            >
              {day?.day}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs font-caption text-muted-foreground">{t?.completed}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-error/20 border border-error" />
          <span className="text-xs font-caption text-muted-foreground">{t?.missed}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-muted" />
          <span className="text-xs font-caption text-muted-foreground">{t?.upcoming}</span>
        </div>
      </div>
      {/* Study Time Summary */}
      <div className="text-center mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="text-lg font-bold text-foreground">{totalStudyTime}</div>
        <div className="text-sm font-caption text-muted-foreground">
          {t?.studyTime} ({t?.minutes})
        </div>
      </div>
      {/* Day Detail Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                {selectedDate?.date?.toLocaleDateString()}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="text-center space-y-4">
              {selectedDate?.studied ? (
                <>
                  <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto">
                    <Icon name="CheckCircle" size={32} color="white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-success">{t?.completed}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate?.minutes} {t?.minutes} {t?.studyTime?.toLowerCase()}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-error/20 border-2 border-error rounded-full flex items-center justify-center mx-auto">
                    <Icon name="X" size={32} className="text-error" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-error">{t?.missed}</p>
                    <p className="text-sm text-muted-foreground">
                      No study time recorded
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningStreak;