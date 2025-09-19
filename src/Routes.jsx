import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Login from './pages/Login';
import ContentManagement from './pages/content-management';
import ProgressTracking from './pages/progress-tracking';
import QuizAssessment from './pages/quiz-assessment';
import LessonContent from './pages/lesson-content';
import StudentDashboard from './pages/student-dashboard';
import TeacherDashboard from './pages/teacher-dashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public route - Login page */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />

            {/* Default route redirects to login */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />

            {/* Teacher-only routes */}
            <Route 
              path="/teacher-dashboard" 
              element={
                <ProtectedRoute requireAuth={true} allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/content-management" 
              element={
                <ProtectedRoute requireAuth={true} allowedRoles={['teacher']}>
                  <ContentManagement />
                </ProtectedRoute>
              } 
            />

            {/* Student-only routes */}
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute requireAuth={true} allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Shared routes - accessible by both students and teachers */}
            <Route 
              path="/progress-tracking" 
              element={
                <ProtectedRoute requireAuth={true} allowedRoles={['student', 'teacher']}>
                  <ProgressTracking />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/quiz-assessment" 
              element={
                <ProtectedRoute requireAuth={true} allowedRoles={['student', 'teacher']}>
                  <QuizAssessment />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/lesson-content" 
              element={
                <ProtectedRoute requireAuth={true} allowedRoles={['student', 'teacher']}>
                  <LessonContent />
                </ProtectedRoute>
              } 
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;