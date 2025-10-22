
import React from 'react';
import { LughaProvider, useLugha } from './hooks/useLugha';
import LanguageSelector from './components/LanguageSelector';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import Login from './components/Login';
import DictionaryView from './components/DictionaryView';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import DailyGoals from './components/DailyGoals';
import AdventureMode from './components/AdventureMode';
import VisualVocabulary from './components/VisualVocabulary';
import ConversationTutor from './components/ConversationTutor';
import LiveTutor from './components/LiveTutor';
import CreativeCorner from './components/CreativeCorner';

const AppContent: React.FC = () => {
  const { view, selectedLanguage, activeLessonId, user } = useLugha();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen text-slate-800">
      <div className="container mx-auto max-w-xl p-4 sm:p-6">
        {view === 'language-selection' && <LanguageSelector />}
        {view === 'dashboard' && selectedLanguage && <Dashboard language={selectedLanguage} />}
        {view === 'lesson' && selectedLanguage && activeLessonId !== null && (
          <LessonView language={selectedLanguage.id} lessonId={activeLessonId} />
        )}
        {view === 'dictionary' && selectedLanguage && <DictionaryView />}
        {view === 'profile' && <Profile />}
        {view === 'leaderboard' && <Leaderboard />}
        {view === 'goals' && <DailyGoals />}
        {view === 'adventure' && selectedLanguage && <AdventureMode />}
        {view === 'visual-vocab' && selectedLanguage && <VisualVocabulary />}
        {view === 'conversation' && selectedLanguage && <ConversationTutor />}
        {view === 'live-tutor' && selectedLanguage && <LiveTutor />}
        {view === 'creative-corner' && selectedLanguage && <CreativeCorner />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LughaProvider>
      <AppContent />
    </LughaProvider>
  );
};

export default App;
