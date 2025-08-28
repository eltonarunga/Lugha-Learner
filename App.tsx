import React from 'react';
import { LughaProvider, useLugha } from './hooks/useLugha';
import LanguageSelector from './components/LanguageSelector';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import Login from './components/Login'; // Import the new Login component
import DictionaryView from './components/DictionaryView';

const AppContent: React.FC = () => {
  const { view, selectedLanguage, activeLessonId, user } = useLugha();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="container mx-auto max-w-lg p-4">
        {view === 'language-selection' && <LanguageSelector />}
        {view === 'dashboard' && selectedLanguage && <Dashboard language={selectedLanguage} />}
        {view === 'lesson' && selectedLanguage && activeLessonId !== null && (
          <LessonView language={selectedLanguage.id} lessonId={activeLessonId} />
        )}
        {view === 'dictionary' && selectedLanguage && <DictionaryView />}
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
