import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StudentOverviewTable = ({ students, onStudentSelect, onViewProgress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterGrade, setFilterGrade] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const gradeOptions = [
    { value: 'all', label: 'All Grades' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' }
  ];

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students?.filter(student => {
      const matchesSearch = student?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           student?.rollNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesGrade = filterGrade === 'all' || student?.grade === filterGrade;
      return matchesSearch && matchesGrade;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];
        
        if (sortConfig?.key === 'completionRate' || sortConfig?.key === 'averageScore') {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }
        
        if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [students, searchTerm, sortConfig, filterGrade]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return filteredAndSortedStudents?.slice(startIndex, startIndex + studentsPerPage);
  }, [filteredAndSortedStudents, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedStudents?.length / studentsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'inactive': return 'text-warning';
      case 'needs-attention': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10';
      case 'inactive': return 'bg-warning/10';
      case 'needs-attention': return 'bg-error/10';
      default: return 'bg-muted/10';
    }
  };

  const getPerformanceIcon = (score) => {
    if (score >= 80) return { name: 'TrendingUp', color: 'text-success' };
    if (score >= 60) return { name: 'Minus', color: 'text-accent' };
    return { name: 'TrendingDown', color: 'text-error' };
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Student Overview</h3>
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedStudents?.length} students found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="search"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            
            <Select
              options={gradeOptions}
              value={filterGrade}
              onChange={setFilterGrade}
              placeholder="Filter by grade"
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Student</span>
                  <Icon 
                    name={sortConfig?.key === 'name' ? 
                      (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 
                      'ChevronsUpDown'
                    } 
                    size={16} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('completionRate')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Progress</span>
                  <Icon 
                    name={sortConfig?.key === 'completionRate' ? 
                      (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 
                      'ChevronsUpDown'
                    } 
                    size={16} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('averageScore')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Performance</span>
                  <Icon 
                    name={sortConfig?.key === 'averageScore' ? 
                      (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 
                      'ChevronsUpDown'
                    } 
                    size={16} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Last Activity</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents?.map((student) => {
              const performanceIcon = getPerformanceIcon(student?.averageScore);
              return (
                <tr key={student?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={student?.avatar}
                        alt={student?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-foreground">{student?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {student?.rollNumber} • Grade {student?.grade}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(student?.status)} ${getStatusColor(student?.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusColor(student?.status)?.replace('text-', 'bg-')}`} />
                      {student?.status?.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student?.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-muted-foreground min-w-[3rem]">
                        {student?.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={performanceIcon?.name} size={16} className={performanceIcon?.color} />
                      <span className="font-mono text-sm">{student?.averageScore}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {student?.lastActivity}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => onViewProgress(student)}
                        className="micro-scale"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MessageSquare"
                        onClick={() => onStudentSelect(student)}
                        className="micro-scale"
                      >
                        Contact
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden">
        {paginatedStudents?.map((student) => {
          const performanceIcon = getPerformanceIcon(student?.averageScore);
          return (
            <div key={student?.id} className="p-4 border-b border-border last:border-b-0">
              <div className="flex items-start space-x-3">
                <Image
                  src={student?.avatar}
                  alt={student?.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground truncate">{student?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {student?.rollNumber} • Grade {student?.grade}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(student?.status)} ${getStatusColor(student?.status)}`}>
                      {student?.status?.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-mono">{student?.completionRate}%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${student?.completionRate}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Performance</span>
                      <div className="flex items-center space-x-1">
                        <Icon name={performanceIcon?.name} size={14} className={performanceIcon?.color} />
                        <span className="font-mono">{student?.averageScore}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Activity</span>
                      <span>{student?.lastActivity}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewProgress(student)}
                      className="flex-1 micro-scale"
                    >
                      View Progress
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MessageSquare"
                      onClick={() => onStudentSelect(student)}
                      className="micro-scale"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, filteredAndSortedStudents?.length)} of {filteredAndSortedStudents?.length} students
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="micro-scale"
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0 micro-scale"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronRight"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="micro-scale"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOverviewTable;