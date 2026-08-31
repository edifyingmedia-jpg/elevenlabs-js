import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "25mb" }));

const PORT = 3000;

// Initialize Gemini AI on the server side securely
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "AppNyormal AI API" });
});

// AI Script Helper / Prompt Enhancer
app.post("/api/ai/generate-script", async (req, res) => {
  try {
    const { prompt, category, tone } = req.body;
    const ai = getGenAI();
    
    if (!ai) {
      // Fallback response if key is missing or not configured yet
      return res.json({
        script: `Welcome to AppNyormal. In a world where AI transforms creative possibilities, speech synthesis brings storytellers, creators, and developers closer to true emotional realism. ${prompt || 'Experience ultra-realistic voice cloning, text to speech, and conversational AI.'}`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `You are AppNyormal AI Copywriter. Generate a high quality, natural-sounding voice sample script for text-to-speech audio generation based on this topic: "${prompt || 'AI voice generation'}". Category: ${category || 'Expressive Narrative'}. Tone: ${tone || 'engaging and smooth'}. Keep it concise (30-80 words), highly articulate, suitable for testing voice timbre, stability, and emotional cadence.`,
    });

    res.json({ script: response.text || "Failed to generate script." });
  } catch (err: any) {
    console.error("Error generating script:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI script" });
  }
});

// Conversational AI Agent Response Generator
app.post("/api/ai/agent-chat", async (req, res) => {
  try {
    const { systemPrompt, message, history } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        reply: `Hello! I am your AppNyormal Conversational AI Agent. You asked: "${message}". How can I assist your workflow today?`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt || "You are a helpful, conversational AI voice assistant powered by AppNyormal. Respond concisely and naturally in spoken conversational tone (1-3 short sentences max)."
      }
    });

    res.json({ reply: response.text || "I'm listening. How can I assist you?" });
  } catch (err: any) {
    console.error("Error in agent chat:", err);
    res.status(500).json({ error: err.message || "Failed to get agent response" });
  }
});

// Sound Effect Prompt Enhancer
app.post("/api/ai/generate-sfx-description", async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        enhancedPrompt: `${prompt || 'Sci-fi laser beam powering up'}, cinematic audio, high fidelity 96kHz 24-bit studio quality`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Expand this sound effect description into a detailed audio synthesis prompt for AppNyormal Sound Effects Generator: "${prompt}". Describe acoustic dynamics, reverb, frequency sweeps, and texture. Keep it under 2 sentences.`,
    });

    res.json({ enhancedPrompt: response.text || prompt });
  } catch (err: any) {
    res.json({ enhancedPrompt: req.body.prompt });
  }
});

// AI Video Prompt Enhancer
app.post("/api/ai/enhance-video-prompt", async (req, res) => {
  try {
    const { prompt, style } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        enhancedPrompt: `Cinematic high-definition ${style || 'photorealistic'} shot of ${prompt || 'a serene futuristic landscape'}. Smooth slow-motion camera movement, 8k resolution, dramatic cinematic lighting, photorealistic detail.`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Enhance this video generation text prompt for AppNyormal Video model: "${prompt}". Desired style: ${style || 'Cinematic'}. Add rich visual direction, camera motion, depth of field, color grading, and atmospheric details suitable for text-to-video AI. Keep it under 3 sentences.`,
    });

    res.json({ enhancedPrompt: response.text || prompt });
  } catch (err: any) {
    res.json({ enhancedPrompt: req.body.prompt });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AppNyormal AI Server listening at http://localhost:${PORT}`);
  });
}

startServer();
