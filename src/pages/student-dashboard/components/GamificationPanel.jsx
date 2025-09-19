import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GamificationPanel = ({ currentLanguage = 'en' }) => {
  const [gamificationData, setGamificationData] = useState({
    recentAchievements: [
      {
        id: 1,
        title: "Math Master",
        titleHi: "गणित मास्टर",
        description: "Complete 10 math lessons",
        descriptionHi: "10 गणित पाठ पूरे करें",
        icon: "Award",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50",
        earnedDate: new Date(Date.now() - 86400000),
        isNew: true
      },
      {
        id: 2,
        title: "Speed Reader",
        titleHi: "तेज़ पाठक",
        description: "Read 5 lessons in one day",
        descriptionHi: "एक दिन में 5 पाठ पढ़ें",
        icon: "Zap",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        earnedDate: new Date(Date.now() - 172800000),
        isNew: false
      },
      {
        id: 3,
        title: "Quiz Champion",
        titleHi: "क्विज़ चैंपियन",
        description: "Score 100% in 3 quizzes",
        descriptionHi: "3 क्विज़ में 100% स्कोर करें",
        icon: "Trophy",
        color: "text-green-500",
        bgColor: "bg-green-50",
        earnedDate: new Date(Date.now() - 259200000),
        isNew: false
      }
    ],
    badges: [
      { id: 1, name: "Early Bird", nameHi: "जल्दी उठने वाला", icon: "Sun", count: 5 },
      { id: 2, name: "Consistent", nameHi: "निरंतर", icon: "Target", count: 12 },
      { id: 3, name: "Helper", nameHi: "सहायक", icon: "Heart", count: 3 },
      { id: 4, name: "Explorer", nameHi: "खोजकर्ता", icon: "Compass", count: 8 }
    ],
    leaderboard: {
      currentPosition: 3,
      totalStudents: 45,
      topStudents: [
        { id: 1, name: "Priya Sharma", points: 18500, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
        { id: 2, name: "Arjun Patel", points: 17200, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
        { id: 3, name: "You", points: 15680, avatar: "https://randomuser.me/api/portraits/women/3.jpg", isCurrentUser: true },
        { id: 4, name: "Sneha Gupta", points: 14900, avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
        { id: 5, name: "Rahul Singh", points: 14200, avatar: "https://randomuser.me/api/portraits/men/5.jpg" }
      ]
    }
  });

  const translations = {
    en: {
      achievements: "Recent Achievements",
      badges: "Earned Badges",
      leaderboard: "Class Leaderboard",
      position: "Your Position",
      of: "of",
      students: "students",
      points: "points",
      viewAll: "View All",
      newBadge: "New!",
      earnedOn: "Earned on"
    },
    hi: {
      achievements: "हाल की उपलब्धियां",
      badges: "अर्जित बैज",
      leaderboard: "कक्षा लीडरबोर्ड",
      position: "आपकी स्थिति",
      of: "में से",
      students: "छात्र",
      points: "अंक",
      viewAll: "सभी देखें",
      newBadge: "नया!",
      earnedOn: "प्राप्त किया"
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  const formatDate = (date) => {
    return date?.toLocaleDateString(currentLanguage === 'hi' ? 'hi-IN' : 'en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPositionSuffix = (position) => {
    if (currentLanguage === 'hi') return '';
    const lastDigit = position % 10;
    const lastTwoDigits = position % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return 'th';
    switch (lastDigit) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recent Achievements */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Award" size={20} className="text-accent" />
            <span>{t?.achievements}</span>
          </h3>
          <Button variant="ghost" size="sm" className="micro-scale">
            {t?.viewAll}
            <Icon name="ChevronRight" size={14} className="ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {gamificationData?.recentAchievements?.slice(0, 3)?.map((achievement) => (
            <div
              key={achievement?.id}
              className={`${achievement?.bgColor} border border-opacity-20 rounded-lg p-3 transition-all duration-200 hover:shadow-sm`}
            >
              <div className="flex items-center space-x-3">
                <div className={`${achievement?.color} bg-white rounded-full p-2`}>
                  <Icon name={achievement?.icon} size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground">
                      {currentLanguage === 'hi' ? achievement?.titleHi : achievement?.title}
                    </h4>
                    {achievement?.isNew && (
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-medium">
                        {t?.newBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentLanguage === 'hi' ? achievement?.descriptionHi : achievement?.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t?.earnedOn} {formatDate(achievement?.earnedDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Badges */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <span>{t?.badges}</span>
          </h3>
          <span className="text-sm text-muted-foreground">
            {gamificationData?.badges?.reduce((sum, badge) => sum + badge?.count, 0)} total
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gamificationData?.badges?.map((badge) => (
            <div
              key={badge?.id}
              className="bg-muted rounded-lg p-3 text-center hover:bg-muted/80 transition-colors"
            >
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <Icon name={badge?.icon} size={16} />
              </div>
              <h4 className="font-medium text-sm text-foreground mb-1">
                {currentLanguage === 'hi' ? badge?.nameHi : badge?.name}
              </h4>
              <p className="text-xs text-muted-foreground">×{badge?.count}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Leaderboard */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Trophy" size={20} className="text-warning" />
            <span>{t?.leaderboard}</span>
          </h3>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {gamificationData?.leaderboard?.currentPosition}{getPositionSuffix(gamificationData?.leaderboard?.currentPosition)} {t?.position}
            </p>
            <p className="text-xs text-muted-foreground">
              {t?.of} {gamificationData?.leaderboard?.totalStudents} {t?.students}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {gamificationData?.leaderboard?.topStudents?.map((student, index) => (
            <div
              key={student?.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                student?.isCurrentUser 
                  ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-2 flex-1">
                <span className={`text-sm font-bold w-6 text-center ${
                  index === 0 ? 'text-yellow-500' :
                  index === 1 ? 'text-gray-400' :
                  index === 2 ? 'text-amber-600': 'text-muted-foreground'
                }`}>
                  {index + 1}
                </span>
                <img
                  src={student?.avatar}
                  alt={student?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className={`font-medium ${student?.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                  {student?.name}
                </span>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {student?.points?.toLocaleString('hi-IN')} {t?.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;