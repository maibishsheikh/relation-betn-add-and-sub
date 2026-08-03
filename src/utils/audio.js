import { audioMap } from './audioMap';

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';
const elevenLabsCache = {};

export async function getAudioUrl(text, style = 'statement') {
  // 1. Check pre-generated map first
  if (audioMap && audioMap[text]) {
    return audioMap[text];
  }

  // 2. Check runtime cache
  if (elevenLabsCache[text]) {
    return elevenLabsCache[text];
  }

  // 3. Dynamic generation (no key = silent skip)
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) {
    return null;
  }

  const voiceSettings = {
    statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.10 },
    question:      { stability: 0.55, similarity_boost: 0.85, style: 0.25 },
    encouragement: { stability: 0.45, similarity_boost: 0.90, style: 0.45 },
    emphasis:      { stability: 0.80, similarity_boost: 0.80, style: 0.05 },
    thinking:      { stability: 0.70, similarity_boost: 0.75, style: 0.20 },
    celebration:   { stability: 0.35, similarity_boost: 0.95, style: 0.60 },
  }[style] ?? { stability: 0.65, similarity_boost: 0.80, style: 0.10 };

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: voiceSettings,
      }),
    });

    if (!res.ok) {
      return null;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    elevenLabsCache[text] = url;
    return url;
  } catch (e) {
    console.error('ElevenLabs generation failed:', e);
    return null;
  }
}

let activeAudio = null;

export async function speak(text, style = 'statement') {
  if (!text) return;
  const url = await getAudioUrl(text, style);
  if (!url) return;

  // Stop any active audio
  if (activeAudio) {
    try {
      activeAudio.pause();
    } catch (_) {}
  }

  return new Promise((resolve) => {
    const audio = new Audio(url);
    activeAudio = audio;
    audio.onended = () => {
      if (activeAudio === audio) activeAudio = null;
      resolve();
    };
    audio.onerror = () => {
      if (activeAudio === audio) activeAudio = null;
      resolve();
    };
    audio.play().catch(() => {
      // Browser blocked autoplay — resolve anyway so narrative proceeds
      resolve();
    });
  });
}

export async function narrate(segments) {
  if (!segments || segments.length === 0) return;
  // Eager preload next segment while current plays
  for (let i = 0; i < segments.length; i++) {
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style);
    }
    await speak(segments[i].text, segments[i].style);
  }
}

export function stopNarration() {
  if (activeAudio) {
    try {
      activeAudio.pause();
    } catch (_) {}
    activeAudio = null;
  }
}
