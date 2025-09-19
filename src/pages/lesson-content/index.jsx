import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LessonHeader from './components/LessonHeader';
import LessonProgress from './components/LessonProgress';
import MediaPlayer from './components/MediaPlayer';
import InteractiveContent from './components/InteractiveContent';
import LessonNavigation from './components/LessonNavigation';
import OfflineIndicator from './components/OfflineIndicator';

const LessonContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams?.get('id') || '1';
  
  const [currentSegment, setCurrentSegment] = useState(1);
  const [completedSegments, setCompletedSegments] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [connectionStrength, setConnectionStrength] = useState('high');
  const [lastSyncTime, setLastSyncTime] = useState(new Date()?.toISOString());
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Mock lesson data
  const lessonData = {
    id: lessonId,
    title: "Introduction to Photosynthesis",
    subject: "Biology",
    grade: 8,
    duration: 45,
    estimatedTime: 12,
    difficulty: "Intermediate",
    totalSegments: 5,
    segments: [
      {
        id: 1,
        title: "What is Photosynthesis?",
        type: "text_media",
        content: {
          text: `<h3>Understanding Photosynthesis</h3>
                <p>Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.</p>
                <p>This process is essential for life on Earth as it produces the oxygen we breathe and forms the base of most food chains.</p>`,
          media: {
            type: "video",
            src: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg",
            title: "Photosynthesis Overview",
            description: "A visual explanation of the photosynthesis process",
            sources: {
              low: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
              medium: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
              high: "https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_2mb.mp4"
            },
            subtitles: "/assets/subtitles/photosynthesis-intro.vtt"
          }
        }
      },
      {
        id: 2,
        title: "The Photosynthesis Equation",
        type: "interactive",
        content: {
          text: `<h3>The Chemical Equation</h3>
                <p>Let's explore the chemical equation that represents photosynthesis:</p>
                <p><strong>6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂</strong></p>`,
          image: {
            src: "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg",
            alt: "Photosynthesis diagram showing the process in a leaf",
            hotspots: [
              {
                id: 1,
                x: 25,
                y: 30,
                title: "Chloroplast",
                description: "The organelle where photosynthesis takes place. Contains chlorophyll that captures light energy."
              },
              {
                id: 2,
                x: 60,
                y: 45,
                title: "Stomata",
                description: "Small pores on the leaf surface that allow gas exchange - CO₂ in, O₂ out."
              },
              {
                id: 3,
                x: 40,
                y: 70,
                title: "Vascular Bundle",
                description: "Transports water from roots and sugar to other parts of the plant."
              }
            ]
          },
          interactions: [
            {
              id: "q1",
              question: "What are the main reactants in photosynthesis?",
              options: [
                { id: "a", text: "Carbon dioxide, water, and sunlight" },
                { id: "b", text: "Oxygen, glucose, and water" },
                { id: "c", text: "Nitrogen, carbon, and hydrogen" },
                { id: "d", text: "Chlorophyll, oxygen, and carbon" }
              ],
              correctAnswer: "a",
              correctFeedback: "Excellent! Carbon dioxide, water, and sunlight are indeed the main reactants.",
              incorrectFeedback: "Not quite. The main reactants are carbon dioxide, water, and sunlight energy."
            }
          ]
        }
      },
      {
        id: 3,
        title: "Light and Dark Reactions",
        type: "audio_text",
        content: {
          text: `<h3>Two Stages of Photosynthesis</h3>
                <p>Photosynthesis occurs in two main stages:</p>
                <ul>
                  <li><strong>Light Reactions:</strong> Occur in the thylakoids, convert light energy to chemical energy</li>
                  <li><strong>Dark Reactions (Calvin Cycle):</strong> Occur in the stroma, use chemical energy to produce glucose</li>
                </ul>`,
          media: {
            type: "audio",
            src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            title: "Light and Dark Reactions Explanation",
            description: "Detailed audio explanation of photosynthesis stages"
          }
        }
      },
      {
        id: 4,
        title: "Factors Affecting Photosynthesis",
        type: "interactive",
        content: {
          text: `<h3>Environmental Factors</h3>
                <p>Several factors can affect the rate of photosynthesis:</p>`,
          interactions: [
            {
              id: "q2",
              question: "Which factor would MOST limit photosynthesis in a dark room?",
              options: [
                { id: "a", text: "Temperature" },
                { id: "b", text: "Light intensity" },
                { id: "c", text: "Carbon dioxide concentration" },
                { id: "d", text: "Water availability" }
              ],
              correctAnswer: "b",
              correctFeedback: "Correct! Light is essential for photosynthesis, so lack of light would be the limiting factor.",
              incorrectFeedback: "Think about what\'s missing in a dark room that plants need for photosynthesis."
            },
            {
              id: "q3",
              question: "What happens to the rate of photosynthesis as temperature increases?",
              options: [
                { id: "a", text: "It always increases" },
                { id: "b", text: "It always decreases" },
                { id: "c", text: "It increases up to an optimal point, then decreases" },
                { id: "d", text: "Temperature has no effect" }
              ],
              correctAnswer: "c",
              correctFeedback: "Exactly! There\'s an optimal temperature range for photosynthesis.",
              incorrectFeedback: "Consider that enzymes work best at specific temperatures."
            }
          ]
        }
      },
      {
        id: 5,
        title: "Importance of Photosynthesis",
        type: "text_media",
        content: {
          text: `<h3>Why Photosynthesis Matters</h3>
                <p>Photosynthesis is crucial for life on Earth because it:</p>
                <ul>
                  <li>Produces oxygen that most living organisms need to breathe</li>
                  <li>Creates glucose that serves as food for plants and, indirectly, for all other organisms</li>
                  <li>Removes carbon dioxide from the atmosphere, helping regulate climate</li>
                  <li>Forms the foundation of most food chains and ecosystems</li>
                </ul>
                <p>Without photosynthesis, life as we know it would not exist on our planet!</p>`,
          media: {
            type: "video",
            src: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg",
            title: "Photosynthesis and Life on Earth",
            description: "Understanding the global importance of photosynthesis"
          }
        }
      }
    ]
  };

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      handleSync();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor connection strength
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const updateConnectionStrength = () => {
        const effectiveType = connection?.effectiveType;
        if (effectiveType === '4g') setConnectionStrength('high');
        else if (effectiveType === '3g') setConnectionStrength('medium');
        else setConnectionStrength('low');
      };

      updateConnectionStrength();
      connection?.addEventListener('change', updateConnectionStrength);
      return () => connection?.removeEventListener('change', updateConnectionStrength);
    }
  }, []);

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('eduquest-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem(`lesson-progress-${lessonId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentSegment(progress?.currentSegment || 1);
      setCompletedSegments(progress?.completedSegments || 0);
      setIsBookmarked(progress?.isBookmarked || false);
    }
  }, [lessonId]);

  // Save progress
  const saveProgress = (segment, completed, bookmarked = isBookmarked) => {
    const progress = {
      currentSegment: segment,
      completedSegments: completed,
      isBookmarked: bookmarked,
      lastAccessed: new Date()?.toISOString()
    };
    localStorage.setItem(`lesson-progress-${lessonId}`, JSON.stringify(progress));
  };

  const handleSegmentClick = (segmentId) => {
    if (segmentId <= completedSegments + 1) {
      setCurrentSegment(segmentId);
      saveProgress(segmentId, completedSegments);
    }
  };

  const handlePrevious = () => {
    if (currentSegment > 1) {
      const newSegment = currentSegment - 1;
      setCurrentSegment(newSegment);
      saveProgress(newSegment, completedSegments);
    }
  };

  const handleNext = () => {
    if (currentSegment < lessonData?.totalSegments) {
      const newSegment = currentSegment + 1;
      const newCompleted = Math.max(completedSegments, currentSegment);
      setCurrentSegment(newSegment);
      setCompletedSegments(newCompleted);
      saveProgress(newSegment, newCompleted);
    }
  };

  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    saveProgress(currentSegment, completedSegments, newBookmarked);
  };

  const handleInteraction = (questionId, answerId, isCorrect) => {
    // Track interaction for analytics
    console.log('Interaction:', { questionId, answerId, isCorrect });
  };

  const handleInteractiveComplete = () => {
    // Mark current segment as completed when all interactions are done
    const newCompleted = Math.max(completedSegments, currentSegment);
    setCompletedSegments(newCompleted);
    saveProgress(currentSegment, newCompleted);
  };

  const handleDownload = () => {
    // Simulate content download
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleSync = () => {
    // Simulate sync process
    window.dispatchEvent(new Event('syncStart'));
    setTimeout(() => {
      setLastSyncTime(new Date()?.toISOString());
      window.dispatchEvent(new Event('syncComplete'));
    }, 2000);
  };

  const handleMediaProgress = (progress) => {
    // Auto-advance when media is 90% complete
    if (progress >= 90) {
      const newCompleted = Math.max(completedSegments, currentSegment);
      setCompletedSegments(newCompleted);
      saveProgress(currentSegment, newCompleted);
    }
  };

  const currentSegmentData = lessonData?.segments?.find(s => s?.id === currentSegment);
  const progressPercentage = (completedSegments / lessonData?.totalSegments) * 100;
  const canProceed = completedSegments >= currentSegment || currentSegment === 1;
  const isLastSegment = currentSegment === lessonData?.totalSegments;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Lesson Header */}
        <LessonHeader
          lesson={lessonData}
          currentSegment={currentSegment}
          totalSegments={lessonData?.totalSegments}
          onBack={() => navigate('/student-dashboard')}
          onBookmark={handleBookmark}
          isBookmarked={isBookmarked}
          offlineStatus={isOffline}
        />

        {/* Lesson Progress */}
        <LessonProgress
          currentSegment={currentSegment}
          totalSegments={lessonData?.totalSegments}
          completedSegments={completedSegments}
          progressPercentage={progressPercentage}
          onSegmentClick={handleSegmentClick}
        />

        {/* Main Content Area */}
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {currentSegmentData && (
              <div className="space-y-8">
                {/* Media Content */}
                {currentSegmentData?.content?.media && (
                  <MediaPlayer
                    mediaContent={currentSegmentData?.content?.media}
                    connectionStrength={connectionStrength}
                    onProgress={handleMediaProgress}
                   
                  />
                )}

                {/* Interactive Content */}
                <InteractiveContent
                  content={currentSegmentData?.content}
                  onInteraction={handleInteraction}
                  onComplete={handleInteractiveComplete}
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <LessonNavigation
          currentSegment={currentSegment}
          totalSegments={lessonData?.totalSegments}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onQuiz={() => navigate(`/quiz-assessment?lessonId=${lessonId}`)}
          onDashboard={() => navigate('/student-dashboard')}
          canProceed={canProceed}
          isLastSegment={isLastSegment}
        />
      </main>
      {/* Offline Indicator */}
      <OfflineIndicator
        isOffline={isOffline}
        downloadProgress={downloadProgress}
        onDownload={handleDownload}
        onSync={handleSync}
        lastSyncTime={lastSyncTime}
      />
    </div>
  );
};

export default LessonContent;