import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressCard from './components/ProgressCard';
import SubjectGrid from './components/SubjectGrid';
import GamificationPanel from './components/GamificationPanel';
import QuickActions from './components/QuickActions';
import DailyChallengeCard from './components/DailyChallengeCard';

const StudentDashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('eduquest-language') || 'en';
    setCurrentLanguage(savedLanguage);
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const handleSubjectClick = (subject) => {
    navigate('/lesson-content', { state: { selectedSubject: subject } });
  };

  const translations = {
    en: {
      welcome: "Welcome back!",
      dashboard: "Student Dashboard",
      loading: "Loading your learning journey...",
      todaysGoal: "Today\'s Goal",
      recentActivity: "Recent Activity"
    },
    hi: {
      welcome: "वापस स्वागत है!",
      dashboard: "छात्र डैशबोर्ड",
      loading: "आपकी शिक्षा यात्रा लोड हो रही है...",
      todaysGoal: "आज का लक्ष्य",
      recentActivity: "हाल की गतिविधि"
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t?.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t?.welcome}</h1>
            <p className="text-muted-foreground">
              Ready to continue your learning journey today?
            </p>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Progress Overview */}
              <ProgressCard currentLanguage={currentLanguage} />
              
              {/* Subjects Grid */}
              <SubjectGrid 
                currentLanguage={currentLanguage}
                onSubjectClick={handleSubjectClick}
              />
              
              {/* Daily Challenge - Mobile/Tablet */}
              <div className="lg:hidden">
                <DailyChallengeCard currentLanguage={currentLanguage} />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Daily Challenge - Desktop */}
              <div className="hidden lg:block">
                <DailyChallengeCard currentLanguage={currentLanguage} />
              </div>
              
              {/* Quick Actions */}
              <QuickActions currentLanguage={currentLanguage} />
              
              {/* Gamification Panel */}
              <GamificationPanel currentLanguage={currentLanguage} />
            </div>
          </div>

          {/* Bottom Section - Recent Activity (Mobile Enhancement) */}
          <div className="mt-8 lg:hidden">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <span>{t?.recentActivity}</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <span className="text-xs font-bold">M</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Mathematics Quiz</p>
                    <p className="text-xs text-muted-foreground">Completed 2 hours ago</p>
                  </div>
                  <span className="text-sm font-bold text-success">95%</span>
                </div>
                
                <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <span className="text-xs font-bold">S</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Science Lesson</p>
                    <p className="text-xs text-muted-foreground">Completed yesterday</p>
                  </div>
                  <span className="text-sm font-bold text-primary">+150 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;