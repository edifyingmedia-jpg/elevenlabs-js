import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Play, 
  Pause, 
  Film, 
  Wand2, 
  Sliders, 
  Clock, 
  Volume2, 
  Share2, 
  RotateCcw,
  Check
} from 'lucide-react';
import { Voice, VideoGeneration } from '../types';
import { speakText, stopSpeech } from '../utils/audioSynthesizer';

interface ImageToVideoProps {
  voices: Voice[];
}

export const ImageToVideo: React.FC<ImageToVideoProps> = ({ voices }) => {
  const [uploadedImage, setUploadedImage] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop'
  );
  const [motionPrompt, setMotionPrompt] = useState<string>(
    'Wind gently blowing hair, subtle facial blink, soft atmospheric lens flare shifting'
  );
  const [motionStrength, setMotionStrength] = useState<number>(6);
  const [cameraZoom, setCameraZoom] = useState<string>('Slow Zoom In');
  const [duration, setDuration] = useState<number>(4.0);
  const [narrationText, setNarrationText] = useState<string>(
    'Every picture holds a hidden story waiting to breathe and move.'
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(voices[0]?.id || 'rachel-v1');

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [activeVideoId, setActiveVideoId] = useState<string>('img-vid-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const STOCK_IMAGES = [
    {
      title: 'Cyberpunk Portrait',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop'
    },
    {
      title: 'Serene Waterfall',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop'
    },
    {
      title: 'Sci-Fi Station',
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop'
    },
    {
      title: 'Golden Sunset Coast',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop'
    }
  ];

  const [videoHistory, setVideoHistory] = useState<VideoGeneration[]>([
    {
      id: 'img-vid-1',
      prompt: 'Wind gently blowing hair, subtle facial blink, soft atmospheric lens flare shifting',
      style: 'Portrait Animation',
      aspectRatio: '16:9',
      cameraMotion: 'Slow Zoom In',
      duration: 4.0,
      timestamp: '15 mins ago',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      voiceOverName: voices[0]?.name || 'Rachel',
      type: 'image-to-video',
      sourceImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop'
    }
  ]);

  const handleEnhancePrompt = async () => {
    if (!motionPrompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance-video-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: motionPrompt, style: 'Image to Motion Animation' })
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setMotionPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error('Failed to enhance motion prompt:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAnimateImage = async () => {
    setIsAnimating(true);
    await new Promise((res) => setTimeout(res, 2200));

    const selectedVoiceObj = voices.find(v => v.id === selectedVoiceId);

    const newVid: VideoGeneration = {
      id: `img-vid-${Date.now()}`,
      prompt: motionPrompt,
      style: 'Image Animation',
      aspectRatio: '16:9',
      cameraMotion: cameraZoom,
      duration,
      timestamp: 'Just now',
      thumbnailUrl: uploadedImage,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      voiceOverName: selectedVoiceObj ? selectedVoiceObj.name : 'Rachel',
      type: 'image-to-video',
      sourceImageUrl: uploadedImage
    };

    setIsAnimating(false);
    setVideoHistory([newVid, ...videoHistory]);
    setActiveVideoId(newVid.id);

    if (narrationText.trim() && selectedVoiceObj) {
      setIsPlaying(true);
      speakText(narrationText, selectedVoiceObj.name, selectedVoiceObj.gender, 1.0, 1.0, () => setIsPlaying(false));
    }
  };

  const currentVid = videoHistory.find(v => v.id === activeVideoId) || videoHistory[0];

  const togglePlay = (vid: VideoGeneration) => {
    if (activeVideoId === vid.id && isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setActiveVideoId(vid.id);
      setIsPlaying(true);
      const selectedVoiceObj = voices.find(v => v.name === vid.voiceOverName) || voices[0];
      speakText(
        narrationText || vid.prompt, 
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
          <ImageIcon className="w-6 h-6 text-indigo-500" />
          AppNyormal Image to Video Animator
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white">
            Motion AI
          </span>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Animate still images into expressive, lifelike motion videos with custom camera pans, depth fields, and audio narration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Image Upload & Motion Settings */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-lg space-y-5">
            {/* Image Dropzone & Preview */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                Source Image
              </label>

              <div className="flex gap-4 items-center">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 shrink-0 bg-black">
                  <img src={uploadedImage} alt="Source" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-2">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs cursor-pointer hover:bg-indigo-100 transition-colors w-fit">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedImage(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-gray-400">Supports JPG, PNG, WEBP up to 20MB.</p>
                </div>
              </div>

              {/* Sample Stock Image Selector */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-gray-400">Or pick sample image:</span>
                <div className="flex gap-2 overflow-x-auto pt-1 pb-1">
                  {STOCK_IMAGES.map((img) => (
                    <button
                      key={img.title}
                      onClick={() => setUploadedImage(img.url)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        uploadedImage === img.url ? 'border-indigo-600 ring-2 ring-indigo-500' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Motion Prompt Box */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  Motion & Animation Instructions
                </label>
                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                  <span>{isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}</span>
                </button>
              </div>

              <textarea
                value={motionPrompt}
                onChange={(e) => setMotionPrompt(e.target.value)}
                rows={2}
                placeholder="Describe how the elements in the photo should move..."
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Motion Intensity Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Motion Strength</span>
                  <span className="font-mono text-indigo-500 font-bold">{motionStrength} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={motionStrength}
                  onChange={(e) => setMotionStrength(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Camera Lens Zoom</label>
                <select
                  value={cameraZoom}
                  onChange={(e) => setCameraZoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
                >
                  <option value="Slow Zoom In">Slow Zoom In</option>
                  <option value="Zoom Out">Zoom Out Reveal</option>
                  <option value="Pan Left">Pan Left</option>
                  <option value="Pan Right">Pan Right</option>
                  <option value="Static Depth">Static Depth</option>
                </select>
              </div>
            </div>

            {/* Voice Narration Script */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  Synchronized Voice Narration
                </label>
                <select
                  value={selectedVoiceId}
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                >
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                value={narrationText}
                onChange={(e) => setNarrationText(e.target.value)}
                placeholder="Optional text for AppNyormal voiceover..."
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
              />
            </div>

            {/* Animate Button */}
            <button
              id="image-to-video-generate-btn"
              onClick={handleAnimateImage}
              disabled={isAnimating}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnimating ? 'Animating Image into Motion Video...' : 'Animate Image to Video'}</span>
            </button>
          </div>
        </div>

        {/* Right 6 Cols: Animated Preview & Video History */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-500" />
                Animated Video Output
              </h3>
              <span className="text-[11px] font-mono text-indigo-500 font-bold">
                Motion Level: {motionStrength}/10
              </span>
            </div>

            {/* Rendered Video Canvas */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center group border border-gray-800 shadow-inner">
              <img
                src={currentVid?.thumbnailUrl || uploadedImage}
                alt="Animated Preview"
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isPlaying ? 'scale-110 rotate-1 filter brightness-110' : 'scale-100'
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-4">
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-indigo-600 text-white w-fit">
                  IMAGE TO VIDEO MOTION
                </span>

                <div className="space-y-2">
                  <p className="text-xs text-white font-medium line-clamp-2">
                    "{currentVid?.prompt}"
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => togglePlay(currentVid)}
                      className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-transform active:scale-90"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <span className="text-[11px] font-mono text-gray-300">
                      Voice: {currentVid?.voiceOverName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Animated Image History
            </h3>

            <div className="space-y-2">
              {videoHistory.map((vid) => (
                <div
                  key={vid.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50"
                >
                  <div className="flex items-center gap-3">
                    <img src={vid.thumbnailUrl} alt={vid.prompt} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{vid.prompt}</p>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">{vid.cameraMotion} • {vid.timestamp}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePlay(vid)}
                    className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
