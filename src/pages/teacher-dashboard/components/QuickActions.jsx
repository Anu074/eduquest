import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickActions = ({ onActionComplete }) => {
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    description: ''
  });
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    message: '',
    priority: 'normal',
    sendSMS: false
  });

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const quickActionItems = [
    {
      id: 'assignment',
      title: 'Create Assignment',
      description: 'Assign homework or projects to students',
      icon: 'FileText',
      color: 'bg-primary/10 text-primary',
      action: () => setShowAssignmentModal(true)
    },
    {
      id: 'announcement',
      title: 'Send Announcement',
      description: 'Broadcast message to students and parents',
      icon: 'Megaphone',
      color: 'bg-accent/10 text-accent',
      action: () => setShowAnnouncementModal(true)
    },
    {
      id: 'attendance',
      title: 'Mark Attendance',
      description: 'Record daily student attendance',
      icon: 'UserCheck',
      color: 'bg-success/10 text-success',
      action: () => onActionComplete('attendance')
    },
    {
      id: 'quiz',
      title: 'Create Quiz',
      description: 'Design assessment for students',
      icon: 'HelpCircle',
      color: 'bg-secondary/10 text-secondary',
      action: () => onActionComplete('quiz')
    },
    {
      id: 'report',
      title: 'Generate Report',
      description: 'Export student progress reports',
      icon: 'FileBarChart',
      color: 'bg-warning/10 text-warning',
      action: () => onActionComplete('report')
    },
    {
      id: 'parent-contact',
      title: 'Contact Parents',
      description: 'Send updates via SMS/WhatsApp',
      icon: 'Phone',
      color: 'bg-error/10 text-error',
      action: () => onActionComplete('parent-contact')
    }
  ];

  const handleAssignmentSubmit = (e) => {
    e?.preventDefault();
    console.log('Assignment created:', assignmentData);
    onActionComplete('assignment', assignmentData);
    setShowAssignmentModal(false);
    setAssignmentData({ title: '', subject: '', dueDate: '', description: '' });
  };

  const handleAnnouncementSubmit = (e) => {
    e?.preventDefault();
    console.log('Announcement sent:', announcementData);
    onActionComplete('announcement', announcementData);
    setShowAnnouncementModal(false);
    setAnnouncementData({ title: '', message: '', priority: 'normal', sendSMS: false });
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">Quick Actions</h3>
          <Button variant="ghost" size="sm" iconName="Settings" className="micro-scale">
            Customize
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActionItems?.map((item) => (
            <button
              key={item?.id}
              onClick={item?.action}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 text-left group hover:shadow-md micro-scale"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item?.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon name={item?.icon} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {item?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item?.description}
                  </p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Recent Actions */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <h4 className="text-base font-heading font-semibold text-foreground mb-4">Recent Actions</h4>
        
        <div className="space-y-3">
          {[
            {
              action: 'Created assignment "Algebra Practice"',
              time: '2 hours ago',
              icon: 'FileText',
              color: 'text-primary'
            },
            {
              action: 'Sent announcement about exam schedule',
              time: '5 hours ago',
              icon: 'Megaphone',
              color: 'text-accent'
            },
            {
              action: 'Marked attendance for Grade 8A',
              time: '1 day ago',
              icon: 'UserCheck',
              color: 'text-success'
            },
            {
              action: 'Generated progress report for 15 students',
              time: '2 days ago',
              icon: 'FileBarChart',
              color: 'text-warning'
            }
          ]?.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Icon name={item?.icon} size={16} className={item?.color} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{item?.action}</p>
                <p className="text-xs text-muted-foreground">{item?.time}</p>
              </div>
              <Button variant="ghost" size="sm" iconName="MoreHorizontal" className="micro-scale" />
            </div>
          ))}
        </div>
      </div>
      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-semibold text-foreground">Create Assignment</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => setShowAssignmentModal(false)}
                  className="micro-scale"
                />
              </div>
              
              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <Input
                  label="Assignment Title"
                  type="text"
                  placeholder="Enter assignment title"
                  value={assignmentData?.title}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, title: e?.target?.value }))}
                  required
                />
                
                <Select
                  label="Subject"
                  options={subjectOptions}
                  value={assignmentData?.subject}
                  onChange={(value) => setAssignmentData(prev => ({ ...prev, subject: value }))}
                  placeholder="Select subject"
                  required
                />
                
                <Input
                  label="Due Date"
                  type="date"
                  value={assignmentData?.dueDate}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, dueDate: e?.target?.value }))}
                  required
                />
                
                <Input
                  label="Description"
                  type="text"
                  placeholder="Assignment instructions and details"
                  value={assignmentData?.description}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, description: e?.target?.value }))}
                />
                
                <div className="flex items-center space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Assignment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAssignmentModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-semibold text-foreground">Send Announcement</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="micro-scale"
                />
              </div>
              
              <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                <Input
                  label="Announcement Title"
                  type="text"
                  placeholder="Enter announcement title"
                  value={announcementData?.title}
                  onChange={(e) => setAnnouncementData(prev => ({ ...prev, title: e?.target?.value }))}
                  required
                />
                
                <Input
                  label="Message"
                  type="text"
                  placeholder="Type your announcement message"
                  value={announcementData?.message}
                  onChange={(e) => setAnnouncementData(prev => ({ ...prev, message: e?.target?.value }))}
                  required
                />
                
                <Select
                  label="Priority Level"
                  options={priorityOptions}
                  value={announcementData?.priority}
                  onChange={(value) => setAnnouncementData(prev => ({ ...prev, priority: value }))}
                />
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sendSMS"
                    checked={announcementData?.sendSMS}
                    onChange={(e) => setAnnouncementData(prev => ({ ...prev, sendSMS: e?.target?.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="sendSMS" className="text-sm text-foreground">
                    Also send via SMS to parents
                  </label>
                </div>
                
                <div className="flex items-center space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Send Announcement
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAnnouncementModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;