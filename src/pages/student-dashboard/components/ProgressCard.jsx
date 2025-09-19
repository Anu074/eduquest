import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import ProgressIndicator from '../../../components/ui/ProgressIndicator';

const ProgressCard = ({ currentLanguage = 'en' }) => {
  const [userProgress, setUserProgress] = useState({
    level: 12,
    currentXP: 2450,
    nextLevelXP: 3000,
    totalPoints: 15680,
    streak: 7,
    completedLessons: 34,
    totalLessons: 50
  });

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Week Warrior",
      description: "Complete 7 days in a row",
      icon: "Flame",
      isNew: true,
      earnedDate: new Date()
    }
  ]);

  const translations = {
    en: {
      level: "Level",
      points: "Points",
      streak: "Day Streak",
      progress: "Progress",
      nextLevel: "Next Level",
      lessonsCompleted: "Lessons Completed",
      keepGoing: "Keep going!",
      almostThere: "Almost there!"
    },
    hi: {
      level: "स्तर",
      points: "अंक",
      streak: "दिन की लकीर",
      progress: "प्रगति",
      nextLevel: "अगला स्तर",
      lessonsCompleted: "पूर्ण पाठ",
      keepGoing: "जारी रखें!",
      almostThere: "लगभग पहुंच गए!"
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;
  const progressPercentage = (userProgress?.currentXP / userProgress?.nextLevelXP) * 100;
  const lessonProgress = (userProgress?.completedLessons / userProgress?.totalLessons) * 100;

  return (
    <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">{t?.level} {userProgress?.level}</h2>
          <p className="text-blue-100 opacity-90">{userProgress?.totalPoints?.toLocaleString('hi-IN')} {t?.points}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Flame" size={20} className="text-orange-300" />
            <span className="text-xl font-bold">{userProgress?.streak}</span>
          </div>
          <p className="text-blue-100 text-sm opacity-90">{t?.streak}</p>
        </div>
      </div>
      <div className="space-y-4">
        {/* XP Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-100">{t?.nextLevel}</span>
            <span className="text-sm font-mono text-blue-100">
              {userProgress?.currentXP?.toLocaleString('hi-IN')} / {userProgress?.nextLevelXP?.toLocaleString('hi-IN')} XP
            </span>
          </div>
          <div className="w-full bg-blue-800 bg-opacity-50 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-blue-100 mt-1 opacity-80">
            {progressPercentage >= 80 ? t?.almostThere : t?.keepGoing}
          </p>
        </div>

        {/* Lesson Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <Icon name="BookOpen" size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium">{t?.lessonsCompleted}</p>
              <p className="text-sm text-blue-100 opacity-90">
                {userProgress?.completedLessons} / {userProgress?.totalLessons}
              </p>
            </div>
          </div>
          <div className="text-right">
            <ProgressIndicator
              currentProgress={userProgress?.completedLessons}
              totalProgress={userProgress?.totalLessons}
              size="sm"
              showDetails={false}
              className="text-white"
            />
          </div>
        </div>

        {/* Recent Achievement */}
        {achievements?.length > 0 && achievements?.[0]?.isNew && (
          <div className="bg-white bg-opacity-10 rounded-lg p-3 border border-white border-opacity-20">
            <div className="flex items-center space-x-3">
              <div className="bg-accent rounded-full p-2">
                <Icon name={achievements?.[0]?.icon} size={16} className="text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{achievements?.[0]?.title}</p>
                <p className="text-xs text-blue-100 opacity-80">{achievements?.[0]?.description}</p>
              </div>
              <div className="text-accent">
                <Icon name="Star" size={16} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCard;