import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import StudentOverviewTable from './components/StudentOverviewTable';
import ClassAnalytics from './components/ClassAnalytics';
import QuickActions from './components/QuickActions';
import AttendanceTracker from './components/AttendanceTracker';
import CommunicationPanel from './components/CommunicationPanel';
import ConnectivityStatus from '../../components/ui/ConnectivityStatus';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 30,
    activeToday: 26,
    averageProgress: 78.5,
    pendingAssignments: 12
  });

  // Mock student data
  const studentsData = [
    {
      id: 1,
      name: "Rahul Sharma",
      rollNumber: "2024001",
      grade: "8",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      status: "active",
      completionRate: 85,
      averageScore: 78,
      lastActivity: "2 hours ago",
      subjects: ["Mathematics", "Science", "English"],
      parentContact: "+91-9876543210"
    },
    {
      id: 2,
      name: "Priya Patel",
      rollNumber: "2024002",
      grade: "8",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      status: "active",
      completionRate: 92,
      averageScore: 88,
      lastActivity: "1 hour ago",
      subjects: ["Mathematics", "Science", "English"],
      parentContact: "+91-9876543211"
    },
    {
      id: 3,
      name: "Arjun Kumar",
      rollNumber: "2024003",
      grade: "8",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      status: "needs-attention",
      completionRate: 45,
      averageScore: 52,
      lastActivity: "2 days ago",
      subjects: ["Mathematics", "Science", "English"],
      parentContact: "+91-9876543212"
    },
    {
      id: 4,
      name: "Sneha Gupta",
      rollNumber: "2024004",
      grade: "8",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      status: "active",
      completionRate: 78,
      averageScore: 82,
      lastActivity: "30 minutes ago",
      subjects: ["Mathematics", "Science", "English"],
      parentContact: "+91-9876543213"
    },
    {
      id: 5,
      name: "Vikram Singh",
      rollNumber: "2024005",
      grade: "8",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      status: "inactive",
      completionRate: 23,
      averageScore: 38,
      lastActivity: "5 days ago",
      subjects: ["Mathematics", "Science", "English"],
      parentContact: "+91-9876543214"
    }
  ];

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

  const viewOptions = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'attendance', label: 'Attendance', icon: 'UserCheck' },
    { id: 'communication', label: 'Communication', icon: 'MessageSquare' }
  ];

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    // Navigate to student profile or show detailed view
    console.log('Selected student:', student);
  };

  const handleViewProgress = (student) => {
    navigate('/progress-tracking', { state: { studentId: student?.id } });
  };

  const handleActionComplete = (action, data) => {
    console.log('Action completed:', action, data);
    
    // Handle different actions
    switch (action) {
      case 'assignment': console.log('Assignment created:', data);
        break;
      case 'announcement': console.log('Announcement sent:', data);
        break;
      case 'attendance': setActiveView('attendance');
        break;
      case 'quiz': navigate('/content-management');
        break;
      case 'report': console.log('Generating report...');
        break;
      case 'parent-contact': setActiveView('communication');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleAttendanceUpdate = (attendanceData) => {
    console.log('Attendance updated:', attendanceData);
    // In a real app, this would sync with the backend
  };

  const handleMessageSent = (messageData) => {
    console.log('Message sent:', messageData);
    // In a real app, this would send the message via API
  };

  const getGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return currentLanguage === 'hi' ? 'सुप्रभात' : 'Good Morning';
    if (hour < 17) return currentLanguage === 'hi' ? 'नमस्ते' : 'Good Afternoon';
    return currentLanguage === 'hi' ? 'शुभ संध्या' : 'Good Evening';
  };

  const translations = {
    en: {
      greeting: getGreeting(),
      teacherName: 'Mrs. Sharma',
      welcomeMessage: 'Welcome back to your classroom dashboard',
      totalStudents: 'Total Students',
      activeToday: 'Active Today',
      averageProgress: 'Average Progress',
      pendingAssignments: 'Pending Assignments',
      classOverview: 'Class Overview',
      quickActions: 'Quick Actions'
    },
    hi: {
      greeting: getGreeting(),
      teacherName: 'श्रीमती शर्मा',
      welcomeMessage: 'अपने क्लासरूम डैशबोर्ड में वापस स्वागत है',
      totalStudents: 'कुल छात्र',
      activeToday: 'आज सक्रिय',
      averageProgress: 'औसत प्रगति',
      pendingAssignments: 'लंबित असाइनमेंट',
      classOverview: 'कक्षा अवलोकन',
      quickActions: 'त्वरित कार्य'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  {t?.greeting}, {t?.teacherName}!
                </h1>
                <p className="text-muted-foreground mt-2">
                  {t?.welcomeMessage}
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="text-sm text-muted-foreground">
                    Today: {new Date()?.toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <ConnectivityStatus position="inline" showLabel={true} />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  iconName="Settings"
                  onClick={() => console.log('Settings')}
                  className="micro-scale"
                >
                  Settings
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  onClick={() => navigate('/content-management')}
                  className="micro-scale"
                >
                  Create Content
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-caption text-muted-foreground">{t?.totalStudents}</p>
                  <p className="text-3xl font-heading font-bold text-foreground">{dashboardStats?.totalStudents}</p>
                  <p className="text-xs text-success flex items-center mt-2">
                    <Icon name="Users" size={12} className="mr-1" />
                    All enrolled
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-caption text-muted-foreground">{t?.activeToday}</p>
                  <p className="text-3xl font-heading font-bold text-foreground">{dashboardStats?.activeToday}</p>
                  <p className="text-xs text-success flex items-center mt-2">
                    <Icon name="TrendingUp" size={12} className="mr-1" />
                    87% engagement
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="Activity" size={24} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-caption text-muted-foreground">{t?.averageProgress}</p>
                  <p className="text-3xl font-heading font-bold text-foreground">{dashboardStats?.averageProgress}%</p>
                  <p className="text-xs text-primary flex items-center mt-2">
                    <Icon name="Target" size={12} className="mr-1" />
                    On track
                  </p>
                </div>
                <ProgressIndicator
                  currentProgress={dashboardStats?.averageProgress}
                  totalProgress={100}
                  showDetails={false}
                  size="sm"
                />
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-caption text-muted-foreground">{t?.pendingAssignments}</p>
                  <p className="text-3xl font-heading font-bold text-foreground">{dashboardStats?.pendingAssignments}</p>
                  <p className="text-xs text-warning flex items-center mt-2">
                    <Icon name="Clock" size={12} className="mr-1" />
                    Need review
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={24} className="text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* View Navigation */}
          <div className="bg-card rounded-lg border border-border shadow-sm mb-6">
            <nav className="flex space-x-1 p-4 overflow-x-auto">
              {viewOptions?.map((option) => (
                <button
                  key={option?.id}
                  onClick={() => setActiveView(option?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap micro-scale ${
                    activeView === option?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={option?.icon} size={16} />
                  <span>{option?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Dynamic Content Based on Active View */}
          <div className="space-y-6">
            {activeView === 'overview' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <StudentOverviewTable
                    students={studentsData}
                    onStudentSelect={handleStudentSelect}
                    onViewProgress={handleViewProgress}
                  />
                </div>
                <div>
                  <QuickActions onActionComplete={handleActionComplete} />
                </div>
              </div>
            )}

            {activeView === 'analytics' && (
              <ClassAnalytics analyticsData={{}} />
            )}

            {activeView === 'attendance' && (
              <AttendanceTracker
                students={studentsData}
                onAttendanceUpdate={handleAttendanceUpdate}
              />
            )}

            {activeView === 'communication' && (
              <CommunicationPanel
                students={studentsData}
                onMessageSent={handleMessageSent}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;