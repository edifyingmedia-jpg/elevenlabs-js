import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Sliders, 
  Sparkles, 
  Download, 
  RotateCcw, 
  Wand2, 
  Clock, 
  Copy, 
  Check, 
  Trash2, 
  ChevronDown, 
  Info,
  Maximize2,
  Share2
} from 'lucide-react';
import { Voice, TTSModel, AudioGeneration, VoiceParameters } from '../types';
import { MOCK_VOICES, MOCK_MODELS } from '../data/mockVoices';
import { speakText, stopSpeech, renderWaveformCanvas } from '../utils/audioSynthesizer';

interface TextToSpeechProps {
  selectedVoice: Voice;
  onOpenVoiceSelector: () => void;
  onAudioGenerated: (gen: AudioGeneration) => void;
  history: AudioGeneration[];
  onDeleteHistory: (id: string) => void;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({
  selectedVoice,
  onOpenVoiceSelector,
  onAudioGenerated,
  history,
  onDeleteHistory,
}) => {
  const [text, setText] = useState<string>(
    "Welcome to AppNyormal. Speech synthesis has reached a new milestone in emotional authenticity and human nuance. Type your text here and experience true voice expressiveness."
  );
  const [selectedModel, setSelectedModel] = useState<TTSModel>(MOCK_MODELS[0]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);

  // Voice Fine Tuning Parameters
  const [params, setParams] = useState<VoiceParameters>(selectedVoice.parameters);

  // Audio Playback State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<AudioGeneration | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Script Assistant State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Canvas Reference for Waveform Animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync params when voice changes
  useEffect(() => {
    setParams(selectedVoice.parameters);
  }, [selectedVoice]);

  // Handle Canvas Waveform rendering
  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = renderWaveformCanvas(canvasRef.current, isPlaying);
    return () => cleanup();
  }, [isPlaying]);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    stopSpeech();

    // Simulate synthesis latency based on model
    const latencyMs = selectedModel.id.includes('flash') ? 400 : 800;
    await new Promise((res) => setTimeout(res, latencyMs));

    const newGen: AudioGeneration = {
      id: `gen-${Date.now()}`,
      title: text.length > 35 ? text.substring(0, 35) + '...' : text,
      text,
      voiceName: selectedVoice.name,
      voiceId: selectedVoice.id,
      timestamp: 'Just now',
      duration: Math.max(3, Math.round(text.split(' ').length * 0.4)),
      type: 'speech',
      characterCount: text.length,
      parameters: { ...params }
    };

    setIsGenerating(false);
    setCurrentAudio(newGen);
    onAudioGenerated(newGen);

    // Speak text through speech synthesizer
    setIsPlaying(true);
    speakText(
      text,
      selectedVoice.name,
      selectedVoice.gender,
      playbackSpeed,
      1.0,
      () => setIsPlaying(false)
    );
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(
        text,
        selectedVoice.name,
        selectedVoice.gender,
        playbackSpeed,
        1.0,
        () => setIsPlaying(false)
      );
    }
  };

  const handleGenerateAiScript = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text || 'AppNyormal synthetic speech overview',
          category: selectedVoice.category,
          tone: selectedVoice.tags.join(', ')
        })
      });
      const data = await res.json();
      if (data.script) {
        setText(data.script);
      }
    } catch (err) {
      console.error('Failed to generate script:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleInsertTag = (tag: string) => {
    setText((prev) => prev + ` ${tag} `);
  };

  const handleCopyText = (textToCopy: string, id: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Voice Selector Card Button */}
        <div className="flex items-center gap-3">
          <button
            id="tts-voice-selector-btn"
            onClick={onOpenVoiceSelector}
            className="flex items-center gap-3 p-2 pr-4 rounded-xl border border-gray-200 dark:border-gray-700/80 hover:border-indigo-500/80 bg-gray-50 dark:bg-[#151C28] transition-all group text-left"
          >
            <div className="relative">
              <img
                src={selectedVoice.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={selectedVoice.name}
                className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-[9px] text-white font-bold">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-gray-900 dark:text-white">{selectedVoice.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {selectedVoice.accent}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{selectedVoice.category} • {selectedVoice.gender}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 ml-1" />
          </button>
        </div>

        {/* Model Selector Dropdown & Settings Toggle */}
        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <div className="relative">
            <button
              id="tts-model-selector-btn"
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-[#151C28] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-indigo-500 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{selectedModel.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showModelDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111622] shadow-2xl p-2 z-50 space-y-1">
                <p className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase">Select Speech Model</p>
                {MOCK_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex flex-col gap-1 ${
                      selectedModel.id === model.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-500/30 text-indigo-900 dark:text-indigo-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{model.name}</span>
                      {model.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500 text-white font-bold">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{model.description}</p>
                    <span className="text-[10px] text-indigo-500 font-mono">Latency: {model.latency}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Drawer Button */}
          <button
            id="tts-voice-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showSettings
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-gray-100 dark:bg-[#151C28] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-500'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Voice Settings</span>
          </button>
        </div>
      </div>

      {/* Voice Fine-Tuning Settings Drawer */}
      {showSettings && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Voice Fine-Tuning Controls</h3>
            </div>
            <button
              onClick={() => setParams(selectedVoice.parameters)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stability */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  Stability
                  <Info className="w-3 h-3 text-gray-400" title="Higher values make speech more consistent; lower values introduce emotional variance." />
                </span>
                <span className="font-mono text-indigo-500 font-bold">{params.stability}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.stability}
                onChange={(e) => setParams({ ...params, stability: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>More Variable</span>
                <span>More Stable</span>
              </div>
            </div>

            {/* Clarity + Similarity */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  Clarity + Similarity
                  <Info className="w-3 h-3 text-gray-400" title="Enhances vocal crispness and adherence to original voice sample timbre." />
                </span>
                <span className="font-mono text-indigo-500 font-bold">{params.clarity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.clarity}
                onChange={(e) => setParams({ ...params, clarity: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Natural Artifacts</span>
                <span>High Clarity</span>
              </div>
            </div>

            {/* Style Exaggeration */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  Style Exaggeration
                  <Info className="w-3 h-3 text-gray-400" title="Amplifies dramatic inflections and expressive energy." />
                </span>
                <span className="font-mono text-indigo-500 font-bold">{params.styleExaggeration}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.styleExaggeration}
                onChange={(e) => setParams({ ...params, styleExaggeration: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>None</span>
                <span>Dramatic</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Text Input Canvas & Editor */}
      <div className="rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden flex flex-col">
        {/* Editor Helper Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 dark:bg-[#111622] border-b border-gray-200 dark:border-gray-800 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Quick SSML Tags:</span>
            <button
              onClick={() => handleInsertTag('<break time="1.0s"/>')}
              className="px-2 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-500 transition-colors font-mono text-[11px]"
            >
              + Pause (1.0s)
            </button>
            <button
              onClick={() => handleInsertTag('<emphasis level="strong">text</emphasis>')}
              className="px-2 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-500 transition-colors font-mono text-[11px]"
            >
              + Emphasis
            </button>
          </div>

          <button
            id="tts-ai-script-enhance-btn"
            onClick={handleGenerateAiScript}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 transition-all font-semibold"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'AI Enhancing...' : 'Enhance Script with Gemini'}</span>
          </button>
        </div>

        {/* Textarea Input */}
        <div className="relative p-5">
          <textarea
            id="tts-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-48 sm:h-56 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-base leading-relaxed resize-none focus:outline-none scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
          />

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/60 text-xs text-gray-500 dark:text-gray-400 font-mono">
            <span>{text.split(/\s+/).filter(Boolean).length} words</span>
            <span>
              <strong className={text.length > 4500 ? 'text-rose-500' : 'text-indigo-500'}>
                {text.length}
              </strong>{' '}
              / 5,000 characters
            </span>
          </div>
        </div>

        {/* Audio Waveform Canvas & Live Action Footer Bar */}
        <div className="p-4 bg-gray-50 dark:bg-[#111622] border-t border-gray-200 dark:border-gray-800 space-y-4">
          {/* Animated Waveform Display */}
          <div className="h-14 w-full bg-white dark:bg-[#0B0F17] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full block" />
            {!isPlaying && !isGenerating && (
              <span className="absolute text-[11px] font-semibold text-gray-400 tracking-wide uppercase">
                Ready to generate audio
              </span>
            )}
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs text-white text-xs font-semibold gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing voice with AppNyormal engine...</span>
              </div>
            )}
          </div>

          {/* Controls & Generate Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Playback & Speed Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="tts-play-toggle-btn"
                onClick={handleTogglePlay}
                disabled={!text.trim() || isGenerating}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                  isPlaying
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Speed:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors ${
                      playbackSpeed === speed
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Main Generate Button */}
            <button
              id="tts-generate-speech-btn"
              onClick={handleGenerate}
              disabled={!text.trim() || isGenerating}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : `Generate Speech (${text.length} credits)`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* History & Recent Audio Generations */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Recent Generations</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">({history.length})</span>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-2">
            <Volume2 className="w-8 h-8 text-gray-400 mx-auto opacity-50" />
            <p className="font-medium text-sm text-gray-600 dark:text-gray-400">No generated audio clips yet</p>
            <p className="text-xs text-gray-400">Click Generate Speech above to create your first audio file.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800/80 hover:border-indigo-500/50 transition-all gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      speakText(item.text, item.voiceName, 'Female', 1.0, 1.0);
                    }}
                    className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </button>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.voiceName}</span>
                      <span>•</span>
                      <span>{item.duration}s</span>
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopyText(item.text, item.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Copy Text"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      // Trigger audio download
                      const blob = new Blob([item.text], { type: 'audio/mp3' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `appnyormal-${item.voiceName}-${item.id}.mp3`;
                      a.click();
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Download Audio"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteHistory(item.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete"
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
