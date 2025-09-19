import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const DailyChallengeCard = ({ currentLanguage = 'en' }) => {
  const [dailyChallenge, setDailyChallenge] = useState({
    id: 1,
    title: "Math Marathon",
    titleHi: "गणित मैराथन",
    description: "Solve 5 algebra problems in 10 minutes",
    descriptionHi: "10 मिनट में 5 बीजगणित समस्याएं हल करें",
    subject: "Mathematics",
    subjectHi: "गणित",
    difficulty: "Medium",
    difficultyHi: "मध्यम",
    timeLimit: 600, // 10 minutes in seconds
    timeRemaining: 480, // 8 minutes remaining
    progress: 60, // 3 out of 5 problems solved
    totalProblems: 5,
    solvedProblems: 3,
    points: 150,
    bonusPoints: 50,
    isActive: true,
    isCompleted: false,
    expiresAt: new Date(Date.now() + 8 * 60 * 1000) // 8 minutes from now
  });

  const [timeLeft, setTimeLeft] = useState(dailyChallenge?.timeRemaining);

  const translations = {
    en: {
      dailyChallenge: "Daily Challenge",
      timeLeft: "Time Left",
      progress: "Progress",
      points: "Points",
      bonus: "Bonus",
      difficulty: "Difficulty",
      startChallenge: "Start Challenge",
      continueChallenge: "Continue Challenge",
      challengeComplete: "Challenge Complete!",
      expired: "Challenge Expired",
      newChallenge: "New Challenge Available",
      problems: "problems",
      solved: "solved",
      minutes: "min",
      seconds: "sec",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard"
    },
    hi: {
      dailyChallenge: "दैनिक चुनौती",
      timeLeft: "समय बचा",
      progress: "प्रगति",
      points: "अंक",
      bonus: "बोनस",
      difficulty: "कठिनाई",
      startChallenge: "चुनौती शुरू करें",
      continueChallenge: "चुनौती जारी रखें",
      challengeComplete: "चुनौती पूर्ण!",
      expired: "चुनौती समाप्त",
      newChallenge: "नई चुनौती उपलब्ध",
      problems: "समस्याएं",
      solved: "हल",
      minutes: "मिनट",
      seconds: "सेकंड",
      easy: "आसान",
      medium: "मध्यम",
      hard: "कठिन"
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  // Timer countdown
  useEffect(() => {
    if (!dailyChallenge?.isActive || dailyChallenge?.isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setDailyChallenge(prevChallenge => ({
            ...prevChallenge,
            isActive: false
          }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dailyChallenge?.isActive, dailyChallenge?.isCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTimeColor = () => {
    if (timeLeft > 300) return 'text-success'; // > 5 minutes
    if (timeLeft > 120) return 'text-warning'; // > 2 minutes
    return 'text-error'; // < 2 minutes
  };

  const handleChallengeAction = () => {
    if (dailyChallenge?.progress > 0) {
      // Continue challenge
      console.log('Continuing daily challenge...');
    } else {
      // Start challenge
      console.log('Starting daily challenge...');
    }
  };

  if (dailyChallenge?.isCompleted) {
    return (
      <div className="bg-gradient-to-br from-success to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="text-center">
          <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Icon name="Trophy" size={32} className="text-yellow-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t?.challengeComplete}</h3>
          <p className="text-green-100 mb-4">
            {dailyChallenge?.points + dailyChallenge?.bonusPoints} {t?.points} earned!
          </p>
          <Button variant="secondary" size="sm" className="micro-scale">
            {t?.newChallenge}
          </Button>
        </div>
      </div>
    );
  }

  if (!dailyChallenge?.isActive) {
    return (
      <div className="bg-muted border border-border rounded-xl p-6 text-center">
        <div className="text-muted-foreground mb-4">
          <Icon name="Clock" size={48} className="mx-auto mb-2 opacity-50" />
          <h3 className="text-lg font-semibold">{t?.expired}</h3>
          <p className="text-sm">Check back tomorrow for a new challenge!</p>
        </div>
        <Button variant="outline" size="sm" disabled className="micro-scale">
          {t?.newChallenge}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-accent to-orange-500 rounded-xl p-6 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{t?.dailyChallenge}</h3>
          <p className="text-orange-100 opacity-90">
            {currentLanguage === 'hi' ? dailyChallenge?.subjectHi : dailyChallenge?.subject}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${getTimeColor()}`}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-orange-100 text-sm opacity-90">{t?.timeLeft}</p>
        </div>
      </div>
      {/* Challenge Details */}
      <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-2">
          {currentLanguage === 'hi' ? dailyChallenge?.titleHi : dailyChallenge?.title}
        </h4>
        <p className="text-orange-100 text-sm mb-3">
          {currentLanguage === 'hi' ? dailyChallenge?.descriptionHi : dailyChallenge?.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(dailyChallenge?.difficulty)} text-gray-800`}>
            {currentLanguage === 'hi' ? 
              t?.[dailyChallenge?.difficulty?.toLowerCase()] || dailyChallenge?.difficultyHi : 
              dailyChallenge?.difficulty
            }
          </span>
          <div className="flex items-center space-x-4 text-sm">
            <span>{dailyChallenge?.points} {t?.points}</span>
            <span className="text-yellow-300">+{dailyChallenge?.bonusPoints} {t?.bonus}</span>
          </div>
        </div>
      </div>
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{t?.progress}</span>
          <span className="text-sm">
            {dailyChallenge?.solvedProblems}/{dailyChallenge?.totalProblems} {t?.problems} {t?.solved}
          </span>
        </div>
        <div className="w-full bg-orange-800 bg-opacity-50 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${dailyChallenge?.progress}%` }}
          />
        </div>
      </div>
      {/* Action Button */}
      <Button
        variant="secondary"
        size="default"
        onClick={handleChallengeAction}
        iconName={dailyChallenge?.progress > 0 ? "Play" : "Zap"}
        iconPosition="left"
        iconSize={16}
        className="w-full micro-scale"
      >
        {dailyChallenge?.progress > 0 ? t?.continueChallenge : t?.startChallenge}
      </Button>
    </div>
  );
};

export default DailyChallengeCard;