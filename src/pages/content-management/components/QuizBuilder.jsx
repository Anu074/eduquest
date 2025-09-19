import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { db, auth } from '../../../firebase/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { signInWithCustomToken, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

// Use global variables provided by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const QuizBuilder = ({ onSaveQuiz, onCancel }) => {
  const [quizData, setQuizData] = useState({
    title: '',
    subject: '',
    grade: '',
    language: 'English',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 1
  });

  const [activeTab, setActiveTab] = useState('details');
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ text: '', type: '' });

  // Handle Firebase authentication on component mount
  useEffect(() => {
    const authenticate = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase authentication failed:", error);
      }
    };
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsAuthReady(true);
      } else {
        setUserId(null);
        setIsAuthReady(true);
        authenticate();
      }
    });
    return () => unsubscribe();
  }, []);

  const showAlert = (message, type) => {
    setAlertMessage({ text: message, type });
    setTimeout(() => setAlertMessage({ text: '', type: '' }), 5000);
  };

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice', icon: 'CheckCircle' },
    { value: 'true-false', label: 'True/False', icon: 'ToggleLeft' },
    { value: 'fill-blank', label: 'Fill in the Blank', icon: 'Edit3' },
    { value: 'short-answer', label: 'Short Answer', icon: 'MessageSquare' }
  ];

  const subjects = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 
    'Geography', 'History', 'Physics', 'Chemistry', 'Biology'
  ];

  const grades = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
  ];

  const handleQuizDataChange = (field, value) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion?.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addQuestion = () => {
    if (!currentQuestion?.question?.trim()) return;

    const newQuestion = { ...currentQuestion, id: Date.now() };
    
    if (editingQuestionIndex >= 0) {
      const updatedQuestions = [...quizData?.questions];
      updatedQuestions[editingQuestionIndex] = newQuestion;
      setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
      setEditingQuestionIndex(-1);
    } else {
      setQuizData(prev => ({ 
        ...prev, 
        questions: [...prev?.questions, newQuestion] 
      }));
    }

    // Reset current question
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    });
  };

  const editQuestion = (index) => {
    setCurrentQuestion(quizData?.questions?.[index]);
    setEditingQuestionIndex(index);
    setActiveTab('questions');
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = quizData?.questions?.filter((_, i) => i !== index);
    setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const moveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= quizData?.questions?.length) return;

    const updatedQuestions = [...quizData?.questions];
    [updatedQuestions[index], updatedQuestions[newIndex]] = 
    [updatedQuestions?.[newIndex], updatedQuestions?.[index]];
    
    setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSave = async () => {
    if (!isAuthReady || !userId) {
      showAlert('Authentication is not ready. Please wait.', 'warning');
      return;
    }
    
    if (!quizData?.title?.trim() || quizData?.questions?.length === 0) {
      showAlert('Please provide a title and at least one question.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const quizRef = await addDoc(collection(db, `artifacts/${appId}/users/${userId}/quizzes`), {
        ...quizData,
        authorId: userId,
        createdAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });
      console.log('Quiz saved with ID:', quizRef.id);
      showAlert('Quiz saved successfully!', 'success');
      onSaveQuiz(quizData);
    } catch (error) {
      console.error('Error saving quiz:', error);
      showAlert('Error saving quiz: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionForm = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Question Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {questionTypes?.map((type) => (
                <Button
                  key={type?.value}
                  variant={currentQuestion?.type === type?.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleQuestionChange('type', type?.value)}
                  className="justify-start"
                >
                  <Icon name={type?.icon} size={16} className="mr-2" />
                  {type?.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Input
              label="Points"
              type="number"
              value={currentQuestion?.points}
              onChange={(e) => handleQuestionChange('points', parseInt(e?.target?.value) || 1)}
              min="1"
              max="10"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Question Text
          </label>
          <textarea
            value={currentQuestion?.question}
            onChange={(e) => handleQuestionChange('question', e?.target?.value)}
            placeholder="Enter your question here..."
            className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>
        {currentQuestion?.type === 'multiple-choice' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Answer Options
            </label>
            <div className="space-y-3">
              {currentQuestion?.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={currentQuestion?.correctAnswer === index}
                    onChange={() => handleQuestionChange('correctAnswer', index)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e?.target?.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {currentQuestion?.type === 'true-false' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Correct Answer
            </label>
            <div className="flex space-x-4">
              <Button
                variant={currentQuestion?.correctAnswer === 0 ? 'default' : 'outline'}
                onClick={() => handleQuestionChange('correctAnswer', 0)}
              >
                True
              </Button>
              <Button
                variant={currentQuestion?.correctAnswer === 1 ? 'default' : 'outline'}
                onClick={() => handleQuestionChange('correctAnswer', 1)}
              >
                False
              </Button>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Explanation (Optional)
          </label>
          <textarea
            value={currentQuestion?.explanation}
            onChange={(e) => handleQuestionChange('explanation', e?.target?.value)}
            placeholder="Explain why this is the correct answer..."
            className="w-full h-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setCurrentQuestion({
            type: 'multiple-choice',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
            points: 1
          })}>
            Clear
          </Button>
          <Button onClick={addQuestion}>
            {editingQuestionIndex >= 0 ? 'Update Question' : 'Add Question'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Quiz Builder</h2>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Icon name="Save" size={16} className="mr-2" />
              {loading ? 'Saving...' : 'Save Quiz'}
            </Button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Quiz Details
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'questions' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Questions ({quizData?.questions?.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'preview' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Preview
          </button>
        </div>
      </div>
      {/* Alert Message */}
      {alertMessage.text && (
        <div className={`m-6 p-4 rounded-lg text-sm ${
          alertMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {alertMessage.text}
        </div>
      )}
      {/* Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Quiz Title"
                value={quizData?.title}
                onChange={(e) => handleQuizDataChange('title', e?.target?.value)}
                placeholder="Enter quiz title"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <select
                  value={quizData?.subject}
                  onChange={(e) => handleQuizDataChange('subject', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects?.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Grade Level
                </label>
                <select
                  value={quizData?.grade}
                  onChange={(e) => handleQuizDataChange('grade', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Grade</option>
                  {grades?.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Language
                </label>
                <select
                  value={quizData?.language}
                  onChange={(e) => handleQuizDataChange('language', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              
              <Input
                label="Time Limit (minutes)"
                type="number"
                value={quizData?.timeLimit}
                onChange={(e) => handleQuizDataChange('timeLimit', parseInt(e?.target?.value) || 30)}
                min="5"
                max="180"
              />
              
              <Input
                label="Passing Score (%)"
                type="number"
                value={quizData?.passingScore}
                onChange={(e) => handleQuizDataChange('passingScore', parseInt(e?.target?.value) || 70)}
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={quizData?.description}
                onChange={(e) => handleQuizDataChange('description', e?.target?.value)}
                placeholder="Brief description of the quiz..."
                className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-8">
            {/* Existing Questions */}
            {quizData?.questions?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Questions</h3>
                {quizData?.questions?.map((question, index) => (
                  <div key={question?.id} className="bg-muted rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-primary">Q{index + 1}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {question?.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {question?.points} point{question?.points !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-foreground mb-2">{question?.question}</p>
                        {question?.type === 'multiple-choice' && (
                          <div className="space-y-1">
                            {question?.options?.map((option, optIndex) => (
                              <div key={optIndex} className={`text-sm ${
                                optIndex === question?.correctAnswer 
                                  ? 'text-success font-medium' :'text-muted-foreground'
                              }`}>
                                {optIndex === question?.correctAnswer && '✓ '}{option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                        >
                          <Icon name="ChevronUp" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === quizData?.questions?.length - 1}
                        >
                          <Icon name="ChevronDown" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editQuestion(index)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuestion(index)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Question */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {editingQuestionIndex >= 0 ? 'Edit Question' : 'Add New Question'}
              </h3>
              {renderQuestionForm()}
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">{quizData?.title}</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div>Subject: {quizData?.subject}</div>
                <div>Grade: {quizData?.grade}</div>
                <div>Time: {quizData?.timeLimit} min</div>
                <div>Pass: {quizData?.passingScore}%</div>
              </div>
              {quizData?.description && (
                <p className="text-muted-foreground mt-4">{quizData?.description}</p>
              )}
            </div>

            {quizData?.questions?.map((question, index) => (
              <div key={question?.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-semibold text-foreground">Q{index + 1}.</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {question?.points} point{question?.points !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-foreground mb-4">{question?.question}</p>
                
                {question?.type === 'multiple-choice' && (
                  <div className="space-y-2">
                    {question?.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`preview-q${index}`}
                          disabled
                          className="w-4 h-4"
                        />
                        <span className="text-foreground">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question?.explanation && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Explanation:</strong> {question?.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {quizData?.questions?.length === 0 && (
              <div className="text-center py-12">
                <Icon name="FileQuestion" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No questions added yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBuilder;
