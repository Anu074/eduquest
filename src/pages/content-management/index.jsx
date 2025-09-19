import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import FileUploadZone from './components/FileUploadZone';
import ContentLibrary from './components/ContentLibrary';
import QuizBuilder from './components/QuizBuilder';
import ContentScheduler from './components/ContentScheduler';
import ContentAnalytics from './components/ContentAnalytics';

const ContentManagement = () => {
  const [activeView, setActiveView] = useState('library');
  const [selectedContent, setSelectedContent] = useState(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [uploadStats, setUploadStats] = useState({
    totalFiles: 156,
    totalSize: '2.3 GB',
    thisMonth: 23,
    pending: 5
  });

  // Load saved language preference
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
      title: 'Content Management',
      subtitle: 'Upload, organize, and distribute educational materials',
      library: 'Content Library',
      upload: 'Upload Content',
      quizBuilder: 'Quiz Builder',
      scheduler: 'Content Scheduler',
      analytics: 'Analytics',
      totalFiles: 'Total Files',
      totalSize: 'Total Size',
      thisMonth: 'This Month',
      pending: 'Pending Review',
      createQuiz: 'Create New Quiz',
      scheduleContent: 'Schedule Release',
      viewAnalytics: 'View Analytics',
      batchUpload: 'Batch Upload',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions'
    },
    hi: {
      title: 'सामग्री प्रबंधन',
      subtitle: 'शैक्षिक सामग्री अपलोड, व्यवस्थित और वितरित करें',
      library: 'सामग्री पुस्तकालय',
      upload: 'सामग्री अपलोड करें',
      quizBuilder: 'प्रश्नोत्तरी निर्माता',
      scheduler: 'सामग्री शेड्यूलर',
      analytics: 'विश्लेषण',
      totalFiles: 'कुल फाइलें',
      totalSize: 'कुल आकार',
      thisMonth: 'इस महीने',
      pending: 'समीक्षा लंबित',
      createQuiz: 'नई प्रश्नोत्तरी बनाएं',
      scheduleContent: 'रिलीज़ शेड्यूल करें',
      viewAnalytics: 'विश्लेषण देखें',
      batchUpload: 'बैच अपलोड',
      recentActivity: 'हाल की गतिविधि',
      quickActions: 'त्वरित कार्य'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  const navigationItems = [
    { id: 'library', label: t?.library, icon: 'FolderOpen' },
    { id: 'upload', label: t?.upload, icon: 'Upload' },
    { id: 'quiz', label: t?.quizBuilder, icon: 'FileText' },
    { id: 'scheduler', label: t?.scheduler, icon: 'Calendar' },
    { id: 'analytics', label: t?.analytics, icon: 'BarChart3' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'upload',
      title: currentLanguage === 'hi' ? 'गणित पाठ अपलोड किया गया' : 'Mathematics Lesson Uploaded',
      time: '2 hours ago',
      user: 'Priya Sharma',
      icon: 'Upload',
      status: 'success'
    },
    {
      id: 2,
      type: 'quiz',
      title: currentLanguage === 'hi' ? 'विज्ञान प्रश्नोत्तरी बनाई गई' : 'Science Quiz Created',
      time: '4 hours ago',
      user: 'Rajesh Kumar',
      icon: 'FileText',
      status: 'success'
    },
    {
      id: 3,
      type: 'schedule',
      title: currentLanguage === 'hi' ? 'सामग्री रिलीज़ शेड्यूल की गई' : 'Content Release Scheduled',
      time: '6 hours ago',
      user: 'Amit Patel',
      icon: 'Calendar',
      status: 'pending'
    },
    {
      id: 4,
      type: 'review',
      title: currentLanguage === 'hi' ? 'सामग्री समीक्षा पूर्ण' : 'Content Review Completed',
      time: '1 day ago',
      user: 'Sunita Singh',
      icon: 'CheckCircle',
      status: 'success'
    }
  ];

  const handleFilesUploaded = (files) => {
    console.log('Files uploaded:', files);
    setUploadStats(prev => ({
      ...prev,
      totalFiles: prev?.totalFiles + files?.length,
      thisMonth: prev?.thisMonth + files?.length,
      pending: prev?.pending + files?.length
    }));
  };

  const handleContentSelect = (content) => {
    setSelectedContent(content);
  };

  const handleContentEdit = (content) => {
    setSelectedContent(content);
    // Navigate to appropriate editor based on content type
    if (content?.type === 'quiz') {
      setShowQuizBuilder(true);
    }
  };

  const handleSaveQuiz = (quizData) => {
    console.log('Quiz saved:', quizData);
    setShowQuizBuilder(false);
    setActiveView('library');
  };

  const handleScheduleContent = (scheduleData) => {
    console.log('Content scheduled:', scheduleData);
    setShowScheduler(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'text-success',
      pending: 'text-warning',
      error: 'text-error'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const renderMainContent = () => {
    if (showQuizBuilder) {
      return (
        <QuizBuilder
          onSaveQuiz={handleSaveQuiz}
          onCancel={() => setShowQuizBuilder(false)}
        />
      );
    }

    if (showScheduler) {
      return (
        <ContentScheduler
          onScheduleContent={handleScheduleContent}
          onClose={() => setShowScheduler(false)}
        />
      );
    }

    if (showAnalytics) {
      return (
        <ContentAnalytics
          contentId={selectedContent?.id}
          onClose={() => setShowAnalytics(false)}
        />
      );
    }

    switch (activeView) {
      case 'library':
        return (
          <ContentLibrary
            onContentSelect={handleContentSelect}
            onContentEdit={handleContentEdit}
          />
        );
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">{t?.upload}</h2>
              <Button variant="outline">
                <Icon name="FolderPlus" size={16} className="mr-2" />
                {t?.batchUpload}
              </Button>
            </div>
            <FileUploadZone
              onFilesUploaded={handleFilesUploaded}
              acceptedTypes={['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.mp4', '.mp3', '.jpg', '.png']}
              maxSize={50}
            />
          </div>
        );
      case 'quiz': // Add this case to handle navigation from the sidebar
        return (
          <QuizBuilder
            onSaveQuiz={handleSaveQuiz}
            onCancel={() => setActiveView('library')}
          />
        );
      default:
        return (
          <ContentLibrary
            onContentSelect={handleContentSelect}
            onContentEdit={handleContentEdit}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{t?.title}</h1>
                <p className="text-muted-foreground mt-2">{t?.subtitle}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduler(true)}
                >
                  <Icon name="Calendar" size={16} className="mr-2" />
                  {t?.scheduleContent}
                </Button>
                <Button onClick={() => setShowQuizBuilder(true)}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  {t?.createQuiz}
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t?.totalFiles}</p>
                    <p className="text-2xl font-bold text-foreground">{uploadStats?.totalFiles}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t?.totalSize}</p>
                    <p className="text-2xl font-bold text-foreground">{uploadStats?.totalSize}</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Icon name="HardDrive" size={24} className="text-secondary" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t?.thisMonth}</p>
                    <p className="text-2xl font-bold text-foreground">{uploadStats?.thisMonth}</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Icon name="TrendingUp" size={24} className="text-accent" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t?.pending}</p>
                    <p className="text-2xl font-bold text-foreground">{uploadStats?.pending}</p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <Icon name="Clock" size={24} className="text-warning" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-foreground mb-4">{t?.quickActions}</h3>
                <nav className="space-y-2">
                  {navigationItems?.map((item) => (
                    <Button
                      key={item?.id}
                      variant={activeView === item?.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveView(item?.id)}
                      className="w-full justify-start micro-scale"
                      iconName={item?.icon}
                      iconPosition="left"
                      iconSize={16}
                    >
                      {item?.label}
                    </Button>
                  ))}
                </nav>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-4">{t?.recentActivity}</h3>
                <div className="space-y-3">
                  {recentActivities?.map((activity) => (
                    <div key={activity?.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getStatusColor(activity?.status)} bg-muted`}>
                        <Icon name={activity?.icon} size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity?.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{activity?.user}</span>
                          <span>•</span>
                          <span>{activity?.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnalytics(true)}
                  className="w-full mt-4"
                >
                  {t?.viewAnalytics}
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
