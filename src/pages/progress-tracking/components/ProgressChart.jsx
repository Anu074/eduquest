import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProgressChart = ({ selectedSubject, chartType, className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

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
      completion: 'Completion Rate',
      performance: 'Performance',
      progress: 'Progress Over Time',
      mastered: 'Mastered',
      learning: 'Learning',
      needsWork: 'Needs Work',
      score: 'Score',
      week: 'Week',
      month: 'Month'
    },
    hi: {
      completion: 'पूर्णता दर',
      performance: 'प्रदर्शन',
      progress: 'समय के साथ प्रगति',
      mastered: 'महारत हासिल',
      learning: 'सीख रहे हैं',
      needsWork: 'सुधार की जरूरत',
      score: 'स्कोर',
      week: 'सप्ताह',
      month: 'महीना'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  // Mock data for different subjects
  const subjectData = {
    mathematics: [
      { name: 'Algebra', completed: 85, total: 100, mastered: 70, learning: 15, needsWork: 15 },
      { name: 'Geometry', completed: 92, total: 100, mastered: 80, learning: 12, needsWork: 8 },
      { name: 'Statistics', completed: 78, total: 100, mastered: 60, learning: 18, needsWork: 22 },
      { name: 'Calculus', completed: 65, total: 100, mastered: 45, learning: 20, needsWork: 35 }
    ],
    science: [
      { name: 'Physics', completed: 88, total: 100, mastered: 75, learning: 13, needsWork: 12 },
      { name: 'Chemistry', completed: 82, total: 100, mastered: 68, learning: 14, needsWork: 18 },
      { name: 'Biology', completed: 95, total: 100, mastered: 85, learning: 10, needsWork: 5 },
      { name: 'Earth Science', completed: 73, total: 100, mastered: 55, learning: 18, needsWork: 27 }
    ],
    english: [
      { name: 'Grammar', completed: 90, total: 100, mastered: 78, learning: 12, needsWork: 10 },
      { name: 'Literature', completed: 85, total: 100, mastered: 70, learning: 15, needsWork: 15 },
      { name: 'Writing', completed: 76, total: 100, mastered: 58, learning: 18, needsWork: 24 },
      { name: 'Speaking', completed: 88, total: 100, mastered: 72, learning: 16, needsWork: 12 }
    ]
  };

  const progressOverTime = [
    { week: 'Week 1', mathematics: 45, science: 50, english: 48 },
    { week: 'Week 2', mathematics: 52, science: 58, english: 55 },
    { week: 'Week 3', mathematics: 61, science: 65, english: 62 },
    { week: 'Week 4', mathematics: 68, science: 72, english: 69 },
    { week: 'Week 5', mathematics: 75, science: 78, english: 76 },
    { week: 'Week 6', mathematics: 82, science: 85, english: 83 }
  ];

  const currentData = subjectData?.[selectedSubject] || subjectData?.mathematics;

  const COLORS = {
    mastered: '#10B981', // emerald-500
    learning: '#F59E0B', // amber-500
    needsWork: '#EF4444'  // red-500
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'completion':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'performance':
        const pieData = currentData?.map(item => ({
          name: item?.name,
          value: item?.mastered
        }));
        
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.mastered} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'progress':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="week" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey={selectedSubject} 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'completion':
        return t?.completion;
      case 'performance':
        return t?.performance;
      case 'progress':
        return t?.progress;
      default:
        return t?.completion;
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          {getChartTitle()}
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-success" />
          <span className="text-sm font-caption text-muted-foreground">
            {selectedSubject?.charAt(0)?.toUpperCase() + selectedSubject?.slice(1)}
          </span>
        </div>
      </div>
      <div className="w-full h-80">
        {renderChart()}
      </div>
      {/* Legend for performance chart */}
      {chartType === 'performance' && (
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm font-caption text-muted-foreground">{t?.mastered}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-sm font-caption text-muted-foreground">{t?.learning}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-error" />
            <span className="text-sm font-caption text-muted-foreground">{t?.needsWork}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;