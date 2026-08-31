import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Star, 
  Globe, 
  User, 
  Sparkles,
  Share2
} from 'lucide-react';
import { Voice } from '../types';
import { MOCK_VOICES } from '../data/mockVoices';
import { speakText, stopSpeech } from '../utils/audioSynthesizer';

interface VoiceLibraryProps {
  onSelectVoice: (voice: Voice) => void;
  addedVoiceIds: string[];
  onToggleAddVoice: (voiceId: string) => void;
}

export const VoiceLibrary: React.FC<VoiceLibraryProps> = ({
  onSelectVoice,
  addedVoiceIds,
  onToggleAddVoice,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const categories = ['All', 'Narrative', 'Conversational', 'Animation', 'Characters', 'Social Media', 'News', 'Audiobooks'];

  const filteredVoices = MOCK_VOICES.filter((voice) => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voice.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      voice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || voice.category === selectedCategory;
    const matchesGender = selectedGender === 'All' || voice.gender === selectedGender;
    return matchesSearch && matchesCategory && matchesGender;
  });

  const handlePlayPreview = (voice: Voice) => {
    if (playingVoiceId === voice.id) {
      stopSpeech();
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voice.id);
      speakText(voice.previewText, voice.name, voice.gender, 1.0, 1.0, () => setPlayingVoiceId(null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            Voice Library
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Discover thousands of community and pre-built synthetic voices for your narration, gaming, and AI agents.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by voice name, accent, tag, or use-case..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200 font-medium focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVoices.map((voice) => {
          const isAdded = addedVoiceIds.includes(voice.id);
          const isPlaying = playingVoiceId === voice.id;

          return (
            <div
              key={voice.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 hover:border-indigo-500/60 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Voice Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={voice.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={voice.name}
                      className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">{voice.name}</h3>
                        {voice.featured && (
                          <span className="p-0.5 rounded bg-amber-500/10 text-amber-500" title="Featured Voice">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {voice.accent} • {voice.gender}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayPreview(voice)}
                    className={`p-3 rounded-xl transition-all ${
                      isPlaying
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                  {voice.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {voice.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800/80">
                <button
                  onClick={() => onSelectVoice(voice)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors text-center"
                >
                  Use Voice
                </button>
                <button
                  onClick={() => onToggleAddVoice(voice.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isAdded
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isAdded ? 'Added' : 'Add to Lab'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
