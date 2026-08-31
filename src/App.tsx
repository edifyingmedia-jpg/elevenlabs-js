import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarNav } from './components/SidebarNav';
import { TextToSpeech } from './components/TextToSpeech';
import { VoiceChanger } from './components/VoiceChanger';
import { SoundEffects } from './components/SoundEffects';
import { VoiceLibrary } from './components/VoiceLibrary';
import { VoiceLab } from './components/VoiceLab';
import { ConversationalAI } from './components/ConversationalAI';
import { DubbingStudio } from './components/DubbingStudio';
import { ProjectsStudio } from './components/ProjectsStudio';
import { ApiPlayground } from './components/ApiPlayground';
import { PricingPlans } from './components/PricingPlans';
import { TextToVideo } from './components/TextToVideo';
import { ImageToVideo } from './components/ImageToVideo';
import { VoiceSelectorModal } from './components/VoiceSelectorModal';
import { NavigationTab, Voice, AudioGeneration, UserQuota } from './types';
import { MOCK_VOICES } from './data/mockVoices';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('speech-synthesis');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);

  // App Data State
  const [selectedVoice, setSelectedVoice] = useState<Voice>(MOCK_VOICES[0]);
  const [customVoices, setCustomVoices] = useState<Voice[]>([]);
  const [addedVoiceIds, setAddedVoiceIds] = useState<string[]>(['rachel-v1', 'adam-v1', 'ethan-v1']);
  const [history, setHistory] = useState<AudioGeneration[]>([
    {
      id: 'gen-init-1',
      title: 'Welcome to AppNyormal speech synthesis sample',
      text: 'Welcome to AppNyormal. Speech synthesis has evolved into true human expressiveness.',
      voiceName: 'Rachel',
      voiceId: 'rachel-v1',
      timestamp: '10 mins ago',
      duration: 4.5,
      type: 'speech',
      characterCount: 88
    }
  ]);

  // Quota Credit Counter State
  const [quota, setQuota] = useState<UserQuota>({
    creditsUsed: 550,
    maxCredits: 10000,
    planName: 'Free',
    customVoicesCount: 0,
    maxCustomVoices: 3
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const allAvailableVoices = [...MOCK_VOICES, ...customVoices];

  const handleAudioGenerated = (newGen: AudioGeneration) => {
    setHistory((prev) => [newGen, ...prev]);
    setQuota((prev) => ({
      ...prev,
      creditsUsed: Math.min(prev.maxCredits, prev.creditsUsed + newGen.characterCount)
    }));
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleAddVoice = (voiceId: string) => {
    if (addedVoiceIds.includes(voiceId)) {
      setAddedVoiceIds((prev) => prev.filter((id) => id !== voiceId));
    } else {
      setAddedVoiceIds((prev) => [...prev, voiceId]);
    }
  };

  const handleAddCustomVoice = (voice: Voice) => {
    setCustomVoices((prev) => [voice, ...prev]);
    setAddedVoiceIds((prev) => [...prev, voice.id]);
    setSelectedVoice(voice);
    setQuota((prev) => ({
      ...prev,
      customVoicesCount: prev.customVoicesCount + 1
    }));
  };

  const handleDeleteCustomVoice = (id: string) => {
    setCustomVoices((prev) => prev.filter((v) => v.id !== id));
    if (selectedVoice.id === id) {
      setSelectedVoice(MOCK_VOICES[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#07090E] text-gray-900 dark:text-gray-100 font-sans transition-colors antialiased">
      {/* ElevenLabs Top Navigation Header */}
      <Header
        quota={quota}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenPricing={() => setActiveTab('pricing-plans')}
        onOpenMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Workspace View */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all min-h-[calc(100vh-4rem)]">
          {activeTab === 'speech-synthesis' && (
            <TextToSpeech
              selectedVoice={selectedVoice}
              onOpenVoiceSelector={() => setShowVoiceModal(true)}
              onAudioGenerated={handleAudioGenerated}
              history={history}
              onDeleteHistory={handleDeleteHistory}
            />
          )}

          {activeTab === 'voice-changer' && (
            <VoiceChanger
              selectedVoice={selectedVoice}
              onOpenVoiceSelector={() => setShowVoiceModal(true)}
            />
          )}

          {activeTab === 'sound-effects' && <SoundEffects />}

          {activeTab === 'text-to-video' && (
            <TextToVideo voices={allAvailableVoices} />
          )}

          {activeTab === 'image-to-video' && (
            <ImageToVideo voices={allAvailableVoices} />
          )}

          {activeTab === 'voice-library' && (
            <VoiceLibrary
              onSelectVoice={(voice) => {
                setSelectedVoice(voice);
                setActiveTab('speech-synthesis');
              }}
              addedVoiceIds={addedVoiceIds}
              onToggleAddVoice={handleToggleAddVoice}
            />
          )}

          {activeTab === 'voice-lab' && (
            <VoiceLab
              customVoices={customVoices}
              onAddCustomVoice={handleAddCustomVoice}
              onDeleteCustomVoice={handleDeleteCustomVoice}
              onSelectVoice={(voice) => {
                setSelectedVoice(voice);
                setActiveTab('speech-synthesis');
              }}
            />
          )}

          {activeTab === 'conversational-ai' && (
            <ConversationalAI voices={allAvailableVoices} />
          )}

          {activeTab === 'dubbing' && <DubbingStudio />}

          {activeTab === 'projects-studio' && (
            <ProjectsStudio voices={allAvailableVoices} />
          )}

          {activeTab === 'api-playground' && <ApiPlayground />}

          {activeTab === 'pricing-plans' && <PricingPlans />}
        </main>
      </div>

      {/* Voice Selection Modal Overlay */}
      {showVoiceModal && (
        <VoiceSelectorModal
          voices={allAvailableVoices}
          selectedVoice={selectedVoice}
          onSelectVoice={(voice) => setSelectedVoice(voice)}
          onClose={() => setShowVoiceModal(false)}
        />
      )}
    </div>
  );
}
