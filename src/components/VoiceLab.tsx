import React, { useState } from 'react';
import { 
  Fingerprint, 
  Upload, 
  Plus, 
  Sparkles, 
  Mic, 
  Check, 
  Sliders, 
  Trash2,
  Volume2
} from 'lucide-react';
import { Voice } from '../types';

interface VoiceLabProps {
  customVoices: Voice[];
  onAddCustomVoice: (voice: Voice) => void;
  onDeleteCustomVoice: (id: string) => void;
  onSelectVoice: (voice: Voice) => void;
}

export const VoiceLab: React.FC<VoiceLabProps> = ({
  customVoices,
  onAddCustomVoice,
  onDeleteCustomVoice,
  onSelectVoice,
}) => {
  const [activeTab, setActiveTab] = useState<'clone' | 'design'>('clone');

  // Instant Voice Cloning Form State
  const [cloneName, setCloneName] = useState('');
  const [cloneDesc, setCloneDesc] = useState('');
  const [cloneGender, setCloneGender] = useState<'Male' | 'Female'>('Female');
  const [cloneAccent, setCloneAccent] = useState('American');
  const [cloneSampleFile, setCloneSampleFile] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState(false);

  // Voice Design Form State
  const [designGender, setDesignGender] = useState<'Male' | 'Female'>('Male');
  const [designAge, setDesignAge] = useState<'Young' | 'Middle Aged' | 'Old'>('Young');
  const [designAccent, setDesignAccent] = useState('British');
  const [designStrength, setDesignStrength] = useState(70);
  const [designName, setDesignName] = useState('');

  const handleInstantClone = async () => {
    if (!cloneName.trim()) return;
    setIsCloning(true);
    await new Promise((res) => setTimeout(res, 1200));

    const newVoice: Voice = {
      id: `custom-${Date.now()}`,
      name: cloneName,
      category: 'Conversational',
      description: cloneDesc || 'Custom instant voice clone created from sample recording.',
      gender: cloneGender,
      age: 'Middle Aged',
      accent: cloneAccent,
      language: 'English (US)',
      previewText: `Hello! I am your cloned custom AI voice named ${cloneName}.`,
      avatarUrl: cloneGender === 'Female' 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      tags: ['Custom Clone', 'Personal', cloneAccent],
      useCase: 'Custom Applications',
      rating: 5.0,
      cloned: true,
      parameters: { stability: 50, clarity: 75, styleExaggeration: 25, speakerBoost: true }
    };

    setIsCloning(false);
    onAddCustomVoice(newVoice);
    setCloneName('');
    setCloneDesc('');
    setCloneSampleFile(null);
  };

  const handleCreateVoiceDesign = async () => {
    if (!designName.trim()) return;
    setIsCloning(true);
    await new Promise((res) => setTimeout(res, 1000));

    const newVoice: Voice = {
      id: `designed-${Date.now()}`,
      name: designName,
      category: 'Narrative',
      description: `Synthetic voice designed with ${designAccent} accent and ${designAge} vocal profile.`,
      gender: designGender,
      age: designAge,
      accent: designAccent,
      language: 'English (UK)',
      previewText: `Welcome! I am a synthetic voice designed in the AppNyormal Voice Lab.`,
      avatarUrl: designGender === 'Female' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      tags: ['Voice Design', designAge, designAccent],
      useCase: 'Storytelling & Games',
      rating: 4.9,
      cloned: true,
      parameters: { stability: 60, clarity: 80, styleExaggeration: 30, speakerBoost: true }
    };

    setIsCloning(false);
    onAddCustomVoice(newVoice);
    setDesignName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Fingerprint className="w-6 h-6 text-indigo-500" />
          Voice Lab & Instant Voice Cloning
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Clone your own voice from audio samples or generate unique synthetic voices using vocal parameter controls.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-[#0B0F17] rounded-xl border border-gray-200 dark:border-gray-800 w-fit">
        <button
          onClick={() => setActiveTab('clone')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'clone'
              ? 'bg-white dark:bg-[#151C28] text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Instant Voice Cloning
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'design'
              ? 'bg-white dark:bg-[#151C28] text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Voice Design (Synthetic)
        </button>
      </div>

      {/* Instant Voice Cloning Form */}
      {activeTab === 'clone' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-lg space-y-5">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Create Instant Voice Clone</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Voice Name</label>
              <input
                type="text"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                placeholder="e.g. Alex's Narrator Voice"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Accent / Region</label>
              <input
                type="text"
                value={cloneAccent}
                onChange={(e) => setCloneAccent(e.target.value)}
                placeholder="e.g. American, British, Australian"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Description</label>
            <input
              type="text"
              value={cloneDesc}
              onChange={(e) => setCloneDesc(e.target.value)}
              placeholder="Brief description of tone, pitch, and intended use-case..."
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Audio Sample Upload Dropzone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Upload Voice Samples (1-5 min recommended)</label>
            <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 rounded-xl cursor-pointer bg-gray-50 dark:bg-[#111622] p-4 text-center">
              <Upload className="w-6 h-6 text-indigo-500 mb-1" />
              <p className="font-semibold text-xs text-gray-800 dark:text-gray-200">
                {cloneSampleFile ? `Attached: ${cloneSampleFile}` : 'Drop voice recording file or browse'}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Clean audio without background music produces highest fidelity.</p>
              <input 
                type="file" 
                accept="audio/*" 
                onChange={(e) => setCloneSampleFile(e.target.files?.[0]?.name || null)} 
                className="hidden" 
              />
            </label>
          </div>

          <button
            onClick={handleInstantClone}
            disabled={!cloneName.trim() || isCloning}
            className="w-full py-3 px-6 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Fingerprint className="w-4 h-4" />
            <span>{isCloning ? 'Training AppNyormal Neural Model...' : 'Clone Voice Now'}</span>
          </button>
        </div>
      )}

      {/* Voice Design Form */}
      {activeTab === 'design' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-lg space-y-5">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Design Synthetic Voice</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Gender</label>
              <select
                value={designGender}
                onChange={(e) => setDesignGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Age Group</label>
              <select
                value={designAge}
                onChange={(e) => setDesignAge(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
              >
                <option value="Young">Young</option>
                <option value="Middle Aged">Middle Aged</option>
                <option value="Old">Old</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Accent</label>
              <select
                value={designAccent}
                onChange={(e) => setDesignAccent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
              >
                <option value="American">American</option>
                <option value="British">British</option>
                <option value="Australian">Australian</option>
                <option value="Irish">Irish</option>
                <option value="Indian">Indian</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Voice Name</label>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="e.g. Captain Sterling"
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleCreateVoiceDesign}
            disabled={!designName.trim() || isCloning}
            className="w-full py-3 px-6 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isCloning ? 'Synthesizing Designed Voice...' : 'Generate Voice Profile'}</span>
          </button>
        </div>
      )}

      {/* User's Custom Voices Grid */}
      <div className="space-y-3 pt-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Your Custom Voice Collection ({customVoices.length})</h3>

        {customVoices.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-2">
            <Fingerprint className="w-8 h-8 text-gray-400 mx-auto opacity-50" />
            <p className="font-medium text-sm text-gray-600 dark:text-gray-400">No custom voices created yet</p>
            <p className="text-xs text-gray-400">Use the form above to clone your first voice or design a synthetic one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customVoices.map((voice) => (
              <div
                key={voice.id}
                className="p-4 rounded-xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={voice.avatarUrl} alt={voice.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">{voice.name}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{voice.accent} • {voice.gender}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectVoice(voice)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    Use Voice
                  </button>
                  <button
                    onClick={() => onDeleteCustomVoice(voice.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
