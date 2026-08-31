/**
 * AppNyormal Audio Synthesis Engine
 * Provides Web Speech API synthesis + procedural Web Audio SFX generation
 * and real-time canvas waveform visualizer rendering.
 */

// Speech Synthesis Engine
export function speakText(
  text: string,
  voiceName: string,
  gender: 'Male' | 'Female' | 'Non-Binary' = 'Female',
  rate: number = 1.0,
  pitch: number = 1.0,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    if (onEnd) onEnd();
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find matching system voice
  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = voices.find(v => v.name.toLowerCase().includes(voiceName.toLowerCase()));

  if (!selectedVoice) {
    if (gender === 'Female') {
      selectedVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google UK English Female') || v.name.includes('Victoria'));
    } else {
      selectedVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.includes('David') || v.name.includes('George') || v.name.includes('Alex') || v.name.includes('Google US English'));
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  // Adjust pitch & rate
  utterance.rate = Math.min(Math.max(rate, 0.5), 2.0);
  utterance.pitch = Math.min(Math.max(gender === 'Male' ? pitch * 0.85 : pitch * 1.15, 0.5), 2.0);

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Procedural Sound Effect (SFX) Synthesizer using Web Audio API
export function generateProceduralSFX(prompt: string, duration: number = 3.0): void {
  if (typeof window === 'undefined') return;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const lowerPrompt = prompt.toLowerCase();

  // Master Gain & Limiter
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.3, now);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  masterGain.connect(ctx.destination);

  if (lowerPrompt.includes('laser') || lowerPrompt.includes('sci-fi') || lowerPrompt.includes('beam')) {
    // Pitch sweep laser synth
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + Math.min(duration, 0.8));
    osc.connect(masterGain);
    osc.start(now);
    osc.stop(now + Math.min(duration, 0.8));
  } else if (lowerPrompt.includes('thunder') || lowerPrompt.includes('boom') || lowerPrompt.includes('explosion')) {
    // Low frequency rumble + noise burst
    const bufferSize = ctx.sampleRate * Math.min(duration, 4.0);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.8));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + duration);

    noise.connect(filter);
    filter.connect(masterGain);
    noise.start(now);
  } else if (lowerPrompt.includes('magic') || lowerPrompt.includes('chime') || lowerPrompt.includes('spell')) {
    // Arpeggiated sparkling sine chimes
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  } else {
    // Default synth chime riser
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + duration * 0.8);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.4, now + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + duration);
  }
}

// Draw dynamic animated Audio Waveform bars on HTML5 Canvas
export function renderWaveformCanvas(
  canvas: HTMLCanvasElement,
  isPlaying: boolean,
  color: string = '#6366F1'
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let animationFrameId: number;
  let phase = 0;

  const barCount = 48;

  function draw() {
    if (!ctx || !canvas) return;

    // Handle high DPR canvas crispness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;
    const barWidth = Math.max(2, (width / barCount) - 3);

    phase += isPlaying ? 0.08 : 0.02;

    for (let i = 0; i < barCount; i++) {
      const x = i * (barWidth + 3) + 2;
      
      // Calculate animated height
      let barHeight: number;
      if (isPlaying) {
        const sinVal = Math.sin(phase + i * 0.2) * Math.cos(phase * 0.5 + i * 0.1);
        const noise = Math.abs(sinVal);
        barHeight = Math.max(4, noise * (height * 0.8));
      } else {
        // Subtle resting wave
        const sinVal = Math.sin(phase + i * 0.15);
        barHeight = Math.max(3, (Math.abs(sinVal) * 0.25 + 0.1) * (height * 0.5));
      }

      const y = centerY - barHeight / 2;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      if (isPlaying) {
        gradient.addColorStop(0, '#818CF8'); // Cyan-indigo top
        gradient.addColorStop(0.5, '#6366F1'); // Deep purple-indigo
        gradient.addColorStop(1, '#C084FC'); // Neon violet bottom
      } else {
        gradient.addColorStop(0, '#374151');
        gradient.addColorStop(1, '#1F2937');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, barWidth, barHeight, 2);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();
    }

    ctx.restore();
    animationFrameId = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}
