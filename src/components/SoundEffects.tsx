import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Sliders, 
  Wand2, 
  Download, 
  Volume2, 
  Clock, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { SoundEffect } from '../types';
import { SFX_PRESETS } from '../data/mockVoices';
import { generateProceduralSFX } from '../utils/audioSynthesizer';

export const SoundEffects: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('Futuristic laser beam charging up and firing');
  const [duration, setDuration] = useState<number>(3.5);
  const [promptInfluence, setPromptInfluence] = useState<number>(75);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const [sfxList, setSfxList] = useState<SoundEffect[]>([
    {
      id: 'sfx-1',
      prompt: 'Cinematic thunder strike over dark ocean',
      duration: 4.0,
      promptInfluence: 80,
      timestamp: '5 mins ago'
    },
    {
      id: 'sfx-2',
      prompt: 'Magical chime spell cast with sparkling reverb',
      duration: 3.0,
      promptInfluence: 90,
      timestamp: '15 mins ago'
    }
  ]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/generate-sfx-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error('Failed to enhance SFX prompt:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateSFX = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    await new Promise((res) => setTimeout(res, 900));

    const newSfx: SoundEffect = {
      id: `sfx-${Date.now()}`,
      prompt,
      duration,
      promptInfluence,
      timestamp: 'Just now'
    };

    setIsGenerating(false);
    setSfxList([newSfx, ...sfxList]);

    // Play synthesized sound effect immediately!
    setActivePlayingId(newSfx.id);
    generateProceduralSFX(prompt, duration);
    setTimeout(() => setActivePlayingId(null), duration * 1000);
  };

  const handlePlaySFX = (item: SoundEffect) => {
    setActivePlayingId(item.id);
    generateProceduralSFX(item.prompt, item.duration);
    setTimeout(() => setActivePlayingId(null), item.duration * 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Sound Effects Generator
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Create rich, studio-quality sound effects from simple text descriptions powered by AppNyormal sound engine.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-lg space-y-6">
        {/* Prompt Input & AI Enhancer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Sound Description Prompt
            </label>
            <button
              id="sfx-enhance-prompt-btn"
              onClick={handleEnhancePrompt}
              disabled={isEnhancing}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Enhancing...' : 'Enhance with Gemini'}</span>
            </button>
          </div>

          <textarea
            id="sfx-prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe any sound effect (e.g. Sci-fi door opening, heavy thunder, glass shattering)..."
            className="w-full h-24 p-4 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />

          {/* Preset Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] font-semibold text-gray-400 self-center">Presets:</span>
            {SFX_PRESETS.slice(0, 4).map((preset) => (
              <button
                key={preset}
                onClick={() => setPrompt(preset)}
                className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 hover:text-purple-600 dark:hover:text-purple-400 text-gray-700 dark:text-gray-300 text-[11px] font-medium transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Duration & Prompt Influence Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-gray-100 dark:border-gray-800/80">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Duration</span>
              <span className="font-mono text-purple-500 font-bold">{duration.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="22.0"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>0.5s</span>
              <span>22.0s</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Prompt Influence</span>
              <span className="font-mono text-purple-500 font-bold">{promptInfluence}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={promptInfluence}
              onChange={(e) => setPromptInfluence(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>More Random</span>
              <span>Strict Prompt</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          id="sfx-generate-btn"
          onClick={handleGenerateSFX}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing Audio Waveforms...' : 'Generate Sound Effect'}</span>
        </button>
      </div>

      {/* Generated SFX History */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500" />
          Generated Sound Effects History
        </h3>

        <div className="space-y-2">
          {sfxList.map((item) => {
            const isPlaying = activePlayingId === item.id;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 transition-all gap-3"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePlaySFX(item)}
                    className={`p-2.5 rounded-xl transition-colors ${
                      isPlaying
                        ? 'bg-purple-600 text-white animate-pulse'
                        : 'bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div>
                    <p className="font-semibold text-xs text-gray-900 dark:text-white">{item.prompt}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{item.duration}s • {item.timestamp}</p>
                  </div>
                </div>

                <button
                  onClick={() => handlePlaySFX(item)}
                  className="p-2 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Play Sound Effect"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
