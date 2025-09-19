import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceMetrics = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedMetric, setSelectedMetric] = useState('scores');

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
      performance: 'Performance Metrics',
      quizScores: 'Quiz Scores',
      studyTime: 'Study Time',
      improvement: 'Improvement Trends',
      averageScore: 'Average Score',
      totalTime: 'Total Time',
      hoursStudied: 'Hours Studied',
      improvement_trend: 'Improvement',
      week: 'Week',
      score: 'Score',
      hours: 'hours',
      minutes: 'minutes',
      subjects: 'Subjects',
      mathematics: 'Mathematics',
      science: 'Science',
      english: 'English',
      history: 'History',
      geography: 'Geography'
    },
    hi: {
      performance: 'प्रदर्शन मेट्रिक्स',
      quizScores: 'क्विज़ स्कोर',
      studyTime: 'अध्ययन समय',
      improvement: 'सुधार के रुझान',
      averageScore: 'औसत स्कोर',
      totalTime: 'कुल समय',
      hoursStudied: 'अध्ययन के घंटे',
      improvement_trend: 'सुधार',
      week: 'सप्ताह',
      score: 'स्कोर',
      hours: 'घंटे',
      minutes: 'मिनट',
      subjects: 'विषय',
      mathematics: 'गणित',
      science: 'विज्ञान',
      english: 'अंग्रेजी',
      history: 'इतिहास',
      geography: 'भूगोल'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  // Mock performance data
  const quizScoreData = [
    { week: `${t?.week} 1`, mathematics: 75, science: 80, english: 85, history: 70, geography: 78 },
    { week: `${t?.week} 2`, mathematics: 78, science: 82, english: 87, history: 73, geography: 80 },
    { week: `${t?.week} 3`, mathematics: 82, science: 85, english: 89, history: 76, geography: 82 },
    { week: `${t?.week} 4`, mathematics: 85, science: 88, english: 91, history: 79, geography: 85 },
    { week: `${t?.week} 5`, mathematics: 88, science: 90, english: 93, history: 82, geography: 87 },
    { week: `${t?.week} 6`, mathematics: 90, science: 92, english: 95, history: 85, geography: 89 }
  ];

  const studyTimeData = [
    { week: `${t?.week} 1`, mathematics: 5.5, science: 4.2, english: 3.8, history: 2.5, geography: 2.1 },
    { week: `${t?.week} 2`, mathematics: 6.0, science: 4.5, english: 4.0, history: 2.8, geography: 2.3 },
    { week: `${t?.week} 3`, mathematics: 6.2, science: 4.8, english: 4.2, history: 3.0, geography: 2.5 },
    { week: `${t?.week} 4`, mathematics: 6.5, science: 5.0, english: 4.5, history: 3.2, geography: 2.7 },
    { week: `${t?.week} 5`, mathematics: 6.8, science: 5.2, english: 4.7, history: 3.5, geography: 2.9 },
    { week: `${t?.week} 6`, mathematics: 7.0, science: 5.5, english: 5.0, history: 3.7, geography: 3.1 }
  ];

  const subjectRadarData = [
    { subject: t?.mathematics, current: 90, previous: 75, fullMark: 100 },
    { subject: t?.science, current: 92, previous: 80, fullMark: 100 },
    { subject: t?.english, current: 95, previous: 85, fullMark: 100 },
    { subject: t?.history, current: 85, previous: 70, fullMark: 100 },
    { subject: t?.geography, current: 89, previous: 78, fullMark: 100 }
  ];

  const getCurrentData = () => {
    switch (selectedMetric) {
      case 'scores':
        return quizScoreData;
      case 'time':
        return studyTimeData;
      default:
        return quizScoreData;
    }
  };

  const getAverageScore = () => {
    const latestWeek = quizScoreData?.[quizScoreData?.length - 1];
    const scores = [latestWeek?.mathematics, latestWeek?.science, latestWeek?.english, latestWeek?.history, latestWeek?.geography];
    return Math.round(scores?.reduce((sum, score) => sum + score, 0) / scores?.length);
  };

  const getTotalStudyTime = () => {
    const latestWeek = studyTimeData?.[studyTimeData?.length - 1];
    const totalHours = latestWeek?.mathematics + latestWeek?.science + latestWeek?.english + latestWeek?.history + latestWeek?.geography;
    return totalHours?.toFixed(1);
  };

  const getImprovementTrend = () => {
    const firstWeek = quizScoreData?.[0];
    const lastWeek = quizScoreData?.[quizScoreData?.length - 1];
    const firstAvg = (firstWeek?.mathematics + firstWeek?.science + firstWeek?.english + firstWeek?.history + firstWeek?.geography) / 5;
    const lastAvg = (lastWeek?.mathematics + lastWeek?.science + lastWeek?.english + lastWeek?.history + lastWeek?.geography) / 5;
    return Math.round(lastAvg - firstAvg);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value}${selectedMetric === 'time' ? 'h' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const metricOptions = [
    { id: 'scores', label: t?.quizScores, icon: 'BarChart3' },
    { id: 'time', label: t?.studyTime, icon: 'Clock' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          {t?.performance}
        </h3>
        <div className="flex items-center space-x-2">
          {metricOptions?.map((option) => (
            <button
              key={option?.id}
              onClick={() => setSelectedMetric(option?.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors micro-scale flex items-center space-x-1 ${
                selectedMetric === option?.id
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
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">{getAverageScore()}%</div>
          <div className="text-sm font-caption text-muted-foreground">{t?.averageScore}</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-accent mb-1">{getTotalStudyTime()}h</div>
          <div className="text-sm font-caption text-muted-foreground">{t?.hoursStudied}</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-success mb-1">+{getImprovementTrend()}%</div>
          <div className="text-sm font-caption text-muted-foreground">{t?.improvement_trend}</div>
        </div>
      </div>
      {/* Performance Chart */}
      <div className="mb-6">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getCurrentData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                dataKey="mathematics" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="science" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="english" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="history" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="geography" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Subject Comparison Radar */}
      <div className="border-t border-border pt-6">
        <h4 className="text-md font-heading font-medium text-foreground mb-4 flex items-center">
          <Icon name="Target" size={18} className="mr-2 text-primary" />
          {t?.subjects} Comparison
        </h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={subjectRadarData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Previous"
                dataKey="previous"
                stroke="var(--color-muted-foreground)"
                fill="var(--color-muted-foreground)"
                fillOpacity={0.1}
                strokeWidth={1}
                strokeDasharray="5 5"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Radar Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm font-caption text-muted-foreground">Current Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted-foreground rounded-full opacity-50" />
            <span className="text-sm font-caption text-muted-foreground">Previous Performance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;