import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CommunicationPanel = ({ students, onMessageSent }) => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [messageData, setMessageData] = useState({
    recipient: 'all',
    subject: '',
    message: '',
    priority: 'normal',
    sendSMS: false,
    sendWhatsApp: false
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: 'Megaphone' },
    { id: 'individual', label: 'Individual Messages', icon: 'MessageCircle' },
    { id: 'parent-contact', label: 'Parent Contact', icon: 'Phone' },
    { id: 'history', label: 'Message History', icon: 'History' }
  ];

  const recipientOptions = [
    { value: 'all', label: 'All Students & Parents' },
    { value: 'students', label: 'Students Only' },
    { value: 'parents', label: 'Parents Only' },
    { value: 'selected', label: 'Selected Recipients' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const messageHistory = [
    {
      id: 1,
      type: 'announcement',
      subject: 'Exam Schedule Update',
      message: 'The mathematics exam has been rescheduled to next Friday. Please prepare accordingly.',
      recipients: 'All Students & Parents',
      sentAt: '2025-01-10 14:30',
      status: 'delivered',
      readCount: 28,
      totalRecipients: 30
    },
    {
      id: 2,
      type: 'individual',
      subject: 'Assignment Reminder',
      message: 'Please submit your science project by tomorrow.',
      recipients: 'Rahul Sharma, Priya Patel',
      sentAt: '2025-01-10 11:15',
      status: 'delivered',
      readCount: 2,
      totalRecipients: 2
    },
    {
      id: 3,
      type: 'parent-contact',
      subject: 'Attendance Alert',
      message: 'Your child has been absent for 3 consecutive days. Please contact the school.',
      recipients: 'Parents of Absent Students',
      sentAt: '2025-01-09 16:45',
      status: 'delivered',
      readCount: 4,
      totalRecipients: 4
    }
  ];

  const filteredStudents = students?.filter(student =>
    student?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    student?.rollNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev?.includes(studentId)) {
        return prev?.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    const messagePayload = {
      ...messageData,
      selectedStudents: messageData?.recipient === 'selected' ? selectedStudents : [],
      timestamp: new Date()?.toISOString(),
      id: Date.now()
    };
    
    onMessageSent(messagePayload);
    
    // Reset form
    setMessageData({
      recipient: 'all',
      subject: '',
      message: '',
      priority: 'normal',
      sendSMS: false,
      sendWhatsApp: false
    });
    setSelectedStudents([]);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error bg-error/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'normal': return 'text-primary bg-primary/10';
      case 'low': return 'text-muted-foreground bg-muted/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-success';
      case 'pending': return 'text-warning';
      case 'failed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground">Communication Center</h3>
        <p className="text-sm text-muted-foreground">
          Send messages and announcements to students and parents
        </p>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-1 p-4">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors micro-scale ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {(activeTab === 'announcements' || activeTab === 'individual' || activeTab === 'parent-contact') && (
          <form onSubmit={handleSendMessage} className="space-y-6">
            {/* Recipient Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Select
                label="Send To"
                options={recipientOptions}
                value={messageData?.recipient}
                onChange={(value) => setMessageData(prev => ({ ...prev, recipient: value }))}
                required
              />
              
              <Select
                label="Priority Level"
                options={priorityOptions}
                value={messageData?.priority}
                onChange={(value) => setMessageData(prev => ({ ...prev, priority: value }))}
              />
            </div>

            {/* Selected Recipients */}
            {messageData?.recipient === 'selected' && (
              <div className="space-y-4">
                <Input
                  type="search"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                />
                
                <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
                  {filteredStudents?.map((student) => (
                    <div key={student?.id} className="flex items-center space-x-3 p-3 hover:bg-muted/50 transition-colors">
                      <input
                        type="checkbox"
                        id={`student-${student?.id}`}
                        checked={selectedStudents?.includes(student?.id)}
                        onChange={() => handleStudentSelection(student?.id)}
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                      />
                      <Image
                        src={student?.avatar}
                        alt={student?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <label htmlFor={`student-${student?.id}`} className="text-sm font-medium text-foreground cursor-pointer">
                          {student?.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {student?.rollNumber} • Grade {student?.grade}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedStudents?.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedStudents?.length} student{selectedStudents?.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            {/* Message Content */}
            <div className="space-y-4">
              <Input
                label="Subject"
                type="text"
                placeholder="Enter message subject"
                value={messageData?.subject}
                onChange={(e) => setMessageData(prev => ({ ...prev, subject: e?.target?.value }))}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  placeholder="Type your message here..."
                  value={messageData?.message}
                  onChange={(e) => setMessageData(prev => ({ ...prev, message: e?.target?.value }))}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Delivery Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Delivery Options</h4>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sendSMS"
                    checked={messageData?.sendSMS}
                    onChange={(e) => setMessageData(prev => ({ ...prev, sendSMS: e?.target?.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="sendSMS" className="text-sm text-foreground flex items-center space-x-1">
                    <Icon name="MessageSquare" size={16} />
                    <span>Send SMS</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sendWhatsApp"
                    checked={messageData?.sendWhatsApp}
                    onChange={(e) => setMessageData(prev => ({ ...prev, sendWhatsApp: e?.target?.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="sendWhatsApp" className="text-sm text-foreground flex items-center space-x-1">
                    <Icon name="Phone" size={16} />
                    <span>Send WhatsApp</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-4">
              <Button type="submit" className="flex-1 sm:flex-none">
                <Icon name="Send" size={16} className="mr-2" />
                Send Message
              </Button>
              <Button type="button" variant="outline">
                Save Draft
              </Button>
            </div>
          </form>
        )}

        {/* Message History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-heading font-semibold text-foreground">Recent Messages</h4>
              <Button variant="outline" size="sm" iconName="Download" className="micro-scale">
                Export History
              </Button>
            </div>
            
            <div className="space-y-3">
              {messageHistory?.map((message) => (
                <div key={message?.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground">{message?.subject}</h5>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message?.type)}`}>
                          {message?.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message?.message}</p>
                    </div>
                    <Icon name={getStatusColor(message?.status) === 'text-success' ? 'CheckCircle' : 'Clock'} 
                          size={16} 
                          className={getStatusColor(message?.status)} />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>To: {message?.recipients}</span>
                    <span>{message?.sentAt}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      Read by {message?.readCount}/{message?.totalRecipients} recipients
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="Eye" className="micro-scale">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" iconName="Copy" className="micro-scale">
                        Resend
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationPanel;