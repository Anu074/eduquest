import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ClassAnalytics = ({ analyticsData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const metricOptions = [
    { value: 'engagement', label: 'Engagement' },
    { value: 'performance', label: 'Performance' },
    { value: 'completion', label: 'Completion Rate' }
  ];

  const progressData = [
    { subject: 'Mathematics', completed: 85, pending: 15 },
    { subject: 'Science', completed: 78, pending: 22 },
    { subject: 'English', completed: 92, pending: 8 },
    { subject: 'History', completed: 67, pending: 33 },
    { subject: 'Geography', completed: 74, pending: 26 }
  ];

  const engagementData = [
    { day: 'Mon', active: 24, total: 30 },
    { day: 'Tue', active: 28, total: 30 },
    { day: 'Wed', active: 22, total: 30 },
    { day: 'Thu', active: 26, total: 30 },
    { day: 'Fri', active: 29, total: 30 },
    { day: 'Sat', active: 18, total: 30 },
    { day: 'Sun', active: 15, total: 30 }
  ];

  const performanceDistribution = [
    { name: 'Excellent (80-100%)', value: 8, color: '#10B981' },
    { name: 'Good (60-79%)', value: 15, color: '#2563EB' },
    { name: 'Average (40-59%)', value: 5, color: '#F59E0B' },
    { name: 'Needs Help (<40%)', value: 2, color: '#EF4444' }
  ];

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'engagement': return 'Users';
      case 'performance': return 'TrendingUp';
      case 'completion': return 'CheckCircle';
      default: return 'BarChart3';
    }
  };

  const getMetricColor = (value, type) => {
    if (type === 'engagement') {
      return value >= 80 ? 'text-success' : value >= 60 ? 'text-primary' : 'text-warning';
    }
    if (type === 'performance') {
      return value >= 75 ? 'text-success' : value >= 60 ? 'text-primary' : 'text-warning';
    }
    return value >= 85 ? 'text-success' : value >= 70 ? 'text-primary' : 'text-warning';
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Class Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Overview of class performance and engagement metrics
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              className="w-full sm:w-40"
            />
            <Select
              options={metricOptions}
              value={selectedMetric}
              onChange={setSelectedMetric}
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-caption text-muted-foreground">Class Average</p>
              <p className="text-2xl font-heading font-bold text-foreground">78.5%</p>
              <p className="text-xs text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={12} className="mr-1" />
                +5.2% from last week
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-caption text-muted-foreground">Active Students</p>
              <p className="text-2xl font-heading font-bold text-foreground">26/30</p>
              <p className="text-xs text-success flex items-center mt-1">
                <Icon name="Users" size={12} className="mr-1" />
                87% engagement rate
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-caption text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-heading font-bold text-foreground">82%</p>
              <p className="text-xs text-warning flex items-center mt-1">
                <Icon name="Clock" size={12} className="mr-1" />
                3 assignments pending
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-caption text-muted-foreground">Need Attention</p>
              <p className="text-2xl font-heading font-bold text-foreground">4</p>
              <p className="text-xs text-error flex items-center mt-1">
                <Icon name="AlertTriangle" size={12} className="mr-1" />
                Below 60% performance
              </p>
            </div>
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-error" />
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Progress Chart */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-heading font-semibold text-foreground">Subject Progress</h4>
            <Button variant="ghost" size="sm" iconName="Download" className="micro-scale">
              Export
            </Button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="subject" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="var(--color-muted)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-heading font-semibold text-foreground">Performance Distribution</h4>
            <Button variant="ghost" size="sm" iconName="Info" className="micro-scale">
              Details
            </Button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {performanceDistribution?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-xs text-muted-foreground truncate">{item?.name}</span>
                <span className="text-xs font-mono text-foreground ml-auto">{item?.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Weekly Engagement Trend */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-heading font-semibold text-foreground">Weekly Engagement Trend</h4>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span>Active Students</span>
            </div>
            <Button variant="ghost" size="sm" iconName="Calendar" className="micro-scale">
              View Calendar
            </Button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="day" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 30]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ClassAnalytics;