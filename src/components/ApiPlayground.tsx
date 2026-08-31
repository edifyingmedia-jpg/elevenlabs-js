import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Play, 
  Terminal, 
  Key, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const ApiPlayground: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'tts' | 'sfx' | 'voices'>('tts');
  const [selectedLang, setSelectedLang] = useState<'curl' | 'js' | 'python' | 'react'>('js');
  const [voiceId, setVoiceId] = useState('rachel-v1');
  const [promptText, setPromptText] = useState('Welcome to AppNyormal API synthesis');
  const [apiKey, setApiKey] = useState('xi_api_key_eleven_98f420d9...88');
  const [copied, setCopied] = useState(false);
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const getCodeSnippet = () => {
    if (selectedEndpoint === 'tts') {
      if (selectedLang === 'curl') {
        return `curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/${voiceId}" \\
  -H "xi-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "${promptText}",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.75
    }
  }' --output output.mp3`;
      }
      if (selectedLang === 'python') {
        return `from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key="${apiKey}")

audio = client.text_to_speech.convert(
    text="${promptText}",
    voice_id="${voiceId}",
    model_id="eleven_multilingual_v2"
)

with open("output.mp3", "wb") as f:
    f.write(audio)`;
      }
      if (selectedLang === 'react') {
        return `import { useElevenLabs } from '@elevenlabs/react';

export function VoicePlayer() {
  const { generateSpeech, isGenerating } = useElevenLabs();

  const handlePlay = async () => {
    await generateSpeech({
      voiceId: "${voiceId}",
      text: "${promptText}"
    });
  };

  return <button onClick={handlePlay}>Play Speech</button>;
}`;
      }
      return `import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
  apiKey: "${apiKey}"
});

const audioStream = await elevenlabs.generate({
  voice: "${voiceId}",
  text: "${promptText}",
  model_id: "eleven_multilingual_v2"
});`;
    }

    if (selectedEndpoint === 'sfx') {
      if (selectedLang === 'curl') {
        return `curl -X POST "https://api.elevenlabs.io/v1/sound-generation" \\
  -H "xi-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "${promptText}",
    "duration_seconds": 3.5,
    "prompt_influence": 0.75
  }' --output sfx.mp3`;
      }
      return `const audio = await elevenlabs.soundGeneration.generate({
  text: "${promptText}",
  duration_seconds: 3.5
});`;
    }

    return `curl -X GET "https://api.elevenlabs.io/v1/voices" -H "xi-api-key: ${apiKey}"`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTestRequest = async () => {
    setIsTesting(true);
    await new Promise((res) => setTimeout(res, 800));
    setResponseJson(JSON.stringify({
      status: "success",
      code: 200,
      audio_url: "blob:https://api.elevenlabs.io/v1/stream/audio-984.mp3",
      content_type: "audio/mpeg",
      character_cost: promptText.length,
      latency_ms: 142
    }, null, 2));
    setIsTesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Code2 className="w-6 h-6 text-indigo-500" />
          API Playground & Developer SDKs
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Integrate AppNyormal speech synthesis, voice cloning, sound generation, and AI video directly into your application.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Endpoint Parameters */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Select Endpoint</h3>

            <div className="space-y-1">
              {[
                { id: 'tts', label: 'POST /v1/text-to-speech/{voice_id}' },
                { id: 'sfx', label: 'POST /v1/sound-generation' },
                { id: 'voices', label: 'GET /v1/voices' }
              ].map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep.id as any)}
                  className={`w-full p-2.5 rounded-xl font-mono text-xs text-left transition-all ${
                    selectedEndpoint === ep.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-gray-50 dark:bg-[#111622] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {ep.label}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">API Key Header (`xi-api-key`)</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Text Payload</label>
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111622] border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleSendTestRequest}
              disabled={isTesting}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>{isTesting ? 'Sending Request...' : 'Send Test Request'}</span>
            </button>
          </div>
        </div>

        {/* Right 7 Cols: Code Viewer & Output */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-2xl bg-[#0B0F17] border border-gray-800 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                {['curl', 'js', 'python', 'react'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                      selectedLang === lang ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Code Block */}
            <pre className="p-4 rounded-xl bg-[#07090E] border border-gray-900 overflow-x-auto text-xs font-mono text-indigo-300 leading-relaxed">
              <code>{getCodeSnippet()}</code>
            </pre>

            {/* API Response Output Box */}
            {responseJson && (
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  HTTP 200 OK Response
                </span>
                <pre className="p-3 rounded-xl bg-[#07090E] border border-gray-900 text-[11px] font-mono text-emerald-400">
                  <code>{responseJson}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
