import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AttendanceTracker = ({ students, onAttendanceUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBulkActions, setShowBulkActions] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Students' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' }
  ];

  const attendanceStats = {
    total: students?.length,
    present: Object.values(attendanceData)?.filter(status => status === 'present')?.length,
    absent: Object.values(attendanceData)?.filter(status => status === 'absent')?.length,
    late: Object.values(attendanceData)?.filter(status => status === 'late')?.length,
    excused: Object.values(attendanceData)?.filter(status => status === 'excused')?.length
  };

  const filteredStudents = students?.filter(student => {
    const matchesSearch = student?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         student?.rollNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || attendanceData?.[student?.id] === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleBulkAction = (status) => {
    const newAttendanceData = { ...attendanceData };
    filteredStudents?.forEach(student => {
      newAttendanceData[student.id] = status;
    });
    setAttendanceData(newAttendanceData);
    setShowBulkActions(false);
  };

  const handleSaveAttendance = () => {
    const attendanceRecord = {
      date: selectedDate,
      attendance: attendanceData,
      stats: attendanceStats
    };
    onAttendanceUpdate(attendanceRecord);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-success bg-success/10';
      case 'absent': return 'text-error bg-error/10';
      case 'late': return 'text-warning bg-warning/10';
      case 'excused': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return 'CheckCircle';
      case 'absent': return 'XCircle';
      case 'late': return 'Clock';
      case 'excused': return 'Shield';
      default: return 'Circle';
    }
  };

  const attendancePercentage = attendanceStats?.total > 0 
    ? Math.round((attendanceStats?.present / attendanceStats?.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Attendance Header */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Attendance Tracker</h3>
            <p className="text-sm text-muted-foreground">
              Mark and track daily student attendance
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e?.target?.value)}
              className="w-full sm:w-40"
            />
            <Button
              variant="outline"
              iconName="Download"
              onClick={() => console.log('Export attendance')}
              className="micro-scale"
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Attendance Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card rounded-lg border border-border shadow-sm p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{attendanceStats?.total}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{attendanceStats?.present}</p>
            <p className="text-xs text-muted-foreground">Present</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="XCircle" size={24} className="text-error" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{attendanceStats?.absent}</p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Clock" size={24} className="text-warning" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{attendanceStats?.late}</p>
            <p className="text-xs text-muted-foreground">Late</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Target" size={24} className="text-accent" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{attendancePercentage}%</p>
            <p className="text-xs text-muted-foreground">Attendance Rate</p>
          </div>
        </div>
      </div>
      {/* Attendance Controls */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="search"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-full sm:w-40"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button
                variant="outline"
                iconName="Users"
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="micro-scale"
              >
                Bulk Actions
              </Button>
              
              {showBulkActions && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleBulkAction('present')}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center space-x-2"
                    >
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span>Mark All Present</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('absent')}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center space-x-2"
                    >
                      <Icon name="XCircle" size={16} className="text-error" />
                      <span>Mark All Absent</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="default"
              iconName="Save"
              onClick={handleSaveAttendance}
              disabled={Object.keys(attendanceData)?.length === 0}
              className="micro-scale"
            >
              Save Attendance
            </Button>
          </div>
        </div>

        {/* Student Attendance List */}
        <div className="space-y-2">
          {filteredStudents?.map((student) => {
            const currentStatus = attendanceData?.[student?.id] || 'unmarked';
            return (
              <div key={student?.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <Image
                    src={student?.avatar}
                    alt={student?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-foreground">{student?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {student?.rollNumber} • Grade {student?.grade}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {currentStatus !== 'unmarked' && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
                      <Icon name={getStatusIcon(currentStatus)} size={12} className="mr-1" />
                      {currentStatus}
                    </span>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={currentStatus === 'present' ? 'default' : 'ghost'}
                      size="sm"
                      iconName="CheckCircle"
                      onClick={() => handleAttendanceChange(student?.id, 'present')}
                      className="micro-scale"
                      title="Mark Present"
                    />
                    <Button
                      variant={currentStatus === 'absent' ? 'destructive' : 'ghost'}
                      size="sm"
                      iconName="XCircle"
                      onClick={() => handleAttendanceChange(student?.id, 'absent')}
                      className="micro-scale"
                      title="Mark Absent"
                    />
                    <Button
                      variant={currentStatus === 'late' ? 'warning' : 'ghost'}
                      size="sm"
                      iconName="Clock"
                      onClick={() => handleAttendanceChange(student?.id, 'late')}
                      className="micro-scale"
                      title="Mark Late"
                    />
                    <Button
                      variant={currentStatus === 'excused' ? 'secondary' : 'ghost'}
                      size="sm"
                      iconName="Shield"
                      onClick={() => handleAttendanceChange(student?.id, 'excused')}
                      className="micro-scale"
                      title="Mark Excused"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStudents?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No students found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker;