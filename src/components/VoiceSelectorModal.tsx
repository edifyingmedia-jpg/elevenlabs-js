import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Play, 
  Pause, 
  Star, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { Voice } from '../types';
import { speakText, stopSpeech } from '../utils/audioSynthesizer';

interface VoiceSelectorModalProps {
  voices: Voice[];
  selectedVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
  onClose: () => void;
}

export const VoiceSelectorModal: React.FC<VoiceSelectorModalProps> = ({
  voices,
  selectedVoice,
  onSelectVoice,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const filteredVoices = voices.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      v.accent.toLowerCase().includes(search.toLowerCase());
    const matchesGender = genderFilter === 'All' || v.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handlePlayPreview = (v: Voice) => {
    if (playingVoiceId === v.id) {
      stopSpeech();
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(v.id);
      speakText(v.previewText, v.name, v.gender, 1.0, 1.0, () => setPlayingVoiceId(null));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F17] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Choose Voice Persona</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-4 bg-gray-50 dark:bg-[#111622] border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by voice name or accent..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200 font-medium"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Scrollable Voice List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredVoices.map((v) => {
            const isSelected = selectedVoice.id === v.id;
            const isPlaying = playingVoiceId === v.id;

            return (
              <div
                key={v.id}
                onClick={() => {
                  onSelectVoice(v);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-white dark:bg-[#151C28]/60 border-gray-200 dark:border-gray-800 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={v.avatarUrl} alt={v.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">{v.name}</h4>
                      {isSelected && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">Selected</span>}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {v.category} • {v.accent} ({v.gender})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPreview(v);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isPlaying
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
