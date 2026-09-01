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
import { 
  getActiveSlugFromUrlOrStorage, 
  fetchProfile, 
  saveProfileToCloud 
} from './engine/dataService';
import { UserProfile } from './types/preferences';
import { CEFRLevel } from './types/curriculum';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('mission');
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Initialize Profile on Mount
  useEffect(() => {
    async function loadInitialProfile() {
      setIsLoading(true);
      const slug = getActiveSlugFromUrlOrStorage();
      if (slug) {
        const found = await fetchProfile(slug);
        if (found) {
          setActiveProfile(found);
          setIsLoading(false);
          return;
        }
      }

      // No profile found -> trigger Onboarding Wizard for clean fresh start
      setIsLoading(false);
      setIsOnboardingModalOpen(true);
    }
    loadInitialProfile();
  }, []);

  const handleProfileCreatedOrUpdated = (updatedProfile: UserProfile) => {
    setActiveProfile(updatedProfile);
    setIsOnboardingModalOpen(false);
  };

  const handleDiagnosticComplete = async (calibratedLevel: CEFRLevel) => {
    if (activeProfile) {
      const updated: UserProfile = {
        ...activeProfile,
        currentMilestoneId: `milestone-${calibratedLevel.toLowerCase()}`,
        preferences: {
          ...activeProfile.preferences,
          startingLevel: calibratedLevel
        }
      };
      await saveProfileToCloud(updated);
      setActiveProfile(updated);
    }
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
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"></div>
          </div>
        ) : !activeProfile ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-lg mx-auto mt-12">
            <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto text-xl">
              🍁
            </div>
            <h2 className="text-xl font-bold text-white">Welcome to French Mastery Portal</h2>
            <p className="text-xs text-slate-400">
              Create your personalized Canadian French study plan to start your rolling task backlog.
            </p>
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
            >
              Start Personal Setup Wizard
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'mission' && (
              <DailyMission
                activeProfile={activeProfile}
                onProfileUpdate={handleProfileCreatedOrUpdated}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapView
                activeProfile={activeProfile}
                onProfileUpdate={async () => {
                  if (activeProfile) {
                    const fresh = await fetchProfile(activeProfile.id);
                    if (fresh) setActiveProfile(fresh);
                  }
                }}
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
                onProfileUpdate={async () => {
                  if (activeProfile) {
                    const fresh = await fetchProfile(activeProfile.id);
                    if (fresh) setActiveProfile(fresh);
                  }
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>French TEF/TCF Canada Mastery Portal • Multi-Device Cloud Sync Ready</span>
          <span>Targeting NCLC 7 / B2 • Indian Linguistic Bridge Model</span>
        </div>
      </footer>

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => {
          if (activeProfile) setIsOnboardingModalOpen(false);
        }}
        onProfileCreated={handleProfileCreatedOrUpdated}
        isInitialSetup={!activeProfile}
      />

      <DiagnosticQuiz
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        onCalibrationComplete={handleDiagnosticComplete}
      />

      <HelpGuideModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onNavigateTab={(tab) => {
          setIsHelpModalOpen(false);
          setActiveTab(tab);
        }}
      />

      {activeProfile && (
        <ProfileSwitcher
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          activeProfile={activeProfile}
          onProfileChanged={handleProfileCreatedOrUpdated}
          onOpenFullOnboarding={() => setIsOnboardingModalOpen(true)}
        />
      )}

    </div>
  );
}

export default App;
