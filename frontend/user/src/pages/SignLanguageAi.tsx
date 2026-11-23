import React, { useState } from 'react';
import {
  HandMetal,
  Camera,
  Volume2,
  Sparkles,
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const SignLanguageAi: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedText, setDetectedText] = useState('Pain in abdomen after heavy meal (Pitta-Agni Sensation)');
  const [history, setHistory] = useState<string[]>([
    'Pain in abdomen after heavy meal',
    'Feeling dry and dizzy in morning',
    'Need Ayurvedic consultation for joint pain',
  ]);

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window && detectedText) {
      const utterance = new SpeechSynthesisUtterance(detectedText);
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-Speech: ' + detectedText);
    }
  };

  const sampleGestures = [
    'Pain in abdomen after meal',
    'Fever and excessive body heat',
    'Severe headache & lack of sleep',
    'Allergic reaction to dairy',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs text-forest font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Accessible Healthcare Interface</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Sign Language AI Assistant</h1>
        <p className="text-xs text-warm-brown mt-0.5">Translating visual Indian Sign Language (ISL) gestures to spoken voice and text for accessible clinical communication.</p>
      </div>

      {/* Model Transparency Disclaimer */}
      <div className="p-3.5 bg-cream border border-sand rounded-2xl flex items-start gap-3 text-xs text-warm-brown">
        <AlertCircle className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-charcoal">Demonstration Mode:</span> This interface displays real-time gesture synthesis and Indian English text-to-speech. When live camera is toggled, sample medical gestures can be simulated and synthesized for accessibility testing.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Camera View Area (7 Cols) */}
        <div className="md:col-span-7 space-y-4">
          <Card className="p-0 overflow-hidden bg-charcoal text-ivory relative aspect-video flex flex-col items-center justify-center">
            {isCameraActive ? (
              <div className="w-full h-full bg-forest/40 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <span className="w-3 h-3 rounded-full bg-state-error animate-ping" />
                <p className="text-xs font-semibold text-ivory">Camera Stream Active (Simulated Model Feed)</p>
                <div className="border border-sand/40 rounded-xl p-4 w-48 h-32 flex items-center justify-center text-sand text-xs border-dashed">
                  Hand Gesture Detection Zone
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-3 text-ivory/80">
                <Camera className="w-12 h-12 mx-auto text-sand/60" />
                <p className="text-xs">Camera feed inactive. Click below to initialize camera recognition.</p>
              </div>
            )}
          </Card>

          <div className="flex gap-3">
            <Button onClick={toggleCamera} className="flex-1" leftIcon={<Camera className="w-4 h-4" />}>
              {isCameraActive ? 'Stop Camera Feed' : 'Initialize Camera Feed'}
            </Button>
            <Button variant="outline" onClick={handleSpeak} leftIcon={<Volume2 className="w-4 h-4" />}>
              Speak Aloud
            </Button>
          </div>
        </div>

        {/* Translation Output & History (5 Cols) */}
        <div className="md:col-span-5 space-y-5">
          <Card className="p-5 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-warm-brown">Live Translated Speech</span>
              <Badge variant="success" size="sm">94.8% Match</Badge>
            </div>
            <p className="text-sm font-semibold text-charcoal leading-relaxed p-3 bg-ivory rounded-xl border border-soft-beige">
              "{detectedText}"
            </p>
            <Button size="sm" variant="ghost" onClick={handleSpeak} className="w-full" leftIcon={<Volume2 className="w-3.5 h-3.5" />}>
              Play Text-to-Speech
            </Button>
          </Card>

          {/* Test Gesture Samples */}
          <Card className="p-5 space-y-3 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Simulate Gesture Signals</h3>
            <div className="space-y-1.5">
              {sampleGestures.map((gesture, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDetectedText(gesture);
                    setHistory([gesture, ...history]);
                  }}
                  className="w-full p-2 text-left rounded-lg bg-cream/50 hover:bg-cream border border-soft-beige text-xs text-charcoal flex items-center justify-between transition-colors"
                >
                  <span>{gesture}</span>
                  <Play className="w-3 h-3 text-forest" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
