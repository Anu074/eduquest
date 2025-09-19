import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ContentAnalytics = ({ contentId, onClose }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  // Mock analytics data
  const overviewStats = [
    { label: 'Total Views', value: 1247, change: '+12%', trend: 'up', icon: 'Eye' },
    { label: 'Downloads', value: 389, change: '+8%', trend: 'up', icon: 'Download' },
    { label: 'Completion Rate', value: '78%', change: '+5%', trend: 'up', icon: 'CheckCircle' },
    { label: 'Avg. Time Spent', value: '12m 34s', change: '-2%', trend: 'down', icon: 'Clock' }
  ];

  const viewsData = [
    { date: '2025-01-05', views: 45, downloads: 12 },
    { date: '2025-01-06', views: 52, downloads: 18 },
    { date: '2025-01-07', views: 38, downloads: 9 },
    { date: '2025-01-08', views: 67, downloads: 23 },
    { date: '2025-01-09', views: 71, downloads: 28 },
    { date: '2025-01-10', views: 59, downloads: 19 },
    { date: '2025-01-11', views: 84, downloads: 31 }
  ];

  const gradeDistribution = [
    { grade: 'Class 5', students: 145, color: '#2563EB' },
    { grade: 'Class 6', students: 189, color: '#059669' },
    { grade: 'Class 7', students: 167, color: '#F59E0B' },
    { grade: 'Class 8', students: 123, color: '#EF4444' },
    { grade: 'Class 9', students: 98, color: '#8B5CF6' }
  ];

  const engagementData = [
    { metric: 'Started', value: 1247, percentage: 100 },
    { metric: 'Completed 25%', value: 1089, percentage: 87 },
    { metric: 'Completed 50%', value: 934, percentage: 75 },
    { metric: 'Completed 75%', value: 823, percentage: 66 },
    { metric: 'Fully Completed', value: 672, percentage: 54 }
  ];

  const topPerformers = [
    { name: 'Rahul Sharma', grade: 'Class 8', score: 95, time: '8m 23s' },
    { name: 'Priya Patel', grade: 'Class 7', score: 92, time: '9m 15s' },
    { name: 'Amit Kumar', grade: 'Class 8', score: 89, time: '7m 45s' },
    { name: 'Sneha Singh', grade: 'Class 7', score: 87, time: '10m 12s' },
    { name: 'Vikash Gupta', grade: 'Class 8', score: 85, time: '8m 56s' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : 'text-warning';
  };

  return (
    <div className="bg-card border border-border rounded-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Content Analytics</h2>
            <p className="text-sm text-muted-foreground mt-1">Introduction to Mathematics</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {timeRanges?.map(range => (
                <option key={range?.value} value={range?.value}>{range?.label}</option>
              ))}
            </select>
            <Button variant="ghost" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8 px-6">
          {['overview', 'engagement', 'performance']?.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats?.map((stat, index) => (
                <div key={index} className="bg-muted rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name={stat?.icon} size={20} className="text-primary" />
                    </div>
                    <div className={`flex items-center text-sm ${getTrendColor(stat?.trend)}`}>
                      <Icon name={getTrendIcon(stat?.trend)} size={14} className="mr-1" />
                      {stat?.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
                    <p className="text-sm text-muted-foreground">{stat?.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Views and Downloads Chart */}
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Views & Downloads Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="var(--color-muted-foreground)"
                    />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--color-popover)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="var(--color-primary)" 
                      strokeWidth={2}
                      name="Views"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="downloads" 
                      stroke="var(--color-secondary)" 
                      strokeWidth={2}
                      name="Downloads"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Student Distribution by Grade</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="students"
                        label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                      >
                        {gradeDistribution?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry?.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {gradeDistribution?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item?.color }}
                        />
                        <span className="text-foreground">{item?.grade}</span>
                      </div>
                      <span className="text-muted-foreground">{item?.students} students</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="space-y-8">
            {/* Engagement Funnel */}
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Content Engagement Funnel</h3>
              <div className="space-y-4">
                {engagementData?.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-medium">{item?.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">{item?.value}</span>
                        <span className="text-sm text-muted-foreground">({item?.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-background rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${item?.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Spent Distribution */}
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Time Spent Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { range: '0-5m', students: 89 },
                    { range: '5-10m', students: 234 },
                    { range: '10-15m', students: 456 },
                    { range: '15-20m', students: 312 },
                    { range: '20m+', students: 156 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="range" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--color-popover)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="students" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Top Performers */}
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Top Performers</h3>
              <div className="space-y-4">
                {topPerformers?.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student?.name}</p>
                        <p className="text-sm text-muted-foreground">{student?.grade}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-success">{student?.score}%</p>
                        <p className="text-muted-foreground">Score</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">{student?.time}</p>
                        <p className="text-muted-foreground">Time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted rounded-lg p-6 text-center">
                <div className="p-3 bg-success/10 rounded-full w-fit mx-auto mb-4">
                  <Icon name="Trophy" size={24} className="text-success" />
                </div>
                <p className="text-2xl font-bold text-foreground">87%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
              
              <div className="bg-muted rounded-lg p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Icon name="Target" size={24} className="text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">78%</p>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
              </div>
              
              <div className="bg-muted rounded-lg p-6 text-center">
                <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-4">
                  <Icon name="Clock" size={24} className="text-accent" />
                </div>
                <p className="text-2xl font-bold text-foreground">12m 34s</p>
                <p className="text-sm text-muted-foreground">Avg. Time</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentAnalytics;