import React, { useState, useEffect, useRef } from 'react';
import { ForeignLearner, ChatMessage, UserProfile } from '../types';
import { appStorage } from '../lib/storage';
import { sound } from '../lib/sound';
import { generateLearnerResponse, translateText } from '../lib/gemini';
import confetti from 'canvas-confetti';
import {
  Send,
  Clock,
  Wallet,
  ArrowLeft,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  X,
  Smile,
  ShieldCheck
} from 'lucide-react';

interface ChatScreenProps {
  learner: ForeignLearner;
  user: UserProfile;
  onBack: () => void;
  onFinishSession: () => void;
  lang: 'sw' | 'en';
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  learner,
  user,
  onBack,
  onFinishSession,
  lang
}) => {
  // Timer State (default 10 minutes = 600 seconds)
  const totalDuration = learner.sessionDurationSeconds || 600;
  const [secondsRemaining, setSecondsRemaining] = useState(totalDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  // Sound & Translation tools
  const [soundActive, setSoundActive] = useState(true);
  const [showTranslator, setShowTranslator] = useState(false);
  const [translateInput, setTranslateInput] = useState('');
  const [translateOutput, setTranslateOutput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'learner',
      text: learner.defaultFirstMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLearnerTyping, setIsLearnerTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Real-time accumulating earnings meter
  const elapsedSeconds = totalDuration - secondsRemaining;
  const earnedCurrentSession = Math.min(
    learner.payPer10Min,
    Math.round((elapsedSeconds / totalDuration) * learner.payPer10Min)
  );

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLearnerTyping]);

  // Timer Tick
  useEffect(() => {
    if (!isTimerRunning || isCompleted) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerCompletion();
          return 0;
        }
        if (prev === 30) {
          sound.playTimerWarning();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isCompleted]);

  // Session completion trigger
  const triggerCompletion = () => {
    setIsCompleted(true);
    setIsTimerRunning(false);
    sound.playSuccessFanfare();

    // Credit full reward into user wallet
    appStorage.creditReward(learner.payPer10Min);

    // Save session record
    appStorage.saveSession({
      id: 'sess-' + Math.random().toString(36).substring(2, 9),
      learnerId: learner.id,
      learnerName: learner.name,
      learnerAvatar: learner.avatarUrl,
      learnerCountry: learner.country,
      learnerFlag: learner.flag,
      startedAt: new Date(Date.now() - totalDuration * 1000).toISOString(),
      durationSeconds: totalDuration,
      earnedTzs: learner.payPer10Min,
      status: 'completed',
      messagesCount: messages.length
    });

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }
  };

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || isCompleted) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 8),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    sound.playMessageSent();

    // Trigger learner typing state
    setIsLearnerTyping(true);

    try {
      // Natural delay of 1.2s to 2.5s for authentic typing feel
      const typingDelay = Math.floor(Math.random() * 800) + 1200;
      await new Promise(r => setTimeout(r, typingDelay));

      const reply = await generateLearnerResponse(learner, text, messages);

      const learnerMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).substring(2, 8),
        sender: 'learner',
        text: reply.text,
        translation: reply.translation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, learnerMsg]);
      sound.playMessageReceived();
    } catch {
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).substring(2, 8),
        sender: 'learner',
        text: `Asante sana kwa kunielekeza vizuri! Ninafurahi sana kujifunza na wewe leo.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
      sound.playMessageReceived();
    } finally {
      setIsLearnerTyping(false);
    }
  };

  const handleTranslate = async (direction: 'sw-to-en' | 'en-to-sw') => {
    if (!translateInput.trim()) return;
    setIsTranslating(true);
    try {
      const res = await translateText(translateInput, direction);
      setTranslateOutput(res);
    } catch {
      setTranslateOutput('Imeshindwa kutafsiri sasa hivi.');
    } finally {
      setIsTranslating(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Quick suggested response chips for tutor
  const suggestedReplies = [
    `Habari yako pia! Karibu sana Tanzania!`,
    `Hiyo inatamkwa kwa kusema: "Asante sana".`,
    `Unaweza kusema: "Bei gani hii?" ukitaka kuuliza sokoni.`,
    `Safi sana, umeanza vizuri sana!`,
    `Una swali lolote jingine kuhusu maneno ya Kiswahili?`
  ];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-6 flex flex-col h-[calc(100vh-80px)] min-h-[580px] pb-16 sm:pb-6">
      
      {/* 1. ROOM HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 sm:p-4 mb-3 flex items-center justify-between shrink-0">
        
        {/* Left: Back & Learner Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Rudi Nyuma"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={learner.avatarUrl}
              alt={learner.name}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 text-base">{learner.flag}</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                {learner.name}
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {learner.profession} · <span className="text-[#0066FF] font-semibold">{learner.country}</span>
            </p>
          </div>
        </div>

        {/* Right: Countdown & Current Earning Meter */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Audio toggle */}
          <button
            onClick={() => {
              const next = !soundActive;
              setSoundActive(next);
              sound.setEnabled(next);
            }}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title={soundActive ? 'Zima Sauti' : 'Washa Sauti'}
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-[#0066FF]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Translator toggle */}
          <button
            onClick={() => setShowTranslator(!showTranslator)}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs font-semibold ${
              showTranslator
                ? 'bg-blue-50 border-blue-300 text-[#0066FF]'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Msaada wa Tafsiri (Translator)"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">Tafsiri</span>
          </button>

          {/* Countdown & Earnings Pill */}
          <div className="flex items-center gap-2 bg-slate-900 text-white py-1.5 px-3 rounded-xl shadow-xs">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-right">
              <div className="text-xs sm:text-sm font-extrabold font-mono tracking-wider">
                {formatTime(secondsRemaining)}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono font-bold leading-none">
                +TZS {earnedCurrentSession.toLocaleString()}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 2. TRANSLATOR DRAWER (IF OPEN) */}
      {showTranslator && (
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3 mb-3 shrink-0 text-xs text-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-[#0052CC]">
              <Languages className="w-4 h-4" />
              <span>Msaada wa Tafsiri ya Haraka (Bilingual Dictionary)</span>
            </div>
            <button onClick={() => setShowTranslator(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={translateInput}
              onChange={e => setTranslateInput(e.target.value)}
              placeholder="Andika neno la Kiswahili au Kiingereza hapa..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-xs outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => handleTranslate('sw-to-en')}
              disabled={isTranslating}
              className="bg-[#0066FF] text-white px-2.5 py-1.5 rounded-lg font-bold hover:bg-[#0052CC] transition-colors"
            >
              SW → EN
            </button>
            <button
              onClick={() => handleTranslate('en-to-sw')}
              disabled={isTranslating}
              className="bg-slate-800 text-white px-2.5 py-1.5 rounded-lg font-bold hover:bg-slate-700 transition-colors"
            >
              EN → SW
            </button>
          </div>

          {translateOutput && (
            <div className="mt-2 p-2 bg-white rounded-lg border border-blue-100 text-slate-700 font-medium">
              💡 {translateOutput}
            </div>
          )}
        </div>
      )}

      {/* 3. MESSAGES CHAT AREA */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 overflow-y-auto space-y-4">
        
        {/* Session Welcome Banner */}
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs px-3 py-1 rounded-full font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Kipindi cha Mazungumzo Kimeanza · Dakika 10 zinalipa TZS {learner.payPer10Min.toLocaleString()}</span>
          </div>
        </div>

        {/* Messages */}
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <img
                  src={learner.avatarUrl}
                  alt={learner.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mb-1"
                />
              )}

              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#0066FF] text-white rounded-br-2xs shadow-xs'
                    : 'bg-slate-100 text-slate-900 rounded-bl-2xs border border-slate-200/60 shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                {/* Optional translation footnote for learner */}
                {msg.translation && (
                  <p className="mt-1.5 pt-1.5 border-t border-slate-200 text-[11px] text-slate-500 italic">
                    🇬🇧 {msg.translation}
                  </p>
                )}

                <div
                  className={`text-[10px] mt-1 text-right ${
                    isUser ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLearnerTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <img
              src={learner.avatarUrl}
              alt={learner.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <div className="bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-500 ml-1 font-medium">{learner.name} anaandika...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. SUGGESTED RAPID PROMPT CHIPS */}
      {!isCompleted && (
        <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#0066FF]" /> Majibu ya Haraka:
          </span>
          {suggestedReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(reply)}
              className="shrink-0 text-[11px] bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 py-1 px-2.5 rounded-full transition-colors cursor-pointer"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* 5. INPUT BAR */}
      <div className="shrink-0 bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={isCompleted || isLearnerTyping}
            placeholder={
              isCompleted
                ? 'Mazungumzo yamekamilika!'
                : `Mfundishe ${learner.name} kwa Kiswahili... (Andika ujumbe wako)`
            }
            className="flex-1 px-4 py-2.5 rounded-xl border border-transparent focus:border-[#0066FF] focus:bg-slate-50 text-xs sm:text-sm text-slate-900 outline-hidden transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isCompleted || isLearnerTyping}
            className="bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs"
            title="Tuma Ujumbe"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* 6. COMPLETION CELEBRATION MODAL */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8 space-y-4">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                MAZUNGUMZO YAMEKAMILIKA!
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Hongera Sana!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Umekamilisha dakika 10 za kufundisha Kiswahili na {learner.name}. Kipindi kimerekodiwa kwa mafanikio.
              </p>
            </div>

            {/* Payout Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-800">
                Zawadi ya Kipindi Hiki:
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-600 mt-1">
                +TZS {learner.payPer10Min.toLocaleString()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={onBack}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer"
              >
                CHAGUA MZUNGU MWINGINE (FUNDISHA TENA)
              </button>

              <button
                onClick={onFinishSession}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-colors text-xs cursor-pointer"
              >
                Rudi Nyumbani
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
