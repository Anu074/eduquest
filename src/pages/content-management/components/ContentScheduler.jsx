import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContentScheduler = ({ onScheduleContent, onClose }) => {
  const [scheduleData, setScheduleData] = useState({
    contentId: '',
    title: '',
    releaseDate: '',
    releaseTime: '09:00',
    targetGrades: [],
    targetSubjects: [],
    notifyStudents: true,
    notifyTeachers: false,
    autoPublish: true,
    description: ''
  });

  const [selectedContent, setSelectedContent] = useState([]);

  const availableContent = [
    {
      id: 1,
      title: "Introduction to Algebra",
      type: "lesson",
      subject: "Mathematics",
      grade: "Class 8",
      status: "ready"
    },
    {
      id: 2,
      title: "Science Quiz - Chapter 5",
      type: "quiz",
      subject: "Science",
      grade: "Class 7",
      status: "ready"
    },
    {
      id: 3,
      title: "English Grammar Video",
      type: "video",
      subject: "English",
      grade: "Class 6",
      status: "ready"
    },
    {
      id: 4,
      title: "History Audio Lesson",
      type: "audio",
      subject: "History",
      grade: "Class 9",
      status: "ready"
    }
  ];

  const grades = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
  ];

  const subjects = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies',
    'Geography', 'History', 'Physics', 'Chemistry', 'Biology'
  ];

  const handleDataChange = (field, value) => {
    setScheduleData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, checked) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev?.[field], value]
        : prev?.[field]?.filter(item => item !== value)
    }));
  };

  const handleContentSelection = (content, checked) => {
    if (checked) {
      setSelectedContent(prev => [...prev, content]);
    } else {
      setSelectedContent(prev => prev?.filter(item => item?.id !== content?.id));
    }
  };

  const handleSchedule = () => {
    if (selectedContent?.length === 0) {
      alert('Please select at least one content item to schedule');
      return;
    }

    if (!scheduleData?.releaseDate) {
      alert('Please select a release date');
      return;
    }

    const scheduleInfo = {
      ...scheduleData,
      content: selectedContent,
      scheduledAt: new Date()?.toISOString()
    };

    onScheduleContent(scheduleInfo);
  };

  const getTypeIcon = (type) => {
    const icons = {
      lesson: 'BookOpen',
      video: 'Play',
      quiz: 'FileText',
      audio: 'Volume2'
    };
    return icons?.[type] || 'File';
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    return new Date(`${date}T${time}`)?.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Schedule Content Release</h2>
          <Button variant="ghost" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* Content Selection */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Select Content to Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableContent?.map((content) => (
              <div key={content?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedContent?.some(item => item?.id === content?.id)}
                    onChange={(e) => handleContentSelection(content, e?.target?.checked)}
                    className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name={getTypeIcon(content?.type)} size={16} className="text-primary" />
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {content?.type}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">{content?.title}</h4>
                    <div className="text-sm text-muted-foreground">
                      {content?.subject} • {content?.grade}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Input
              label="Release Date"
              type="date"
              value={scheduleData?.releaseDate}
              onChange={(e) => handleDataChange('releaseDate', e?.target?.value)}
              min={new Date()?.toISOString()?.split('T')?.[0]}
              required
            />
          </div>
          
          <div>
            <Input
              label="Release Time"
              type="time"
              value={scheduleData?.releaseTime}
              onChange={(e) => handleDataChange('releaseTime', e?.target?.value)}
            />
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Target Audience</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Target Grades
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {grades?.map((grade) => (
                  <label key={grade} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={scheduleData?.targetGrades?.includes(grade)}
                      onChange={(e) => handleArrayChange('targetGrades', grade, e?.target?.checked)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="text-foreground">{grade}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Target Subjects
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {subjects?.map((subject) => (
                  <label key={subject} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={scheduleData?.targetSubjects?.includes(subject)}
                      onChange={(e) => handleArrayChange('targetSubjects', subject, e?.target?.checked)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="text-foreground">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={scheduleData?.notifyStudents}
                onChange={(e) => handleDataChange('notifyStudents', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <div>
                <span className="text-foreground font-medium">Notify Students</span>
                <p className="text-sm text-muted-foreground">Send notification when content is released</p>
              </div>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={scheduleData?.notifyTeachers}
                onChange={(e) => handleDataChange('notifyTeachers', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <div>
                <span className="text-foreground font-medium">Notify Teachers</span>
                <p className="text-sm text-muted-foreground">Inform other teachers about the release</p>
              </div>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={scheduleData?.autoPublish}
                onChange={(e) => handleDataChange('autoPublish', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <div>
                <span className="text-foreground font-medium">Auto Publish</span>
                <p className="text-sm text-muted-foreground">Automatically make content available at scheduled time</p>
              </div>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Release Description (Optional)
          </label>
          <textarea
            value={scheduleData?.description}
            onChange={(e) => handleDataChange('description', e?.target?.value)}
            placeholder="Add a description for this content release..."
            className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Preview */}
        {selectedContent?.length > 0 && scheduleData?.releaseDate && (
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">Schedule Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                <span className="text-foreground">
                  Release: {formatDateTime(scheduleData?.releaseDate, scheduleData?.releaseTime)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-primary" />
                <span className="text-foreground">
                  {selectedContent?.length} content item{selectedContent?.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              {scheduleData?.targetGrades?.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} className="text-primary" />
                  <span className="text-foreground">
                    Target: {scheduleData?.targetGrades?.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>
            <Icon name="Clock" size={16} className="mr-2" />
            Schedule Release
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentScheduler;