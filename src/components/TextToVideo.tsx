import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Wand2, 
  Play, 
  Pause, 
  Download, 
  Clock, 
  Camera, 
  Film, 
  Volume2, 
  Sliders, 
  Share2,
  Maximize2,
  RotateCcw,
  Check
} from 'lucide-react';
import { Voice, VideoGeneration } from '../types';
import { speakText, stopSpeech } from '../utils/audioSynthesizer';

interface TextToVideoProps {
  voices: Voice[];
}

export const TextToVideo: React.FC<TextToVideoProps> = ({ voices }) => {
  const [prompt, setPrompt] = useState<string>(
    'A cinematic futuristic skyline at dusk with flying neon vehicles and rain reflections on glass spires'
  );
  const [selectedStyle, setSelectedStyle] = useState<string>('Cinematic');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');
  const [cameraMotion, setCameraMotion] = useState<string>('Drone Slow Forward');
  const [duration, setDuration] = useState<number>(5.0);
  const [voiceOverText, setVoiceOverText] = useState<string>(
    'The city of tomorrow rises above the clouds, powered by pure light and quantum energy.'
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(voices[0]?.id || 'rachel-v1');
  const [includeAudioFX, setIncludeAudioFX] = useState<boolean>(true);

  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>('vid-sample-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [videoHistory, setVideoHistory] = useState<VideoGeneration[]>([
    {
      id: 'vid-sample-1',
      prompt: 'A cinematic futuristic skyline at dusk with flying neon vehicles and rain reflections',
      style: 'Cinematic',
      aspectRatio: '16:9',
      cameraMotion: 'Drone Slow Forward',
      duration: 5.0,
      timestamp: '10 mins ago',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      voiceOverName: voices[0]?.name || 'Rachel',
      hasAudioFX: true,
      type: 'text-to-video'
    },
    {
      id: 'vid-sample-2',
      prompt: 'Magical enchanted forest with glowing lotus flowers floating down an emerald river',
      style: 'Photorealistic',
      aspectRatio: '16:9',
      cameraMotion: 'Pan Right',
      duration: 4.0,
      timestamp: '1 hour ago',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      voiceOverName: 'Adam',
      hasAudioFX: true,
      type: 'text-to-video'
    }
  ]);

  const STYLES = ['Cinematic', 'Photorealistic', 'Cyberpunk', 'Anime', '3D Animation', 'Vintage 35mm'];
  const CAMERA_MOTIONS = ['Drone Slow Forward', 'Pan Left-Right', 'Orbit Target', 'Tilt Up', 'Zoom In', 'Static Camera'];

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance-video-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: selectedStyle })
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error('Failed to enhance video prompt:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    await new Promise((res) => setTimeout(res, 2000));

    const selectedVoiceObj = voices.find(v => v.id === selectedVoiceId);

    const newVid: VideoGeneration = {
      id: `vid-${Date.now()}`,
      prompt,
      style: selectedStyle,
      aspectRatio,
      cameraMotion,
      duration,
      timestamp: 'Just now',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      voiceOverName: selectedVoiceObj ? selectedVoiceObj.name : 'Rachel',
      hasAudioFX: includeAudioFX,
      type: 'text-to-video'
    };

    setIsGenerating(false);
    setVideoHistory([newVid, ...videoHistory]);
    setActiveVideoId(newVid.id);

    // Play voiceover narration if text exists
    if (voiceOverText.trim() && selectedVoiceObj) {
      setIsPlaying(true);
      speakText(voiceOverText, selectedVoiceObj.name, selectedVoiceObj.gender, 1.0, 1.0, () => setIsPlaying(false));
    }
  };

  const currentActiveVid = videoHistory.find(v => v.id === activeVideoId) || videoHistory[0];

  const togglePlayVideo = (vid: VideoGeneration) => {
    if (activeVideoId === vid.id && isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setActiveVideoId(vid.id);
      setIsPlaying(true);
      const selectedVoiceObj = voices.find(v => v.name === vid.voiceOverName) || voices[0];
      speakText(
        voiceOverText || vid.prompt, 
        selectedVoiceObj?.name || 'Rachel', 
        selectedVoiceObj?.gender || 'Female', 
        1.0, 
        1.0, 
        () => setIsPlaying(false)
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Video className="w-6 h-6 text-indigo-500" />
          AppNyormal Text to Video Generator
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white">
            AI Video v1
          </span>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Generate high-definition AI videos complete with lip-synced AppNyormal voiceovers, camera motion control, and studio sound effects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Prompt Controls & Video Settings */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-lg space-y-5">
            {/* Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  Video Scene Prompt
                </label>
                <button
                  id="text-to-video-enhance-btn"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                  <span>{isEnhancing ? 'Enhancing Scene...' : 'Enhance with Gemini'}</span>
                </button>
              </div>

              <textarea
                id="text-to-video-prompt-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe your scene in detail (e.g. A serene rain forest at sunrise, camera sweeping across ancient trees with fog)..."
                className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
              />
            </div>

            {/* Visual Style Pills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Visual Style</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStyle(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedStyle === st
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Camera Movement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { ratio: '16:9', label: '16:9' },
                    { ratio: '9:16', label: '9:16' },
                    { ratio: '1:1', label: '1:1' },
                    { ratio: '4:3', label: '4:3' }
                  ].map((ar) => (
                    <button
                      key={ar.ratio}
                      onClick={() => setAspectRatio(ar.ratio as any)}
                      className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                        aspectRatio === ar.ratio
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'bg-gray-50 dark:bg-[#111622] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Camera Movement</label>
                <select
                  value={cameraMotion}
                  onChange={(e) => setCameraMotion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
                >
                  {CAMERA_MOTIONS.map((cm) => (
                    <option key={cm} value={cm}>{cm}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Voiceover Narrator Script Box */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  Voiceover Script (AppNyormal Voiceover)
                </label>
                <select
                  value={selectedVoiceId}
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                >
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.gender})</option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                value={voiceOverText}
                onChange={(e) => setVoiceOverText(e.target.value)}
                placeholder="Enter narration text to speak during video playback..."
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
              />
            </div>

            {/* Audio FX & Duration Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Video Duration</span>
                  <span className="font-mono text-indigo-500 font-bold">{duration.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="15.0"
                  step="0.5"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-3 sm:pt-0">
                <input
                  type="checkbox"
                  checked={includeAudioFX}
                  onChange={(e) => setIncludeAudioFX(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Auto-Synthesize Sound Effects
                </span>
              </label>
            </div>

            {/* Generate Button */}
            <button
              id="text-to-video-generate-btn"
              onClick={handleGenerateVideo}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Film className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing AI Video & Narration...' : 'Generate AI Video'}</span>
            </button>
          </div>
        </div>

        {/* Right 6 Cols: Interactive Video Player Preview & History */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main Video Player Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                  Video Preview Player
                </h3>
              </div>
              <span className="text-[11px] font-mono text-indigo-500 font-bold">
                {currentActiveVid?.style} • {currentActiveVid?.aspectRatio}
              </span>
            </div>

            {/* Video Canvas Container */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center group border border-gray-800 shadow-inner">
              <img
                src={currentActiveVid?.thumbnailUrl}
                alt={currentActiveVid?.prompt}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105 filter brightness-110' : 'scale-100'
                }`}
              />

              {/* Video Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-1 rounded text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                    APPNYORMAL VIDEO MODEL V1
                  </span>
                  <span className="px-2 py-1 rounded text-[10px] font-bold bg-indigo-600/90 text-white">
                    {currentActiveVid?.duration}s
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-white font-medium line-clamp-2 drop-shadow">
                    "{currentActiveVid?.prompt}"
                  </p>
                  
                  {/* Play Controls Overlay */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => togglePlayVideo(currentActiveVid)}
                      className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-transform active:scale-90 flex items-center justify-center"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <div className="flex items-center gap-2 text-[11px] text-gray-300 font-mono">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Narrator: {currentActiveVid?.voiceOverName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Video Info */}
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-gray-900 dark:text-white">Camera Motion: {currentActiveVid?.cameraMotion}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Audio FX Track: Synthesized Stereo 48kHz</p>
              </div>
              <button
                onClick={() => togglePlayVideo(currentActiveVid)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500"
              >
                {isPlaying ? 'Pause' : 'Play Video'}
              </button>
            </div>
          </div>

          {/* Generated Video History Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Generated Video History ({videoHistory.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videoHistory.map((vid) => {
                const isSelected = activeVideoId === vid.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideoId(vid.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                        : 'bg-white dark:bg-[#0B0F17] border-gray-200 dark:border-gray-800 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="relative h-24 rounded-lg overflow-hidden bg-black">
                      <img src={vid.thumbnailUrl} alt={vid.prompt} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                        {vid.duration}s
                      </span>
                    </div>

                    <p className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-1">
                      {vid.prompt}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>{vid.style}</span>
                      <span>{vid.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
