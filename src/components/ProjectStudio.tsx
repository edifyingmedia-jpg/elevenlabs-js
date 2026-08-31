import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Play, 
  Pause, 
  BookOpen, 
  User, 
  Download, 
  Sparkles, 
  Trash2,
  Check
} from 'lucide-react';
import { StudioProject, ProjectParagraph, Voice } from '../types';
import { speakText, stopSpeech } from '../utils/audioSynthesizer';

interface ProjectsStudioProps {
  voices: Voice[];
}

export const ProjectsStudio: React.FC<ProjectsStudioProps> = ({ voices }) => {
  const [projectTitle, setProjectTitle] = useState('Chapter 1: The Quantum Horizon');
  const [paragraphs, setParagraphs] = useState<ProjectParagraph[]>([
    {
      id: 'p-1',
      speakerId: voices[0]?.id || 'rachel-v1',
      voiceName: voices[0]?.name || 'Rachel',
      text: 'The sun set quietly beyond the neon spires of the city, casting long indigo shadows across the harbor.',
      status: 'ready'
    },
    {
      id: 'p-2',
      speakerId: voices[1]?.id || 'adam-v1',
      voiceName: voices[1]?.name || 'Adam',
      text: '"We have less than twenty minutes before the quantum buffer resets," Marcus warned, adjusting his interface glasses.',
      status: 'ready'
    }
  ]);

  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number | null>(null);

  const handleAddParagraph = () => {
    const defaultVoice = voices[0] || { id: 'rachel-v1', name: 'Rachel' };
    setParagraphs([
      ...paragraphs,
      {
        id: `p-${Date.now()}`,
        speakerId: defaultVoice.id,
        voiceName: defaultVoice.name,
        text: 'Enter next paragraph dialogue or narrative text...',
        status: 'ready'
      }
    ]);
  };

  const handleUpdateParagraphText = (id: string, newText: string) => {
    setParagraphs(paragraphs.map(p => p.id === id ? { ...p, text: newText } : p));
  };

  const handleUpdateParagraphVoice = (id: string, voiceId: string) => {
    const v = voices.find(x => x.id === voiceId);
    setParagraphs(paragraphs.map(p => p.id === id ? { ...p, speakerId: voiceId, voiceName: v ? v.name : 'Speaker' } : p));
  };

  const handleDeleteParagraph = (id: string) => {
    setParagraphs(paragraphs.filter(p => p.id !== id));
  };

  const handlePlayParagraph = (index: number) => {
    const p = paragraphs[index];
    setCurrentParagraphIndex(index);
    speakText(p.text, p.voiceName, 'Female', 1.0, 1.0, () => setCurrentParagraphIndex(null));
  };

  const handleRenderFullProject = () => {
    setIsPlayingAll(true);
    let idx = 0;
    const playNext = () => {
      if (idx >= paragraphs.length) {
        setIsPlayingAll(false);
        setCurrentParagraphIndex(null);
        return;
      }
      const p = paragraphs[idx];
      setCurrentParagraphIndex(idx);
      speakText(p.text, p.voiceName, 'Female', 1.0, 1.0, () => {
        idx++;
        playNext();
      });
    };
    playNext();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            Projects & Audiobook Studio Editor
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Build multi-character audiobooks, podcast episodes, and long-form articles with paragraph-level voice casting.
          </p>
        </div>

        <button
          onClick={handleRenderFullProject}
          disabled={isPlayingAll}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          <span>{isPlayingAll ? 'Playing Full Audiobook...' : 'Render & Play Full Studio Project'}</span>
        </button>
      </div>

      {/* Project Outline Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="font-extrabold text-base bg-transparent text-gray-900 dark:text-white focus:outline-none border-b border-transparent focus:border-indigo-500"
          />
          <span className="text-xs text-gray-400 font-mono">{paragraphs.length} Paragraphs</span>
        </div>

        {/* Paragraphs List */}
        <div className="space-y-4">
          {paragraphs.map((p, idx) => {
            const isPlayingThis = currentParagraphIndex === idx;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isPlayingThis
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500 shadow-md'
                    : 'bg-gray-50 dark:bg-[#111622] border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono text-[11px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <select
                      value={p.speakerId}
                      onChange={(e) => handleUpdateParagraphVoice(p.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-700 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                    >
                      {voices.map((v) => (
                        <option key={v.id} value={v.id}>
                          Voice: {v.name} ({v.gender})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayParagraph(idx)}
                      className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-semibold flex items-center gap-1"
                    >
                      {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlayingThis ? 'Playing' : 'Preview'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteParagraph(p.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={p.text}
                  onChange={(e) => handleUpdateParagraphText(p.id, e.target.value)}
                  className="w-full p-3 rounded-lg bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white resize-none focus:outline-none focus:border-indigo-500"
                  rows={2}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={handleAddParagraph}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 font-bold text-xs text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Next Paragraph / Speaker
        </button>
      </div>
    </div>
  );
};
