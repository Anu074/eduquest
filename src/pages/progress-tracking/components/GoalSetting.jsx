import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GoalSetting = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    targetValue: '',
    currentValue: 0,
    deadline: '',
    priority: 'medium'
  });

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

  // Load mock goals
  useEffect(() => {
    const mockGoals = [
      {
        id: 1,
        title: currentLanguage === 'hi' ? 'गणित में 95% स्कोर करें' : 'Score 95% in Mathematics',
        description: currentLanguage === 'hi' ? 'अगली परीक्षा में गणित में 95% या उससे अधिक अंक प्राप्त करें' : 'Achieve 95% or higher in the next Mathematics exam',
        category: 'academic',
        targetValue: 95,
        currentValue: 88,
        deadline: '2025-02-15',
        priority: 'high',
        status: 'active',
        createdAt: '2025-01-01'
      },
      {
        id: 2,
        title: currentLanguage === 'hi' ? '30 दिन की स्ट्रीक बनाए रखें' : 'Maintain 30-day streak',
        description: currentLanguage === 'hi' ? 'लगातार 30 दिन तक रोज़ाना अध्ययन करें' : 'Study every day for 30 consecutive days',
        category: 'consistency',
        targetValue: 30,
        currentValue: 7,
        deadline: '2025-02-10',
        priority: 'medium',
        status: 'active',
        createdAt: '2025-01-05'
      },
      {
        id: 3,
        title: currentLanguage === 'hi' ? '50 क्विज़ पूरे करें' : 'Complete 50 quizzes',
        description: currentLanguage === 'hi' ? 'इस महीने 50 क्विज़ पूरे करने का लक्ष्य' : 'Goal to complete 50 quizzes this month',
        category: 'assessment',
        targetValue: 50,
        currentValue: 32,
        deadline: '2025-01-31',
        priority: 'low',
        status: 'active',
        createdAt: '2025-01-01'
      }
    ];
    setGoals(mockGoals);
  }, [currentLanguage]);

  const translations = {
    en: {
      goalSetting: 'Goal Setting & Tracking',
      addNewGoal: 'Add New Goal',
      activeGoals: 'Active Goals',
      completedGoals: 'Completed Goals',
      goalTitle: 'Goal Title',
      description: 'Description',
      category: 'Category',
      targetValue: 'Target Value',
      deadline: 'Deadline',
      priority: 'Priority',
      save: 'Save Goal',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      complete: 'Mark Complete',
      progress: 'Progress',
      daysLeft: 'days left',
      overdue: 'Overdue',
      completed: 'Completed',
      academic: 'Academic',
      consistency: 'Consistency',
      assessment: 'Assessment',
      skill: 'Skill Development',
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    hi: {
      goalSetting: 'लक्ष्य निर्धारण और ट्रैकिंग',
      addNewGoal: 'नया लक्ष्य जोड़ें',
      activeGoals: 'सक्रिय लक्ष्य',
      completedGoals: 'पूर्ण लक्ष्य',
      goalTitle: 'लक्ष्य शीर्षक',
      description: 'विवरण',
      category: 'श्रेणी',
      targetValue: 'लक्ष्य मान',
      deadline: 'समय सीमा',
      priority: 'प्राथमिकता',
      save: 'लक्ष्य सहेजें',
      cancel: 'रद्द करें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      complete: 'पूर्ण चिह्नित करें',
      progress: 'प्रगति',
      daysLeft: 'दिन बचे',
      overdue: 'समय सीमा समाप्त',
      completed: 'पूर्ण',
      academic: 'शैक्षणिक',
      consistency: 'निरंतरता',
      assessment: 'मूल्यांकन',
      skill: 'कौशल विकास',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  const categoryOptions = [
    { value: 'academic', label: t?.academic },
    { value: 'consistency', label: t?.consistency },
    { value: 'assessment', label: t?.assessment },
    { value: 'skill', label: t?.skill }
  ];

  const priorityOptions = [
    { value: 'high', label: t?.high },
    { value: 'medium', label: t?.medium },
    { value: 'low', label: t?.low }
  ];

  const handleAddGoal = () => {
    if (!newGoal?.title || !newGoal?.category || !newGoal?.targetValue || !newGoal?.deadline) {
      return;
    }

    const goal = {
      id: Date.now(),
      ...newGoal,
      targetValue: parseInt(newGoal?.targetValue),
      currentValue: 0,
      status: 'active',
      createdAt: new Date()?.toISOString()?.split('T')?.[0]
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: '',
      targetValue: '',
      currentValue: 0,
      deadline: '',
      priority: 'medium'
    });
    setShowAddGoal(false);
  };

  const handleCompleteGoal = (goalId) => {
    setGoals(goals?.map(goal => 
      goal?.id === goalId 
        ? { ...goal, status: 'completed', currentValue: goal?.targetValue }
        : goal
    ));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals?.filter(goal => goal?.id !== goalId));
  };

  const getProgressPercentage = (goal) => {
    return Math.min((goal?.currentValue / goal?.targetValue) * 100, 100);
  };

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic': return 'BookOpen';
      case 'consistency': return 'Flame';
      case 'assessment': return 'FileText';
      case 'skill': return 'Target';
      default: return 'Flag';
    }
  };

  const activeGoals = goals?.filter(goal => goal?.status === 'active');
  const completedGoals = goals?.filter(goal => goal?.status === 'completed');

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          {t?.goalSetting}
        </h3>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setShowAddGoal(true)}
          className="micro-scale"
        >
          {t?.addNewGoal}
        </Button>
      </div>
      {/* Add Goal Form */}
      {showAddGoal && (
        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t?.goalTitle}
              type="text"
              value={newGoal?.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e?.target?.value })}
              placeholder="Enter goal title"
              required
            />
            
            <Select
              label={t?.category}
              options={categoryOptions}
              value={newGoal?.category}
              onChange={(value) => setNewGoal({ ...newGoal, category: value })}
              placeholder="Select category"
              required
            />
            
            <Input
              label={t?.targetValue}
              type="number"
              value={newGoal?.targetValue}
              onChange={(e) => setNewGoal({ ...newGoal, targetValue: e?.target?.value })}
              placeholder="Enter target value"
              required
            />
            
            <Input
              label={t?.deadline}
              type="date"
              value={newGoal?.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e?.target?.value })}
              required
            />
            
            <Select
              label={t?.priority}
              options={priorityOptions}
              value={newGoal?.priority}
              onChange={(value) => setNewGoal({ ...newGoal, priority: value })}
            />
          </div>
          
          <Input
            label={t?.description}
            type="text"
            value={newGoal?.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e?.target?.value })}
            placeholder="Enter goal description"
            className="mt-4"
          />
          
          <div className="flex items-center space-x-2 mt-4">
            <Button
              variant="default"
              size="sm"
              onClick={handleAddGoal}
              className="micro-scale"
            >
              {t?.save}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddGoal(false)}
              className="micro-scale"
            >
              {t?.cancel}
            </Button>
          </div>
        </div>
      )}
      {/* Active Goals */}
      <div className="mb-8">
        <h4 className="text-md font-heading font-medium text-foreground mb-4 flex items-center">
          <Icon name="Target" size={18} className="mr-2 text-primary" />
          {t?.activeGoals} ({activeGoals?.length})
        </h4>
        
        {activeGoals?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Target" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No active goals yet. Add your first goal to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals?.map((goal) => {
              const progressPercentage = getProgressPercentage(goal);
              const daysLeft = getDaysLeft(goal?.deadline);
              
              return (
                <div key={goal?.id} className="bg-muted rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center`}>
                        <Icon name={getCategoryIcon(goal?.category)} size={20} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground mb-1">{goal?.title}</h5>
                        {goal?.description && (
                          <p className="text-sm text-muted-foreground mb-2">{goal?.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`font-medium ${getPriorityColor(goal?.priority)}`}>
                            {t?.[goal?.priority]} {t?.priority?.toLowerCase()}
                          </span>
                          <span className="text-muted-foreground">
                            {daysLeft > 0 ? `${daysLeft} ${t?.daysLeft}` : t?.overdue}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Check"
                        onClick={() => handleCompleteGoal(goal?.id)}
                        className="micro-scale"
                        title={t?.complete}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => handleDeleteGoal(goal?.id)}
                        className="micro-scale text-error hover:text-error"
                        title={t?.delete}
                      />
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t?.progress}</span>
                      <span className="font-medium text-foreground">
                        {goal?.currentValue} / {goal?.targetValue} ({Math.round(progressPercentage)}%)
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Completed Goals */}
      {completedGoals?.length > 0 && (
        <div>
          <h4 className="text-md font-heading font-medium text-foreground mb-4 flex items-center">
            <Icon name="CheckCircle" size={18} className="mr-2 text-success" />
            {t?.completedGoals} ({completedGoals?.length})
          </h4>
          
          <div className="space-y-3">
            {completedGoals?.map((goal) => (
              <div key={goal?.id} className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <Icon name="Check" size={16} color="white" />
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground">{goal?.title}</h5>
                      <p className="text-sm text-success">{t?.completed}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-success">100%</p>
                    <p className="text-xs text-muted-foreground">
                      {goal?.targetValue} / {goal?.targetValue}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalSetting;