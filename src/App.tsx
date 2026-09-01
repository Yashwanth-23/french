import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyMission } from './components/DailyMission';
import { RoadmapView } from './components/RoadmapView';
import { IndianBridgeGuide } from './components/IndianBridgeGuide';
import { ExamHub } from './components/ExamHub';
import { ResourceCatalog } from './components/ResourceCatalog';
import { ProfileSwitcher } from './components/ProfileSwitcher';
import { DiagnosticQuiz } from './components/DiagnosticQuiz';
import { OnboardingModal } from './components/OnboardingModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { getActiveProfile, decodeSharedProfile, createNewProfile } from './engine/storage';
import { UserProfile } from './types/preferences';
import { CEFRLevel } from './types/curriculum';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('mission');
  const [activeProfile, setActiveProfileState] = useState<UserProfile>(getActiveProfile());
  
  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Check URL parameters for shared plan
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planToken = params.get('plan');
    if (planToken) {
      const decoded = decodeSharedProfile(planToken);
      if (decoded && decoded.preferences) {
        const friendProfile = createNewProfile(
          decoded.name || "Friend's Shared Plan",
          `${(decoded.preferences.dailyTimeMinutes / 60).toFixed(1)}h / Day • Shared Track`,
          decoded.preferences
        );
        setActiveProfileState(friendProfile);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleProfileRefresh = () => {
    setActiveProfileState(getActiveProfile());
  };

  const handleDiagnosticComplete = (calibratedLevel: CEFRLevel) => {
    handleProfileRefresh();
    setActiveTab('mission');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProfile={activeProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenDiagnosticModal={() => setIsDiagnosticModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'mission' && (
          <DailyMission
            activeProfile={activeProfile}
            onProfileUpdate={handleProfileRefresh}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            activeProfile={activeProfile}
            onProfileUpdate={handleProfileRefresh}
            onOpenResource={(resId) => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'bridges' && (
          <IndianBridgeGuide />
        )}

        {activeTab === 'exam' && (
          <ExamHub />
        )}

        {activeTab === 'catalog' && (
          <ResourceCatalog
            activeProfile={activeProfile}
            onProfileUpdate={handleProfileRefresh}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>French TEF/TCF Canada Mastery Portal • 100% Client-Side Open Tool</span>
          <span>Targeting NCLC 7 / B2 • Indian Linguistic Bridge Model</span>
        </div>
      </footer>

      {/* Modals */}
      <ProfileSwitcher
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        activeProfile={activeProfile}
        onProfileChanged={handleProfileRefresh}
      />

      <DiagnosticQuiz
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        onCalibrationComplete={handleDiagnosticComplete}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        activeProfile={activeProfile}
        onComplete={handleProfileRefresh}
      />

      <HelpGuideModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onNavigateTab={(tab) => {
          setIsHelpModalOpen(false);
          setActiveTab(tab);
        }}
      />

    </div>
  );
}

export default App;
