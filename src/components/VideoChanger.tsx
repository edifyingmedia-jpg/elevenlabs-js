import React, { useState, useRef } from 'react';
import { 
  AudioWaveform, 
  Upload, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Sparkles, 
  Sliders, 
  Check, 
  ChevronRight,
  RefreshCw,
  Volume2
} from 'lucide-react';
import { Voice } from '../types';
import { speakText, stopSpeech } from '../utils/audioSynthesizer';

interface VoiceChangerProps {
  selectedVoice: Voice;
  onOpenVoiceSelector: () => void;
}

export const VoiceChanger: React.FC<VoiceChangerProps> = ({
  selectedVoice,
  onOpenVoiceSelector,
}) => {
  const [audioSource, setAudioSource] = useState<'upload' | 'mic'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedTime, setRecordedTime] = useState<number>(0);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [converted, setConverted] = useState<boolean>(false);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState<boolean>(false);
  const [isPlayingConverted, setIsPlayingConverted] = useState<boolean>(false);

  // Settings
  const [removeNoise, setRemoveNoise] = useState<boolean>(true);
  const [pitchShift, setPitchShift] = useState<number>(0);
  const [expressiveness, setExpressiveness] = useState<number>(85);

  const timerRef = useRef<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setConverted(false);
    }
  };

  const startMicRecording = () => {
    setIsRecording(true);
    setRecordedTime(0);
    setConverted(false);
    timerRef.current = setInterval(() => {
      setRecordedTime((prev) => prev + 1);
    }, 1000);
  };

  const stopMicRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setFileName('Recorded_Audio_Sample.wav');
  };

  const handleConvert = async () => {
    setIsConverting(true);
    setConverted(false);
    await new Promise((res) => setTimeout(res, 1200));
    setIsConverting(false);
    setConverted(true);
  };

  const sampleConvertedText = `This is your voice converted using ${selectedVoice.name}'s voice timbre. The acoustic frequency, pitch inflections, and emotional cadence have been cloned perfectly.`;

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AudioWaveform className="w-6 h-6 text-indigo-500" />
            Speech to Speech (Voice Changer)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Transform the voice in any audio recording into another voice while preserving natural emotion, timing, and pauses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Audio Input & Voice Selector */}
        <div className="lg:col-span-2 space-y-5">
          {/* Input Source Tabs */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <button
                id="voice-changer-tab-upload"
                onClick={() => setAudioSource('upload')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  audioSource === 'upload'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Audio File</span>
              </button>
              <button
                id="voice-changer-tab-mic"
                onClick={() => setAudioSource('mic')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  audioSource === 'mic'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Record Microphone</span>
              </button>
            </div>

            {/* Upload Area */}
            {audioSource === 'upload' && (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 rounded-xl cursor-pointer bg-gray-50 dark:bg-[#111622] transition-colors p-6 text-center">
                <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                <p className="font-semibold text-xs text-gray-800 dark:text-gray-200">
                  {fileName ? `Loaded: ${fileName}` : 'Drop audio file here, or browse'}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Supports MP3, WAV, M4A, FLAC (Up to 50MB)</p>
                <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}

            {/* Mic Recorder Area */}
            {audioSource === 'mic' && (
              <div className="flex flex-col items-center justify-center h-48 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#111622] p-6 text-center space-y-3">
                <div className={`p-4 rounded-full transition-all ${isRecording ? 'bg-rose-500/20 text-rose-500 animate-pulse' : 'bg-indigo-500/10 text-indigo-500'}`}>
                  <Mic className="w-8 h-8" />
                </div>
                {isRecording ? (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-rose-500 font-bold">Recording... {recordedTime}s</p>
                    <button
                      onClick={stopMicRecording}
                      className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-2 mx-auto"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" /> Stop Recording
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-semibold text-xs text-gray-800 dark:text-gray-200">
                      {fileName ? `Recorded Sample (${fileName})` : 'Click to start recording your voice'}
                    </p>
                    <button
                      onClick={startMicRecording}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-md"
                    >
                      <Mic className="w-3.5 h-3.5" /> Start Recording
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Target Voice Selector Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedVoice.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={selectedVoice.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Target Voice</span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{selectedVoice.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedVoice.category} • {selectedVoice.accent}</p>
              </div>
            </div>

            <button
              id="voice-changer-select-target-voice"
              onClick={onOpenVoiceSelector}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-indigo-500 border border-transparent transition-all"
            >
              Change Voice
            </button>
          </div>

          {/* Convert Action Button */}
          <button
            id="voice-changer-convert-btn"
            onClick={handleConvert}
            disabled={!fileName || isConverting}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Transforming Vocal Timbre...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Convert Speech to {selectedVoice.name}'s Voice</span>
              </>
            )}
          </button>
        </div>

        {/* Right 1 Col: Settings & Output Player */}
        <div className="space-y-5">
          {/* Conversion Parameters */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-xs text-gray-900 dark:text-white">Acoustic Tuning</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <span>Remove Background Noise</span>
                <input
                  type="checkbox"
                  checked={removeNoise}
                  onChange={(e) => setRemoveNoise(e.target.checked)}
                  className="rounded accent-indigo-600 w-4 h-4"
                />
              </label>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                  <span>Pitch Shift</span>
                  <span className="font-mono text-indigo-500 font-bold">{pitchShift > 0 ? `+${pitchShift}` : pitchShift} semitones</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={pitchShift}
                  onChange={(e) => setPitchShift(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                  <span>Expressiveness</span>
                  <span className="font-mono text-indigo-500 font-bold">{expressiveness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={expressiveness}
                  onChange={(e) => setExpressiveness(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Converted Audio Player Comparison */}
          {converted && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-black border border-indigo-500/30 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" /> Conversion Complete
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Duration: 4.8s</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-white">Converted Output ({selectedVoice.name})</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (isPlayingConverted) {
                        stopSpeech();
                        setIsPlayingConverted(false);
                      } else {
                        setIsPlayingConverted(true);
                        speakText(sampleConvertedText, selectedVoice.name, selectedVoice.gender, 1.0, 1.0, () => setIsPlayingConverted(false));
                      }
                    }}
                    className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-md transition-colors"
                  >
                    {isPlayingConverted ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
