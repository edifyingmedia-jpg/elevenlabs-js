import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Sliders, 
  Sparkles, 
  Send, 
  FileText, 
  Code, 
  Check, 
  Zap,
  Volume2,
  RefreshCw
} from 'lucide-react';
import { ConversationalAgent, Voice } from '../types';
import { MOCK_CONVERSATIONAL_AGENTS, MOCK_VOICES } from '../data/mockVoices';
import { speakText, stopSpeech } from '../utils/audioSynthesizer';

interface ConversationalAIProps {
  voices: Voice[];
}

export const ConversationalAI: React.FC<ConversationalAIProps> = ({ voices }) => {
  const [agents, setAgents] = useState<ConversationalAgent[]>(MOCK_CONVERSATIONAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<ConversationalAgent>(MOCK_CONVERSATIONAL_AGENTS[0]);

  // Agent Config Form State
  const [systemPrompt, setSystemPrompt] = useState<string>(selectedAgent.systemPrompt);
  const [firstMessage, setFirstMessage] = useState<string>(selectedAgent.firstMessage);
  const [assignedVoiceId, setAssignedVoiceId] = useState<string>(selectedAgent.voiceId);

  // Live Interactive Testing Sandbox State
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'agent'; text: string }[]>([]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [isAgentThinking, setIsAgentThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Sync state when agent changes
  useEffect(() => {
    setSystemPrompt(selectedAgent.systemPrompt);
    setFirstMessage(selectedAgent.firstMessage);
    setAssignedVoiceId(selectedAgent.voiceId);
  }, [selectedAgent]);

  const handleStartSession = () => {
    setIsSessionActive(true);
    setChatMessages([
      { sender: 'agent', text: firstMessage }
    ]);
    setIsSpeaking(true);
    speakText(firstMessage, selectedAgent.voiceName, 'Female', 1.0, 1.0, () => setIsSpeaking(false));
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    stopSpeech();
    setIsSpeaking(false);
    setChatMessages([]);
  };

  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setInputMsg('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    setIsAgentThinking(true);
    try {
      const res = await fetch('/api/ai/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          message: userText
        })
      });
      const data = await res.json();
      const replyText = data.reply || "I'm processing your request. How else can I assist?";

      setIsAgentThinking(false);
      setChatMessages((prev) => [...prev, { sender: 'agent', text: replyText }]);

      // Speak agent reply out loud
      setIsSpeaking(true);
      speakText(replyText, selectedAgent.voiceName, 'Female', 1.0, 1.0, () => setIsSpeaking(false));
    } catch (err) {
      console.error('Agent chat error:', err);
      setIsAgentThinking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-500" />
          Conversational AI Voice Agents
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Build and deploy real-time voice agents powered by AppNyormal low-latency voice models and LLM intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Agent Builder & Settings */}
        <div className="lg:col-span-5 space-y-5">
          {/* Agent Picker List */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Select Agent Profile</h3>
            <div className="space-y-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left ${
                    selectedAgent.id === agent.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-500/40 text-indigo-900 dark:text-indigo-200'
                      : 'bg-gray-50 dark:bg-[#111622] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <img src={agent.avatar} alt={agent.name} className="w-9 h-9 rounded-lg object-cover" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-xs truncate">{agent.name}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{agent.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Config Editor */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Agent Settings</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">System Prompt</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full h-24 p-3 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">First Greeting Message</label>
              <input
                type="text"
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Voice Persona</label>
              <select
                value={assignedVoiceId}
                onChange={(e) => setAssignedVoiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} ({v.accent})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Live Interactive Voice Agent Orb Sandbox */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col justify-between min-h-[500px]">
            {/* Header Status */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">{selectedAgent.name}</h3>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`}></span>
                    <span className="text-gray-500 dark:text-gray-400 font-mono">
                      {isSessionActive ? 'Live WebSocket Active (165ms latency)' : 'Session Standby'}
                    </span>
                  </div>
                </div>
              </div>

              {!isSessionActive ? (
                <button
                  id="conversational-agent-start-session-btn"
                  onClick={handleStartSession}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
                >
                  Test Agent Live
                </button>
              ) : (
                <button
                  id="conversational-agent-end-session-btn"
                  onClick={handleEndSession}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md transition-all"
                >
                  End Call
                </button>
              )}
            </div>

            {/* Glowing Interactive Audio Orb Canvas */}
            <div className="my-6 flex flex-col items-center justify-center space-y-4">
              <div className="relative flex items-center justify-center">
                {/* Outer pulsing ring */}
                <div 
                  className={`w-36 h-36 rounded-full transition-all duration-300 ${
                    isSpeaking 
                      ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin opacity-80 blur-md scale-110' 
                      : isSessionActive 
                      ? 'bg-indigo-500/20 blur-sm scale-100' 
                      : 'bg-gray-200 dark:bg-gray-800 opacity-40'
                  }`}
                />

                {/* Core Orb */}
                <div 
                  className={`absolute w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                    isSpeaking 
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-[0_0_30px_rgba(99,102,241,0.6)] scale-105' 
                      : isSessionActive 
                      ? 'bg-indigo-600/90 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 font-mono">
                {isSpeaking ? 'Agent Speaking...' : isAgentThinking ? 'Thinking...' : isSessionActive ? 'Listening to microphone...' : 'Click Test Agent Live to start voice call'}
              </p>
            </div>

            {/* Conversation Messages Stream */}
            <div className="flex-1 max-h-48 overflow-y-auto space-y-2.5 p-3 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs">
              {chatMessages.length === 0 ? (
                <p className="text-center text-gray-400 py-4">Session transcripts will appear here during live calls.</p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-gray-400 font-semibold mb-0.5">
                      {msg.sender === 'user' ? 'You' : selectedAgent.name}
                    </span>
                    <div
                      className={`max-w-[85%] p-2.5 rounded-xl ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-[#151C28] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700/80 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={() => setIsMicActive(!isMicActive)}
                className={`p-2.5 rounded-xl transition-colors ${
                  isMicActive ? 'bg-rose-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
                title="Toggle Mic"
              >
                {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message or speak into mic..."
                disabled={!isSessionActive}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />

              <button
                onClick={handleSendMessage}
                disabled={!isSessionActive || !inputMsg.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
