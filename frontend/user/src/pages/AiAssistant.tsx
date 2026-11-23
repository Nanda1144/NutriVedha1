import React, { useState } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  User,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ChatMessage } from '../types';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Namaste! I am your Vaidya AI health assistant. You can ask me regarding Ayurvedic herbs, dosha characteristics, Agni digestion, or seasonal Ritucharya practices. How may I assist your wellbeing today?',
      timestamp: '10:00 AM',
      suggestedActions: [
        { label: 'How to soothe elevated Pitta?', route: '/diet' },
        { label: 'Best herbs for sound sleep', route: '/marketplace' },
        { label: 'Explain Kitchari benefits', route: '/recipes' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1000));

    const t = text.toLowerCase();
    let reply = 'In classical Ayurveda, health is rooted in balanced digestive Agni and harmonious Tridoshas. For optimal vitality, prioritize whole seasonal foods, warm herbal waters, and mindful sleep routines.';
    
    if (t.includes('pitta') || t.includes('heat') || t.includes('burn')) {
      reply = 'To balance Pitta: emphasize cooling, sweet, and bitter foods such as fresh cucumber, amla, coconut water, and pure A2 ghee. Avoid pungent chilies, mustard, and excessive afternoon sun.';
    } else if (t.includes('sleep') || t.includes('insomnia') || t.includes('stress')) {
      reply = 'For restful sleep, calm Vata dosha in the evening. Warm almond milk infused with 1/2 tsp organic Ashwagandha, crushed green cardamom, and a pinch of nutmeg consumed 45 minutes before bed aids deep restorative delta sleep.';
    } else if (t.includes('kitchari')) {
      reply = 'Tridoshic Kitchari combines yellow split moong dal with aged basmati rice, cumin, and ghee. It is the premier therapeutic meal in Panchakarma because it requires minimal digestive expenditure while nourishing all bodily tissues (Dhatus).';
    }

    const assistantMsg: ChatMessage = {
      id: 'msg_' + (Date.now() + 1),
      sender: 'assistant',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist your health journey today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-forest font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-forest" />
            <span>Classical Ayurvedic Conversational AI</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Vaidya AI Health Assistant</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClear} leftIcon={<Trash2 className="w-4 h-4" />}>
          Clear Chat
        </Button>
      </div>

      {/* Safety Notice */}
      <div className="p-3 bg-state-warning/10 border border-state-warning/30 rounded-xl text-xs text-[#8A6118] flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-[#A9761F] shrink-0" />
        <span>Vaidya AI provides educational guidance. For medical emergencies or acute symptoms, consult a licensed doctor.</span>
      </div>

      {/* Chat Window Container */}
      <Card className="h-[600px] flex flex-col justify-between p-0 overflow-hidden bg-white">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-forest text-ivory flex items-center justify-center shrink-0">
                  <BotMessageSquare className="w-4 h-4 text-sand" />
                </div>
              )}

              <div
                className={`max-w-lg rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-forest text-ivory rounded-tr-none'
                    : 'bg-cream/60 text-charcoal border border-soft-beige rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span className={`block text-[10px] ${m.sender === 'user' ? 'text-ivory/60' : 'text-warm-brown'}`}>
                  {m.timestamp}
                </span>

                {m.suggestedActions && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {m.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action.label)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-sand text-forest text-[11px] font-semibold hover:bg-cream transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-sand text-forest flex items-center justify-center font-bold text-xs shrink-0">
                  U
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-warm-brown italic">
              <BotMessageSquare className="w-4 h-4 animate-spin text-forest" />
              <span>Vaidya AI is analyzing classical botanical references...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-soft-beige bg-ivory/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask regarding Ayurvedic herbs, digestion, doshas, sleep..."
              className="flex-1 rounded-xl border border-soft-beige bg-white px-4 py-2.5 text-xs text-charcoal placeholder-warm-brown/60 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest"
            />
            <Button type="submit" size="md" rightIcon={<Send className="w-4 h-4" />}>
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
