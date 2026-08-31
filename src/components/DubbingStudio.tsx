import React, { useState } from 'react';
import { 
  Globe, 
  Upload, 
  Play, 
  Pause, 
  Check, 
  RefreshCw, 
  Video, 
  Subtitles, 
  Languages,
  Sparkles
} from 'lucide-react';
import { DubbingProject } from '../types';

export const DubbingStudio: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<string>('English');
  const [targetLang, setTargetLang] = useState<string>('Spanish');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [projects, setProjects] = useState<DubbingProject[]>([
    {
      id: 'dub-1',
      title: 'Product Launch Keynote Presentation.mp4',
      sourceLang: 'English',
      targetLang: 'Japanese',
      status: 'completed',
      timestamp: '2 hours ago',
      speakersCount: 3
    },
    {
      id: 'dub-2',
      title: 'AI Engineering Workshop Series - Ep 01',
      sourceLang: 'English',
      targetLang: 'Spanish',
      status: 'completed',
      timestamp: '1 day ago',
      speakersCount: 2
    }
  ]);

  const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin', 'Portuguese', 'Italian', 'Polish', 'Hindi', 'Korean'];

  const handleCreateDubbing = async () => {
    setIsProcessing(true);
    setIsCompleted(false);

    await new Promise((res) => setTimeout(res, 1500));

    const newProject: DubbingProject = {
      id: `dub-${Date.now()}`,
      title: videoUrl ? videoUrl : 'Uploaded_Video_Presentation.mp4',
      sourceLang,
      targetLang,
      status: 'completed',
      timestamp: 'Just now',
      speakersCount: 2
    };

    setIsProcessing(false);
    setIsCompleted(true);
    setProjects([newProject, ...projects]);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-indigo-500" />
          AI Video Dubbing & Multi-Lingual Translator
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Automatically translate and dub videos or audio files into 29+ languages while cloning speaker voices and maintaining original background audio tracks.
        </p>
      </div>

      {/* Main Form & Setup Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-lg space-y-5">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">New Dubbing Project</h3>

        {/* Source File or URL Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Video / Audio File Upload</label>
            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 rounded-xl cursor-pointer bg-gray-50 dark:bg-[#111622] p-4 text-center">
              <Upload className="w-5 h-5 text-indigo-500 mb-1" />
              <p className="font-semibold text-xs text-gray-800 dark:text-gray-200">Upload Video / Audio File</p>
              <p className="text-[10px] text-gray-400">MP4, MOV, MP3 up to 500MB</p>
              <input type="file" accept="video/*,audio/*" className="hidden" />
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Or YouTube / Video URL</label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-gray-400 pt-1">Supports YouTube, Vimeo, Google Drive video links.</p>
          </div>
        </div>

        {/* Languages Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Source Language</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
            >
              <option value="Auto Detect">Auto Detect Speaker Language</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Target Language (Dubbed)</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          id="dubbing-create-btn"
          onClick={handleCreateDubbing}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Translating & Cloned Dubbing Video...</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              <span>Create Dubbed Video ({sourceLang} → {targetLang})</span>
            </>
          )}
        </button>
      </div>

      {/* Dubbed Projects History */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Dubbed Video Projects</h3>
        <div className="space-y-2">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">{proj.title}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    {proj.sourceLang} → <span className="text-indigo-600 dark:text-indigo-400 font-bold">{proj.targetLang}</span> • {proj.speakersCount} Speakers Detected • {proj.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Completed
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500">
                  Play Dub
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
