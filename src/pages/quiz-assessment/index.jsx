import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuestionCard from './components/QuestionCard';
import QuizProgress from './components/QuizProgress';
import QuizResults from './components/QuizResults';
import QuizNavigation from './components/QuizNavigation';
import ConnectivityStatus from '../../components/ui/ConnectivityStatus';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const QuizAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [startTime] = useState(Date.now());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Mock quiz data
  const quizData = {
    id: 'math-basics-quiz-1',
    title: currentLanguage === 'hi' ? 'गणित की मूल बातें - प्रश्नोत्तरी 1' : 'Math Basics - Quiz 1',
    subject: currentLanguage === 'hi' ? 'गणित' : 'Mathematics',
    grade: '5th Grade',
    timeLimit: 1800,
    passingScore: 60,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        difficulty: 'easy',
        question: currentLanguage === 'hi' ?'15 + 27 का योग क्या है?' :'What is the sum of 15 + 27?',
        options: [
          { id: 'a', text: '41' },
          { id: 'b', text: '42' },
          { id: 'c', text: '43' },
          { id: 'd', text: '44' }
        ],
        correctAnswer: 'b',
        explanation: currentLanguage === 'hi' ?'15 + 27 = 42। यह सरल जोड़ का प्रश्न है।' :'15 + 27 = 42. This is a simple addition problem.'
      },
      {
        id: 2,
        type: 'true-false',
        difficulty: 'easy',
        question: currentLanguage === 'hi' ?'क्या 8 × 7 = 56 है?' :'Is 8 × 7 = 56?',
        correctAnswer: true,
        explanation: currentLanguage === 'hi' ?'हाँ, 8 × 7 = 56। यह सही गुणा है।' :'Yes, 8 × 7 = 56. This is correct multiplication.'
      },
      {
        id: 3,
        type: 'multiple-choice',
        difficulty: 'medium',
        question: currentLanguage === 'hi' ?'यदि एक पिज्जा को 8 बराबर टुकड़ों में बांटा जाए और आप 3 टुकड़े खाएं, तो आपने कितना हिस्सा खाया?' :'If a pizza is divided into 8 equal slices and you eat 3 slices, what fraction did you eat?',
        options: [
          { id: 'a', text: '3/8' },
          { id: 'b', text: '3/5' },
          { id: 'c', text: '5/8' },
          { id: 'd', text: '1/3' }
        ],
        correctAnswer: 'a',
        explanation: currentLanguage === 'hi' ?'8 में से 3 टुकड़े = 3/8। यह सही भिन्न है।' :'3 out of 8 slices = 3/8. This is the correct fraction.'
      },
      {
        id: 4,
        type: 'text-input',
        difficulty: 'medium',
        question: currentLanguage === 'hi' ?'एक आयत की लंबाई 12 सेमी और चौड़ाई 8 सेमी है। इसका क्षेत्रफल क्या है?' :'A rectangle has a length of 12 cm and width of 8 cm. What is its area?',
        sampleAnswer: currentLanguage === 'hi' ?'क्षेत्रफल = लंबाई × चौड़ाई = 12 × 8 = 96 वर्ग सेमी' :'Area = Length × Width = 12 × 8 = 96 square cm',
        explanation: currentLanguage === 'hi' ?'आयत का क्षेत्रफल = लंबाई × चौड़ाई। यहाँ 12 × 8 = 96 वर्ग सेमी।' :'Area of rectangle = Length × Width. Here 12 × 8 = 96 square cm.'
      },
      {
        id: 5,
        type: 'multiple-choice',
        difficulty: 'hard',
        question: currentLanguage === 'hi' ?'यदि 3x + 5 = 20 है, तो x का मान क्या है?' :'If 3x + 5 = 20, what is the value of x?',
        options: [
          { id: 'a', text: '3' },
          { id: 'b', text: '4' },
          { id: 'c', text: '5' },
          { id: 'd', text: '6' }
        ],
        correctAnswer: 'c',
        explanation: currentLanguage === 'hi' ?'3x + 5 = 20, इसलिए 3x = 15, अतः x = 5।' :'3x + 5 = 20, so 3x = 15, therefore x = 5.'
      }
    ]
  };

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('eduquest-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, isSubmitted, showResults]);

  // Monitor connectivity
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const quizProgress = {
      quizId: quizData?.id,
      currentQuestionIndex,
      answers,
      timeRemaining,
      startTime,
      timestamp: Date.now()
    };
    localStorage.setItem('quiz-progress', JSON.stringify(quizProgress));
  }, [currentQuestionIndex, answers, timeRemaining]);

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData?.questions?.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizData?.questions?.forEach((question, index) => {
      const userAnswer = answers?.[index];
      if (question?.type === 'multiple-choice' || question?.type === 'true-false') {
        if (userAnswer === question?.correctAnswer) {
          correctAnswers++;
        }
      } else if (question?.type === 'text-input' && userAnswer) {
        // For text input, we'll give credit if answer is provided
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    
    // Calculate results
    const score = calculateScore();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const pointsEarned = score * 10 + (timeRemaining > 0 ? 5 : 0);
    
    // Mock badges earned
    const badgesEarned = [];
    if (score === quizData?.questions?.length) {
      badgesEarned?.push({
        name: currentLanguage === 'hi' ? 'परफेक्ट स्कोर' : 'Perfect Score',
        description: currentLanguage === 'hi' ? '100% सही उत्तर' : '100% Correct',
        icon: '🏆'
      });
    }
    if (timeRemaining > 900) {
      badgesEarned?.push({
        name: currentLanguage === 'hi' ? 'तेज़ समाधान' : 'Speed Solver',
        description: currentLanguage === 'hi' ? 'तेज़ी से पूरा किया' : 'Completed quickly',
        icon: '⚡'
      });
    }

    // Save results to localStorage
    const results = {
      quizId: quizData?.id,
      score,
      totalQuestions: quizData?.questions?.length,
      pointsEarned,
      badgesEarned,
      timeSpent,
      answers,
      timestamp: Date.now()
    };
    
    localStorage.setItem('quiz-results', JSON.stringify(results));
    
    // Show results after a brief delay
    setTimeout(() => {
      setShowResults(true);
    }, 1000);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
    setTimeRemaining(quizData?.timeLimit);
    localStorage.removeItem('quiz-progress');
    localStorage.removeItem('quiz-results');
  };

  const currentQuestion = quizData?.questions?.[currentQuestionIndex];
  const canGoNext = answers?.[currentQuestionIndex] !== undefined;
  const canSubmit = Object.keys(answers)?.length === quizData?.questions?.length;

  if (showResults) {
    const savedResults = JSON.parse(localStorage.getItem('quiz-results') || '{}');
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-8 px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <QuizResults
              score={savedResults?.score || 0}
              totalQuestions={savedResults?.totalQuestions || quizData?.questions?.length}
              pointsEarned={savedResults?.pointsEarned || 0}
              badgesEarned={savedResults?.badgesEarned || []}
              timeSpent={savedResults?.timeSpent || 0}
              onRetakeQuiz={handleRetakeQuiz}
              onNextLesson={() => navigate('/lesson-content')}
              onBackToDashboard={() => navigate('/student-dashboard')}
              currentLanguage={currentLanguage}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Quiz Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
                  {quizData?.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="BookOpen" size={16} />
                    <span>{quizData?.subject}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="GraduationCap" size={16} />
                    <span>{quizData?.grade}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="FileText" size={16} />
                    <span>{quizData?.questions?.length} {currentLanguage === 'hi' ? 'प्रश्न' : 'Questions'}</span>
                  </span>
                </div>
              </div>
              
              <ConnectivityStatus 
                position="inline" 
                showLabel={true}
                syncStatus={isOffline ? 'offline' : 'idle'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Progress Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <QuizProgress
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={quizData?.questions?.length}
                timeRemaining={timeRemaining}
                score={calculateScore()}
                isCompleted={isSubmitted}
                currentLanguage={currentLanguage}
              />
              
              {/* Offline Notice */}
              {isOffline && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Icon name="WifiOff" size={18} className="text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-heading font-semibold text-sm mb-1 text-warning">
                        {currentLanguage === 'hi' ? 'ऑफलाइन मोड' : 'Offline Mode'}
                      </h4>
                      <p className="text-xs text-foreground">
                        {currentLanguage === 'hi' ?'आपके उत्तर स्थानीय रूप से सहेजे जा रहे हैं' :'Your answers are being saved locally'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Question Card */}
              <QuestionCard
                question={currentQuestion}
                selectedAnswer={answers?.[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
                showResult={isSubmitted}
                isSubmitted={isSubmitted}
                currentLanguage={currentLanguage}
              />

              {/* Navigation */}
              <QuizNavigation
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={quizData?.questions?.length}
                canGoBack={currentQuestionIndex > 0}
                canGoNext={canGoNext}
                canSubmit={canSubmit}
                isSubmitted={isSubmitted}
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                onSubmit={handleSubmitQuiz}
                onReview={() => setShowResults(true)}
                currentLanguage={currentLanguage}
              />

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  iconName="Save"
                  iconPosition="left"
                  onClick={() => {
                    // Save progress
                    const progress = {
                      quizId: quizData?.id,
                      currentQuestionIndex,
                      answers,
                      timeRemaining,
                      timestamp: Date.now()
                    };
                    localStorage.setItem('quiz-progress', JSON.stringify(progress));
                  }}
                  className="micro-scale"
                >
                  {currentLanguage === 'hi' ? 'प्रगति सहेजें' : 'Save Progress'}
                </Button>
                
                <Button
                  variant="ghost"
                  iconName="ArrowLeft"
                  iconPosition="left"
                  onClick={() => navigate('/lesson-content')}
                  className="micro-scale"
                >
                  {currentLanguage === 'hi' ? 'पाठ पर वापस' : 'Back to Lesson'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizAssessment;