import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubjectGrid = ({ currentLanguage = 'en', onSubjectClick }) => {
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Mathematics",
      nameHi: "गणित",
      icon: "Calculator",
      color: "bg-blue-500",
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      isOfflineAvailable: true,
      estimatedTime: "45 min",
      difficulty: "Medium",
      lastAccessed: new Date(Date.now() - 86400000)
    },
    {
      id: 2,
      name: "Science",
      nameHi: "विज्ञान",
      icon: "Atom",
      color: "bg-green-500",
      progress: 60,
      totalLessons: 18,
      completedLessons: 11,
      isOfflineAvailable: true,
      estimatedTime: "50 min",
      difficulty: "Hard",
      lastAccessed: new Date(Date.now() - 172800000)
    },
    {
      id: 3,
      name: "English",
      nameHi: "अंग्रेजी",
      icon: "BookOpen",
      color: "bg-purple-500",
      progress: 85,
      totalLessons: 25,
      completedLessons: 21,
      isOfflineAvailable: false,
      estimatedTime: "35 min",
      difficulty: "Easy",
      lastAccessed: new Date(Date.now() - 43200000)
    },
    {
      id: 4,
      name: "History",
      nameHi: "इतिहास",
      icon: "Scroll",
      color: "bg-amber-500",
      progress: 40,
      totalLessons: 15,
      completedLessons: 6,
      isOfflineAvailable: true,
      estimatedTime: "40 min",
      difficulty: "Medium",
      lastAccessed: new Date(Date.now() - 259200000)
    },
    {
      id: 5,
      name: "Geography",
      nameHi: "भूगोल",
      icon: "Globe",
      color: "bg-teal-500",
      progress: 55,
      totalLessons: 12,
      completedLessons: 7,
      isOfflineAvailable: false,
      estimatedTime: "30 min",
      difficulty: "Easy",
      lastAccessed: new Date(Date.now() - 345600000)
    },
    {
      id: 6,
      name: "Hindi",
      nameHi: "हिंदी",
      icon: "Languages",
      color: "bg-rose-500",
      progress: 70,
      totalLessons: 22,
      completedLessons: 15,
      isOfflineAvailable: true,
      estimatedTime: "25 min",
      difficulty: "Medium",
      lastAccessed: new Date(Date.now() - 86400000)
    }
  ]);

  const translations = {
    en: {
      subjects: "Subjects",
      lessons: "lessons",
      completed: "completed",
      continue: "Continue",
      start: "Start",
      download: "Download",
      offline: "Offline",
      online: "Online Only",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      lastAccessed: "Last accessed"
    },
    hi: {
      subjects: "विषय",
      lessons: "पाठ",
      completed: "पूर्ण",
      continue: "जारी रखें",
      start: "शुरू करें",
      download: "डाउनलोड",
      offline: "ऑफलाइन",
      online: "केवल ऑनलाइन",
      easy: "आसान",
      medium: "मध्यम",
      hard: "कठिन",
      lastAccessed: "अंतिम बार देखा"
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatLastAccessed = (date) => {
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleDownload = (subjectId, e) => {
    e?.stopPropagation();
    // Mock download functionality
    console.log(`Downloading subject ${subjectId} for offline access`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">{t?.subjects}</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Download" size={16} />
          <span>{subjects?.filter(s => s?.isOfflineAvailable)?.length} {t?.offline}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects?.map((subject) => (
          <div
            key={subject?.id}
            onClick={() => onSubjectClick?.(subject)}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`${subject?.color} rounded-lg p-2 text-white group-hover:scale-110 transition-transform`}>
                  <Icon name={subject?.icon} size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {currentLanguage === 'hi' ? subject?.nameHi : subject?.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {subject?.completedLessons}/{subject?.totalLessons} {t?.lessons}
                  </p>
                </div>
              </div>
              
              {/* Offline Status */}
              <div className="flex items-center space-x-1">
                {subject?.isOfflineAvailable ? (
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="Download" size={14} />
                    <span className="text-xs hidden sm:inline">{t?.offline}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-warning">
                    <Icon name="Wifi" size={14} />
                    <span className="text-xs hidden sm:inline">{t?.online}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{subject?.progress}% {t?.completed}</span>
                <span className="text-xs text-muted-foreground">{subject?.estimatedTime}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${subject?.color} transition-all duration-500 ease-out`}
                  style={{ width: `${subject?.progress}%` }}
                />
              </div>
            </div>

            {/* Subject Info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(subject?.difficulty)}`}>
                  {t?.[subject?.difficulty?.toLowerCase()] || subject?.difficulty}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {t?.lastAccessed} {formatLastAccessed(subject?.lastAccessed)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant={subject?.progress > 0 ? "default" : "outline"}
                size="sm"
                className="flex-1 micro-scale"
                iconName={subject?.progress > 0 ? "Play" : "BookOpen"}
                iconPosition="left"
                iconSize={14}
              >
                {subject?.progress > 0 ? t?.continue : t?.start}
              </Button>
              
              {!subject?.isOfflineAvailable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDownload(subject?.id, e)}
                  className="micro-scale"
                  iconName="Download"
                  iconSize={14}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectGrid;