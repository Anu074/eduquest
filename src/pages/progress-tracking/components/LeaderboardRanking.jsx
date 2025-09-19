import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LeaderboardRanking = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedBoard, setSelectedBoard] = useState('class');

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
      leaderboard: 'Leaderboard Rankings',
      classRanking: 'Class Ranking',
      schoolRanking: 'School Ranking',
      yourRank: 'Your Rank',
      points: 'Points',
      streak: 'Streak',
      days: 'days',
      you: 'You',
      rank: 'Rank',
      student: 'Student',
      score: 'Score',
      improvement: 'Improvement',
      topPerformer: 'Top Performer',
      risingStart: 'Rising Star',
      consistent: 'Consistent Learner'
    },
    hi: {
      leaderboard: 'लीडरबोर्ड रैंकिंग',
      classRanking: 'कक्षा रैंकिंग',
      schoolRanking: 'स्कूल रैंकिंग',
      yourRank: 'आपकी रैंक',
      points: 'अंक',
      streak: 'श्रृंखला',
      days: 'दिन',
      you: 'आप',
      rank: 'रैंक',
      student: 'छात्र',
      score: 'स्कोर',
      improvement: 'सुधार',
      topPerformer: 'शीर्ष प्रदर्शनकर्ता',
      risingStart: 'उभरता सितारा',
      consistent: 'निरंतर शिक्षार्थी'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  // Mock leaderboard data
  const classLeaderboard = [
    {
      id: 1,
      name: currentLanguage === 'hi' ? 'राहुल शर्मा' : 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      points: 2450,
      streak: 15,
      rank: 1,
      badge: 'topPerformer',
      improvement: '+12%'
    },
    {
      id: 2,
      name: currentLanguage === 'hi' ? 'प्रिया पटेल' : 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      points: 2380,
      streak: 12,
      rank: 2,
      badge: 'consistent',
      improvement: '+8%'
    },
    {
      id: 3,
      name: currentLanguage === 'hi' ? 'अमित कुमार' : 'Amit Kumar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      points: 2320,
      streak: 18,
      rank: 3,
      badge: 'risingStart',
      improvement: '+15%'
    },
    {
      id: 4,
      name: currentLanguage === 'hi' ? 'आप' : 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      points: 2280,
      streak: 7,
      rank: 4,
      isCurrentUser: true,
      improvement: '+5%'
    },
    {
      id: 5,
      name: currentLanguage === 'hi' ? 'सुनीता देवी' : 'Sunita Devi',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      points: 2180,
      streak: 9,
      rank: 5,
      improvement: '+3%'
    }
  ];

  const schoolLeaderboard = [
    {
      id: 1,
      name: currentLanguage === 'hi' ? 'आदित्य सिंह' : 'Aditya Singh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      points: 3200,
      streak: 25,
      rank: 1,
      class: '10th A',
      badge: 'topPerformer',
      improvement: '+20%'
    },
    {
      id: 2,
      name: currentLanguage === 'hi' ? 'कविता राज' : 'Kavita Raj',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      points: 3150,
      streak: 22,
      rank: 2,
      class: '10th B',
      badge: 'consistent',
      improvement: '+18%'
    },
    {
      id: 3,
      name: currentLanguage === 'hi' ? 'विकास गुप्ता' : 'Vikas Gupta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      points: 3080,
      streak: 20,
      rank: 3,
      class: '9th A',
      badge: 'risingStart',
      improvement: '+22%'
    },
    {
      id: 15,
      name: currentLanguage === 'hi' ? 'आप' : 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      points: 2280,
      streak: 7,
      rank: 15,
      class: '9th B',
      isCurrentUser: true,
      improvement: '+5%'
    }
  ];

  const getCurrentLeaderboard = () => {
    return selectedBoard === 'class' ? classLeaderboard : schoolLeaderboard;
  };

  const getCurrentUserRank = () => {
    const board = getCurrentLeaderboard();
    const user = board?.find(item => item?.isCurrentUser);
    return user ? user?.rank : 0;
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'topPerformer': return 'Crown';
      case 'risingStart': return 'TrendingUp';
      case 'consistent': return 'Target';
      default: return 'Award';
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'topPerformer': return 'text-yellow-500';
      case 'risingStart': return 'text-green-500';
      case 'consistent': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getBadgeLabel = (badge) => {
    return t?.[badge] || badge;
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const leaderboardOptions = [
    { id: 'class', label: t?.classRanking, icon: 'Users' },
    { id: 'school', label: t?.schoolRanking, icon: 'Building' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          {t?.leaderboard}
        </h3>
        <div className="flex items-center space-x-2">
          {leaderboardOptions?.map((option) => (
            <button
              key={option?.id}
              onClick={() => setSelectedBoard(option?.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors micro-scale flex items-center space-x-1 ${
                selectedBoard === option?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={option?.icon} size={16} />
              <span>{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Your Rank Summary */}
      <div className="bg-primary/10 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {getCurrentUserRank() <= 3 ? getRankIcon(getCurrentUserRank()) : `#${getCurrentUserRank()}`}
              </span>
            </div>
            <div>
              <p className="font-medium text-foreground">{t?.yourRank}</p>
              <p className="text-sm text-muted-foreground">
                {getCurrentUserRank()} of {getCurrentLeaderboard()?.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">2,280</p>
            <p className="text-sm text-muted-foreground">{t?.points}</p>
          </div>
        </div>
      </div>
      {/* Leaderboard List */}
      <div className="space-y-3">
        {getCurrentLeaderboard()?.map((student) => (
          <div
            key={student?.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
              student?.isCurrentUser 
                ? 'bg-primary/10 border border-primary/20' :'bg-muted hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Rank */}
              <div className="w-8 text-center">
                <span className={`text-lg font-bold ${
                  student?.rank <= 3 ? 'text-2xl' : 'text-muted-foreground'
                }`}>
                  {getRankIcon(student?.rank)}
                </span>
              </div>

              {/* Avatar */}
              <div className="relative">
                <Image
                  src={student?.avatar}
                  alt={student?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {student?.badge && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-card border-2 border-card flex items-center justify-center ${getBadgeColor(student?.badge)}`}>
                    <Icon name={getBadgeIcon(student?.badge)} size={12} />
                  </div>
                )}
              </div>

              {/* Student Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className={`font-medium ${
                    student?.isCurrentUser ? 'text-primary' : 'text-foreground'
                  }`}>
                    {student?.name}
                  </p>
                  {student?.isCurrentUser && (
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                      {t?.you}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  {selectedBoard === 'school' && student?.class && (
                    <span>{student?.class}</span>
                  )}
                  <span className="flex items-center space-x-1">
                    <Icon name="Flame" size={12} className="text-orange-500" />
                    <span>{student?.streak} {t?.days}</span>
                  </span>
                  {student?.badge && (
                    <span className={`flex items-center space-x-1 ${getBadgeColor(student?.badge)}`}>
                      <Icon name={getBadgeIcon(student?.badge)} size={12} />
                      <span className="text-xs">{getBadgeLabel(student?.badge)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Points and Improvement */}
            <div className="text-right">
              <p className="font-bold text-foreground">{student?.points?.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{t?.points}</p>
              {student?.improvement && (
                <p className="text-xs text-success font-medium">
                  {student?.improvement}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg text-center">
        <Icon name="Target" size={20} className="text-accent mx-auto mb-2" />
        <p className="text-sm font-medium text-accent">
          {getCurrentUserRank() <= 3 
            ? (currentLanguage === 'hi' ? 'बहुत बढ़िया! आप टॉप 3 में हैं!' : 'Excellent! You\'re in the top 3!')
            : getCurrentUserRank() <= 10
            ? (currentLanguage === 'hi' ? 'बहुत अच्छा! टॉप 3 के लिए कड़ी मेहनत करते रहें!' : 'Great job! Keep pushing for the top 3!')
            : (currentLanguage === 'hi' ? 'आप कर सकते हैं! अधिक अभ्यास करें और आगे बढ़ें!' : 'You can do it! Practice more and climb higher!')
          }
        </p>
      </div>
    </div>
  );
};

export default LeaderboardRanking;