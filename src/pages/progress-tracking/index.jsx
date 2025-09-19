import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ConnectivityStatus from '../../components/ui/ConnectivityStatus';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

// Import all components
import ProgressChart from './components/ProgressChart';
import AchievementGallery from './components/AchievementGallery';
import LearningStreak from './components/LearningStreak';
import PerformanceMetrics from './components/PerformanceMetrics';
import LeaderboardRanking from './components/LeaderboardRanking';
import GoalSetting from './components/GoalSetting';

const ProgressTracking = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [chartType, setChartType] = useState('completion');
  const [syncStatus, setSyncStatus] = useState('idle');
  const navigate = useNavigate();

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

  // Simulate sync status
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine && syncStatus === 'idle') {
        setSyncStatus('syncing');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }
    }, 30000); // Sync every 30 seconds when online

    return () => clearInterval(interval);
  }, [syncStatus]);

  const translations = {
    en: {
      progressTracking: 'Progress Tracking',
      overview: 'Learning Overview',
      selectSubject: 'Select Subject',
      chartType: 'Chart Type',
      completion: 'Completion Rate',
      performance: 'Performance',
      progress: 'Progress Over Time',
      backToDashboard: 'Back to Dashboard',
      shareProgress: 'Share Progress',
      exportReport: 'Export Report',
      mathematics: 'Mathematics',
      science: 'Science',
      english: 'English',
      history: 'History',
      geography: 'Geography',
      offlineNote: 'Some data may be outdated. Connect to internet to sync latest progress.',
      lastSync: 'Last synced'
    },
    hi: {
      progressTracking: 'प्रगति ट्रैकिंग',
      overview: 'शिक्षा अवलोकन',
      selectSubject: 'विषय चुनें',
      chartType: 'चार्ट प्रकार',
      completion: 'पूर्णता दर',
      performance: 'प्रदर्शन',
      progress: 'समय के साथ प्रगति',
      backToDashboard: 'डैशबोर्ड पर वापस',
      shareProgress: 'प्रगति साझा करें',
      exportReport: 'रिपोर्ट निर्यात करें',
      mathematics: 'गणित',
      science: 'विज्ञान',
      english: 'अंग्रेजी',
      history: 'इतिहास',
      geography: 'भूगोल',
      offlineNote: 'कुछ डेटा पुराना हो सकता है। नवीनतम प्रगति सिंक करने के लिए इंटरनेट से कनेक्ट करें।',
      lastSync: 'अंतिम सिंक'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  const subjectOptions = [
    { value: 'mathematics', label: t?.mathematics },
    { value: 'science', label: t?.science },
    { value: 'english', label: t?.english },
    { value: 'history', label: t?.history },
    { value: 'geography', label: t?.geography }
  ];

  const chartTypeOptions = [
    { value: 'completion', label: t?.completion },
    { value: 'performance', label: t?.performance },
    { value: 'progress', label: t?.progress }
  ];

  const handleShareProgress = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Learning Progress - EduQuest',
        text: 'Check out my learning progress on EduQuest!',
        url: window.location?.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard?.writeText(window.location?.href);
      // You could show a toast notification here
    }
  };

  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF report
    console.log('Exporting progress report...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                {t?.progressTracking}
              </h1>
              <p className="text-muted-foreground">
                {t?.overview}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <ConnectivityStatus 
                position="inline" 
                syncStatus={syncStatus}
                lastSyncTime={new Date()?.toISOString()}
              />
              
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/student-dashboard')}
                className="micro-scale"
              >
                {t?.backToDashboard}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="Share2"
                onClick={handleShareProgress}
                className="micro-scale"
                title={t?.shareProgress}
              />
              
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                onClick={handleExportReport}
                className="micro-scale"
                title={t?.exportReport}
              />
            </div>
          </div>

          {/* Offline Notice */}
          {!navigator.onLine && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Icon name="WifiOff" size={20} className="text-warning" />
                <p className="text-sm text-warning font-medium">
                  {t?.offlineNote}
                </p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Select
              label={t?.selectSubject}
              options={subjectOptions}
              value={selectedSubject}
              onChange={setSelectedSubject}
              className="w-full"
            />
            
            <Select
              label={t?.chartType}
              options={chartTypeOptions}
              value={chartType}
              onChange={setChartType}
              className="w-full"
            />
            
            <div className="flex items-end">
              <div className="text-sm text-muted-foreground">
                <Icon name="Clock" size={16} className="inline mr-1" />
                {t?.lastSync}: {new Date()?.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Progress Chart */}
            <div className="lg:col-span-2">
              <ProgressChart 
                selectedSubject={selectedSubject}
                chartType={chartType}
              />
            </div>

            {/* Achievement Gallery */}
            <AchievementGallery />

            {/* Learning Streak */}
            <LearningStreak />
          </div>

          {/* Performance and Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Metrics */}
            <PerformanceMetrics />

            {/* Leaderboard Ranking */}
            <LeaderboardRanking />
          </div>

          {/* Goal Setting */}
          <div className="mb-8">
            <GoalSetting />
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button
                variant="outline"
                size="sm"
                iconName="BookOpen"
                iconPosition="left"
                onClick={() => navigate('/lesson-content')}
                className="micro-scale justify-start"
              >
                Continue Learning
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="FileText"
                iconPosition="left"
                onClick={() => navigate('/quiz-assessment')}
                className="micro-scale justify-start"
              >
                Take Quiz
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Target"
                iconPosition="left"
                onClick={() => {
                  document.querySelector('[data-goal-setting]')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="micro-scale justify-start"
              >
                Set New Goal
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Users"
                iconPosition="left"
                onClick={() => {
                  document.querySelector('[data-leaderboard]')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="micro-scale justify-start"
              >
                View Rankings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressTracking;