import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const AchievementGallery = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

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
      achievements: 'Achievements & Badges',
      earned: 'Earned',
      locked: 'Locked',
      progress: 'Progress',
      earnedOn: 'Earned on',
      requirement: 'Requirement',
      viewDetails: 'View Details',
      close: 'Close',
      totalEarned: 'Total Earned',
      nextGoal: 'Next Goal'
    },
    hi: {
      achievements: 'उपलब्धियां और बैज',
      earned: 'अर्जित',
      locked: 'बंद',
      progress: 'प्रगति',
      earnedOn: 'अर्जित किया गया',
      requirement: 'आवश्यकता',
      viewDetails: 'विवरण देखें',
      close: 'बंद करें',
      totalEarned: 'कुल अर्जित',
      nextGoal: 'अगला लक्ष्य'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  const achievements = [
    {
      id: 1,
      title: currentLanguage === 'hi' ? 'गणित मास्टर' : 'Math Master',
      description: currentLanguage === 'hi' ? 'गणित में 90% से अधिक स्कोर करें' : 'Score above 90% in Mathematics',
      icon: 'Calculator',
      color: 'bg-blue-500',
      earned: true,
      earnedDate: '2025-01-05',
      category: 'academic',
      points: 100,
      rarity: 'rare'
    },
    {
      id: 2,
      title: currentLanguage === 'hi' ? 'स्ट्रीक चैंपियन' : 'Streak Champion',
      description: currentLanguage === 'hi' ? '30 दिन लगातार अध्ययन करें' : 'Study for 30 consecutive days',
      icon: 'Flame',
      color: 'bg-orange-500',
      earned: true,
      earnedDate: '2025-01-08',
      category: 'consistency',
      points: 150,
      rarity: 'epic'
    },
    {
      id: 3,
      title: currentLanguage === 'hi' ? 'क्विज़ विशेषज्ञ' : 'Quiz Expert',
      description: currentLanguage === 'hi' ? '100 क्विज़ पूरे करें' : 'Complete 100 quizzes',
      icon: 'Brain',
      color: 'bg-purple-500',
      earned: true,
      earnedDate: '2025-01-10',
      category: 'assessment',
      points: 75,
      rarity: 'common'
    },
    {
      id: 4,
      title: currentLanguage === 'hi' ? 'विज्ञान खोजकर्ता' : 'Science Explorer',
      description: currentLanguage === 'hi' ? 'सभी विज्ञान अध्याय पूरे करें' : 'Complete all Science chapters',
      icon: 'Microscope',
      color: 'bg-green-500',
      earned: false,
      progress: 75,
      category: 'academic',
      points: 120,
      rarity: 'rare'
    },
    {
      id: 5,
      title: currentLanguage === 'hi' ? 'भाषा गुरु' : 'Language Guru',
      description: currentLanguage === 'hi' ? 'अंग्रेजी में पूर्ण अंक प्राप्त करें' : 'Get perfect score in English',
      icon: 'BookOpen',
      color: 'bg-indigo-500',
      earned: false,
      progress: 60,
      category: 'academic',
      points: 100,
      rarity: 'rare'
    },
    {
      id: 6,
      title: currentLanguage === 'hi' ? 'सहयोगी' : 'Collaborator',
      description: currentLanguage === 'hi' ? '10 सहपाठियों की मदद करें' : 'Help 10 classmates',
      icon: 'Users',
      color: 'bg-pink-500',
      earned: false,
      progress: 30,
      category: 'social',
      points: 80,
      rarity: 'uncommon'
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'uncommon': return 'text-green-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const earnedAchievements = achievements?.filter(a => a?.earned);
  const lockedAchievements = achievements?.filter(a => !a?.earned);

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          {t?.achievements}
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{earnedAchievements?.length}</div>
            <div className="text-xs font-caption text-muted-foreground">{t?.totalEarned}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{lockedAchievements?.length}</div>
            <div className="text-xs font-caption text-muted-foreground">{t?.nextGoal}</div>
          </div>
        </div>
      </div>
      {/* Earned Achievements */}
      <div className="mb-8">
        <h4 className="text-md font-heading font-medium text-foreground mb-4 flex items-center">
          <Icon name="Award" size={18} className="mr-2 text-success" />
          {t?.earned} ({earnedAchievements?.length})
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {earnedAchievements?.map((achievement) => (
            <div
              key={achievement?.id}
              onClick={() => setSelectedAchievement(achievement)}
              className="relative bg-muted rounded-lg p-4 cursor-pointer hover:bg-muted/80 transition-colors micro-scale group"
            >
              <div className={`w-12 h-12 ${achievement?.color} rounded-full flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                <Icon name={achievement?.icon} size={24} color="white" />
              </div>
              <h5 className="text-sm font-medium text-foreground text-center mb-1 line-clamp-2">
                {achievement?.title}
              </h5>
              <div className="flex items-center justify-center space-x-1">
                <Icon name="Star" size={12} className={getRarityColor(achievement?.rarity)} />
                <span className="text-xs font-caption text-muted-foreground">
                  {achievement?.points} pts
                </span>
              </div>
              
              {/* Earned indicator */}
              <div className="absolute -top-2 -right-2 bg-success rounded-full p-1">
                <Icon name="Check" size={12} color="white" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Locked Achievements */}
      <div>
        <h4 className="text-md font-heading font-medium text-foreground mb-4 flex items-center">
          <Icon name="Lock" size={18} className="mr-2 text-muted-foreground" />
          {t?.locked} ({lockedAchievements?.length})
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {lockedAchievements?.map((achievement) => (
            <div
              key={achievement?.id}
              onClick={() => setSelectedAchievement(achievement)}
              className="relative bg-muted/50 rounded-lg p-4 cursor-pointer hover:bg-muted/70 transition-colors micro-scale group opacity-75"
            >
              <div className={`w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                <Icon name={achievement?.icon} size={24} color="white" />
              </div>
              <h5 className="text-sm font-medium text-muted-foreground text-center mb-1 line-clamp-2">
                {achievement?.title}
              </h5>
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Icon name="Star" size={12} className="text-gray-400" />
                <span className="text-xs font-caption text-muted-foreground">
                  {achievement?.points} pts
                </span>
              </div>
              
              {/* Progress bar for locked achievements */}
              {achievement?.progress && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${achievement?.progress}%` }}
                  />
                </div>
              )}
              
              {/* Lock indicator */}
              <div className="absolute -top-2 -right-2 bg-muted-foreground rounded-full p-1">
                <Icon name="Lock" size={12} color="white" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                {t?.viewDetails}
              </h3>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className={`w-20 h-20 ${selectedAchievement?.earned ? selectedAchievement?.color : 'bg-gray-400'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon name={selectedAchievement?.icon} size={32} color="white" />
              </div>
              <h4 className="text-xl font-heading font-bold text-foreground mb-2">
                {selectedAchievement?.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedAchievement?.description}
              </p>
              
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={16} className={getRarityColor(selectedAchievement?.rarity)} />
                  <span className="font-medium capitalize">{selectedAchievement?.rarity}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Zap" size={16} className="text-accent" />
                  <span className="font-medium">{selectedAchievement?.points} points</span>
                </div>
              </div>
            </div>
            
            {selectedAchievement?.earned ? (
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-success">
                  {t?.earnedOn} {new Date(selectedAchievement.earnedDate)?.toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t?.progress}</span>
                  <span className="font-medium text-foreground">{selectedAchievement?.progress || 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectedAchievement?.progress || 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t?.requirement}: {selectedAchievement?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementGallery;