import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, userRole, logout, loading, isAuthenticated, isTeacher, isStudent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items based on role
  const navigationItems = {
    student: [
      { path: '/student-dashboard', label: 'Dashboard', icon: 'Home' },
      { path: '/lesson-content', label: 'Lessons', icon: 'BookOpen' },
      { path: '/quiz-assessment', label: 'Quizzes', icon: 'FileText' },
      { path: '/progress-tracking', label: 'Progress', icon: 'TrendingUp' }
    ],
    teacher: [
      { path: '/teacher-dashboard', label: 'Dashboard', icon: 'BarChart3' },
      { path: '/content-management', label: 'Content', icon: 'FolderOpen' },
      { path: '/lesson-content', label: 'Lessons', icon: 'BookOpen' },
      { path: '/quiz-assessment', label: 'Quizzes', icon: 'FileText' },
      { path: '/progress-tracking', label: 'Progress', icon: 'TrendingUp' }
    ]
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' }
  ];

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('eduquest-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('eduquest-language', langCode);
    // Trigger language change event for other components
    window.dispatchEvent(new CustomEvent('languageChange', { detail: langCode }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  // Don't show header on login page or when not authenticated
  if (!isAuthenticated || location.pathname === '/login') {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-center h-16 px-4 lg:px-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </header>
    );
  }

  const currentNavItems = navigationItems?.[userRole] || [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="GraduationCap" size={24} color="white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-heading font-bold text-foreground">EduQuest</h1>
            <p className="text-xs font-caption text-muted-foreground">Learn. Grow. Achieve.</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {currentNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              iconName={item?.icon}
              iconPosition="left"
              iconSize={18}
              onClick={() => navigate(item?.path)}
              className="micro-scale"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2">
          {/* Connectivity Status */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-warning'}`} />
            <span className="text-xs font-caption text-muted-foreground">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Language Switcher */}
          <div className="relative group">
            <Button variant="ghost" size="sm" className="micro-scale">
              <span className="text-sm">{languages?.find(l => l?.code === currentLanguage)?.flag}</span>
              <Icon name="ChevronDown" size={16} className="ml-1" />
            </Button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {languages?.map((lang) => (
                <button
                  key={lang?.code}
                  onClick={() => handleLanguageChange(lang?.code)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currentLanguage === lang?.code ? 'bg-muted text-primary' : 'text-foreground'
                  }`}
                >
                  <span className="mr-2">{lang?.flag}</span>
                  {lang?.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="micro-scale"
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
            >
              <Icon name={userRole === 'student' ? 'User' : 'Users'} size={16} />
              <span className="hidden sm:inline ml-2 capitalize">{userRole}</span>
              <Icon name="ChevronDown" size={16} className="ml-1" />
            </Button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-popover border border-border rounded-lg shadow-lg z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
                      <Icon name={userRole === 'student' ? 'User' : 'Users'} size={20} color="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {userRole}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate(userRole === 'student' ? '/student-dashboard' : '/teacher-dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center"
                  >
                    <Icon name="Home" size={16} className="mr-3" />
                    Dashboard
                  </button>
                  
                  {isTeacher && (
                    <button
                      onClick={() => {
                        navigate('/content-management');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center"
                    >
                      <Icon name="FolderOpen" size={16} className="mr-3" />
                      Manage Content
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      navigate('/progress-tracking');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center"
                  >
                    <Icon name="TrendingUp" size={16} className="mr-3" />
                    View Progress
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-border py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center text-destructive hover:text-destructive"
                  >
                    <Icon name="LogOut" size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden micro-scale"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-slide-in">
          <nav className="px-4 py-3 space-y-1">
            {/* User Info Mobile */}
            <div className="flex items-center space-x-3 py-3 border-b border-border mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                <Icon name={userRole === 'student' ? 'User' : 'Users'} size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole}
                </p>
              </div>
            </div>

            {/* Navigation Items */}
            {currentNavItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                size="sm"
                iconName={item?.icon}
                iconPosition="left"
                iconSize={18}
                onClick={() => {
                  navigate(item?.path);
                  setIsMenuOpen(false);
                }}
                className="w-full justify-start micro-scale"
              >
                {item?.label}
              </Button>
            ))}
            
            {/* Mobile Connectivity Status */}
            <div className="flex items-center justify-center space-x-2 py-2 text-sm text-muted-foreground border-t border-border mt-3 pt-3">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-warning'}`} />
              <span>{isOnline ? 'Connected' : 'Offline Mode'}</span>
            </div>

            {/* Mobile Logout */}
            <Button
              variant="ghost"
              size="sm"
              iconName="LogOut"
              iconPosition="left"
              iconSize={18}
              onClick={handleLogout}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 micro-scale"
            >
              Sign Out
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;