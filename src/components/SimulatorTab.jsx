import React, { useState, useEffect, useRef } from 'react';
import { Mic, Phone, PhoneOff, MessageSquare, AlertCircle, Play, Sparkles, Send, Volume2 } from 'lucide-react';

const LANGUAGE_LOCALES = {
  'Uzbek': { code: 'uz-UZ', ttsLocale: 'tr-TR' }, // Fallback TTS to Turkish for Uzbek approximation in browser
  'English': { code: 'en-US', ttsLocale: 'en-US' },
  'Russian': { code: 'ru-RU', ttsLocale: 'ru-RU' },
  'Turkish': { code: 'tr-TR', ttsLocale: 'tr-TR' },
  'Arabic': { code: 'ar-SA', ttsLocale: 'ar-SA' },
  'German': { code: 'de-DE', ttsLocale: 'de-DE' }
};

// A translation matrix for high-quality mock translation simulation between selected languages
const SAMPLE_TRANSLATIONS = {
  'uz-UZ': {
    'en-US': {
      'salom': 'hello', 'qandaysiz': 'how are you', 'yaxshiman': 'i am fine', 'ishlar qalay': 'how is work',
      'yordam kerak': 'i need help', 'rahmat': 'thank you', 'xayr': 'goodbye', 'u uchrashuv qachon': 'when is the meeting'
    },
    'ru-RU': {
      'salom': 'привет', 'qandaysiz': 'как дела', 'yaxshiman': 'я в порядке', 'ishlar qalay': 'как работа',
      'yordam kerak': 'мне нужна помощь', 'rahmat': 'спасибо', 'xayr': 'до свидания', 'u uchrashuv qachon': 'когда встреча'
    },
    'tr-TR': {
      'salom': 'merhaba', 'qandaysiz': 'nasılsınız', 'yaxshiman': 'iyiyim', 'ishlar qalay': 'işler nasıl',
      'yordam kerak': 'yardım lazım', 'rahmat': 'teşekkürler', 'xayr': 'hoşça kal', 'u uchrashuv qachon': 'toplantı ne zaman'
    }
  },
  'en-US': {
    'uz-UZ': {
      'hello': 'salom', 'how are you': 'qandaysiz', 'i am fine': 'yaxshiman', 'how is work': 'ishlar qalay',
      'i need help': 'menga yordam kerak', 'thank you': 'rahmat', 'goodbye': 'xayr', 'when is the meeting': 'uchrashuv qachon'
    },
    'ru-RU': {
      'hello': 'привет', 'how are you': 'как дела', 'i am fine': 'я в порядке', 'how is work': 'как работа',
      'i need help': 'мне нужна помощь', 'thank you': 'спасибо', 'goodbye': 'до свидания', 'when is the meeting': 'когда встреча'
    },
    'tr-TR': {
      'hello': 'merhaba', 'how are you': 'nasılsınız', 'i am fine': 'iyiyim', 'how is work': 'işler nasıl',
      'i need help': 'yardım lazım', 'thank you': 'teşekkürler', 'goodbye': 'hoşça kal', 'when is the meeting': 'toplantı ne zaman'
    }
  },
  'ru-RU': {
    'uz-UZ': {
      'привет': 'salom', 'как дела': 'qandaysiz', 'я в порядке': 'yaxshiman', 'как работа': 'ishlar qalay',
      'мне нужна помощь': 'menga yordam kerak', 'спасибо': 'rahmat', 'до свидания': 'xayr', 'когда встреча': 'uchrashuv qachon'
    },
    'en-US': {
      'привет': 'hello', 'как дела': 'how are you', 'я в порядке': 'i am fine', 'как работа': 'how is work',
      'мне нужна помощь': 'i need help', 'спасибо': 'thank you', 'до свидания': 'goodbye', 'когда встреча': 'when is the meeting'
    },
    'tr-TR': {
      'привет': 'merhaba', 'как дела': 'nasılsınız', 'я в порядке': 'iyiyim', 'как работа': 'işler nasıl',
      'мне нужна помощь': 'yardım lazım', 'спасибо': 'teşekkürler', 'до свидания': 'hoşça kal', 'когда встреча': 'toplantı ne zaman'
    }
  },
  'tr-TR': {
    'uz-UZ': {
      'merhaba': 'salom', 'nasılsınız': 'qandaysiz', 'iyiyim': 'yaxshiman', 'işler nasıl': 'ishlar qalay',
      'yardım lazım': 'yordam kerak', 'teşekkürler': 'rahmat', 'hoşça kal': 'xayr', 'toplantı ne zaman': 'uchrashuv qachon'
    },
    'en-US': {
      'merhaba': 'hello', 'nasılsınız': 'how are you', 'iyiyim': 'i am fine', 'işler nasıl': 'how is work',
      'yardım lazım': 'i need help', 'teşekkürler': 'thank you', 'hoşça kal': 'goodbye', 'toplantı ne zaman': 'when is the meeting'
    },
    'ru-RU': {
      'merhaba': 'привет', 'nasılsınız': 'как дела', 'iyiyim': 'я в порядке', 'işler nasıl': 'как работа',
      'yardım lazım': 'мне нужна помощь', 'teşekkürler': 'спасибо', 'hoşça kal': 'до свидания', 'toplantı ne zaman': 'когда встреча'
    }
  }
};

function getMockTranslation(text, srcLang, targetLang) {
  const srcCode = LANGUAGE_LOCALES[srcLang]?.code;
  const targetCode = LANGUAGE_LOCALES[targetLang]?.code;
  const cleanText = text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
  
  if (SAMPLE_TRANSLATIONS[srcCode]?.[targetCode]?.[cleanText]) {
    return SAMPLE_TRANSLATIONS[srcCode][targetCode][cleanText];
  }
  
  // Dynamic mock translator if not in dictionary
  // We'll append a funny suffix or mock text that looks like a translation
  if (targetLang === 'English') return `Translated: [ ${text} ]`;
  if (targetLang === 'Russian') return `Перевод: [ ${text} ]`;
  if (targetLang === 'Uzbek') return `Tarjimasi: [ ${text} ]`;
  if (targetLang === 'Turkish') return `Çeviri: [ ${text} ]`;
  if (targetLang === 'Arabic') return `ترجمة: [ ${text} ]`;
  if (targetLang === 'German') return `Übersetzung: [ ${text} ]`;
  return `[${targetLang}] ${text}`;
}

export default function SimulatorTab({ activeModels, onAddLog, currentMode, setCurrentMode }) {
  const [sourceLang, setSourceLang] = useState('Uzbek');
  const [targetLang, setTargetLang] = useState('English');
  const [interfaceType, setInterfaceType] = useState('samsung'); // 'samsung' or 'whatsapp'
  const [callActive, setCallActive] = useState(false);
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionError, setRecognitionError] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  
  // Custom log messages specifically for simulator display
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'other', text: 'Salom, uchrashuv qachon?', trans: 'Hello, when is the meeting?', lang: 'uz-UZ' },
    { id: 2, sender: 'me', text: 'Salom! Ertaga soat 10:00 da.', trans: 'Hello! Tomorrow at 10:00 AM.', lang: 'uz-UZ' }
  ]);

  const recognitionRef = useRef(null);
  const callTimerRef = useRef(null);

  // Call duration counter
  useEffect(() => {
    if (callActive) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callActive]);

  // Format call duration MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if offline models are downloaded for selected languages
  const checkOfflineModels = () => {
    if (currentMode === 'online') return { allowed: true };

    const sttDownloaded = activeModels.some(m => m.model_type === 'stt' && m.language === sourceLang && m.is_active);
    const translationDownloaded = activeModels.some(m => m.model_type === 'translation' && m.language === 'Multilingual' && m.is_active);
    const ttsDownloaded = activeModels.some(m => m.model_type === 'tts' && m.language === targetLang && m.is_active);

    if (!sttDownloaded) {
      return { allowed: false, reason: `STT modeli yuklanmagan! Iltimos, Model Manager sahifasidan "${sourceLang}" STT modelini faollashtiring.` };
    }
    if (!translationDownloaded) {
      return { allowed: false, reason: 'Translation (NLLB-200) modeli yuklanmagan! Iltimos, Model Manager sahifasidan tarjima modelini faollashtiring.' };
    }
    if (!ttsDownloaded) {
      return { allowed: false, reason: `TTS modeli yuklanmagan! Iltimos, Model Manager sahifasidan "${targetLang}" TTS modelini faollashtiring.` };
    }

    return { allowed: true };
  };

  const offlineCheck = checkOfflineModels();

  // Speech Recognition hook setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsRecording(true);
        setRecognitionError('');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleNewSpeech(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setRecognitionError('Mikrofon ruxsati berilmagan!');
        } else {
          setRecognitionError(`Xatolik: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [sourceLang, targetLang, currentMode, activeModels]);

  const startListening = () => {
    if (!offlineCheck.allowed) return;

    // Unlock SpeechSynthesis audio channel on mobile browsers (iOS/Android Safari/Chrome)
    if (window.speechSynthesis) {
      const silentUtterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(silentUtterance);
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    if (recognitionRef.current) {
      const srcLocale = LANGUAGE_LOCALES[sourceLang]?.code || 'en-US';
      recognitionRef.current.lang = srcLocale;
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    } else {
      setRecognitionError('Browseringizda SpeechRecognition qo\'llab-quvvatlanmaydi. Iltimos quyidagi maydonga matn yozib sinab ko\'ring.');
    }
  };

  // Perform translation, play audio, and save logs
  const handleNewSpeech = async (text) => {
    if (!text) return;

    // Unlock SpeechSynthesis audio channel on mobile browsers (iOS/Android Safari/Chrome)
    if (window.speechSynthesis) {
      const silentUtterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(silentUtterance);
    }

    setOriginalText(text);
    setTranslatedText('Tarjima qilinmoqda...');

    const srcLocale = LANGUAGE_LOCALES[sourceLang]?.code?.split('-')[0] || 'uz';
    const targetLocale = LANGUAGE_LOCALES[targetLang]?.code?.split('-')[0] || 'en';
    
    const isOffline = currentMode === 'offline';
    const latency = isOffline ? parseFloat((1.8 + Math.random() * 0.8).toFixed(2)) : parseFloat((0.8 + Math.random() * 0.4).toFixed(2));
    
    try {
      // Fetch real translation from MyMemory API (free, CORS-enabled, supports Uzbek)
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${srcLocale}|${targetLocale}`;
      const response = await fetch(url);
      const data = await response.json();
      let translation = data?.responseData?.translatedText;

      // Clean up error responses or fail fallback
      if (!translation || data.responseStatus === 403 || translation.includes("INVALID LANGUAGE PAIR")) {
        translation = getMockTranslation(text, sourceLang, targetLang);
      }

      // Update UI after the latency delay to simulate process time
      setTimeout(() => {
        setTranslatedText(translation);
        speakText(translation, targetLang);

        onAddLog({
          source_language: sourceLang,
          target_language: targetLang,
          source_text: text,
          translated_text: translation,
          audio_file_path: `/audio/rendered_${Date.now()}.wav`,
          latency: latency,
          mode: currentMode.toUpperCase()
        });

        if (interfaceType === 'whatsapp') {
          setChatMessages(prev => [
            ...prev,
            {
              id: Date.now(),
              sender: 'me',
              text: text,
              trans: translation,
              lang: LANGUAGE_LOCALES[sourceLang]?.code
            }
          ]);
        }
      }, latency * 1000);

    } catch (err) {
      console.error("Translation API error:", err);
      const translation = getMockTranslation(text, sourceLang, targetLang);
      
      setTimeout(() => {
        setTranslatedText(translation);
        speakText(translation, targetLang);

        onAddLog({
          source_language: sourceLang,
          target_language: targetLang,
          source_text: text,
          translated_text: translation,
          audio_file_path: `/audio/rendered_${Date.now()}.wav`,
          latency: latency,
          mode: currentMode.toUpperCase()
        });
      }, latency * 1000);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    if (!offlineCheck.allowed) return;
    handleNewSpeech(manualInput);
    setManualInput('');
  };

  const speakText = (text, langName) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const localeInfo = LANGUAGE_LOCALES[langName];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localeInfo?.ttsLocale || 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles style={{ color: 'var(--primary)' }} />
          Interaktiv Qo'ng'iroq va Ovoz Simulyatori
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
          Ushbu panel orqali smartfondagi qo'ng'iroq jarayonida tarjimon qanday ishlashini sinab ko'rishingiz mumkin. Mikrofon tugmasini bosing va gapiring (masalan, "Salom" yoki "Rahmat").
        </p>
      </div>

      <div className="simulator-layout">
        {/* Left column: Simulator controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel sim-controls-card">
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Sozlamalar</h3>
            
            {/* Mode selection */}
            <div className="form-group">
              <label className="form-label">Ishlash Rejimi</label>
              <div className="radio-group">
                <button 
                  className={`radio-btn ${currentMode === 'online' ? 'active' : ''}`}
                  onClick={() => setCurrentMode('online')}
                >
                  Online (Tez)
                </button>
                <button 
                  className={`radio-btn ${currentMode === 'offline' ? 'active' : ''}`}
                  onClick={() => setCurrentMode('offline')}
                >
                  Offline (AIda)
                </button>
              </div>
            </div>

            {/* Language parameters */}
            <div className="form-group">
              <label className="form-label">Sizning Tilingiz (Source)</label>
              <select 
                className="form-select" 
                value={sourceLang} 
                onChange={(e) => setSourceLang(e.target.value)}
              >
                <option value="Uzbek">O'zbekcha</option>
                <option value="English">English</option>
                <option value="Russian">Русский</option>
                <option value="Turkish">Türkçe</option>
                <option value="Arabic">العربية</option>
                <option value="German">Deutsch</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Suhbatdosh Tili (Target)</label>
              <select 
                className="form-select" 
                value={targetLang} 
                onChange={(e) => setTargetLang(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Uzbek">O'zbekcha</option>
                <option value="Russian">Русский</option>
                <option value="Turkish">Türkçe</option>
                <option value="Arabic">العربية</option>
                <option value="German">Deutsch</option>
              </select>
            </div>

            {/* Interface simulation toggle */}
            <div className="form-group">
              <label className="form-label">Dastur Interfeysi</label>
              <div className="radio-group">
                <button 
                  className={`radio-btn ${interfaceType === 'samsung' ? 'active' : ''}`}
                  onClick={() => setInterfaceType('samsung')}
                >
                  Samsung Call
                </button>
                <button 
                  className={`radio-btn ${interfaceType === 'whatsapp' ? 'active' : ''}`}
                  onClick={() => setInterfaceType('whatsapp')}
                >
                  WhatsApp Call
                </button>
              </div>
            </div>
          </div>

          {/* Manual Text Simulation Box */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Matn orqali simulyatsiya</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Mikrofon ishlamasa, quyidagi namunaviy gaplardan birini tanlang yoki o'zingiz yozing:
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {sourceLang === 'Uzbek' && ['Salom', 'Qandaysiz', 'Yaxshiman', 'Yordam kerak', 'Rahmat'].map(t => (
                <button key={t} className="btn-small" onClick={() => handleNewSpeech(t)}>{t}</button>
              ))}
              {sourceLang === 'English' && ['Hello', 'How are you', 'I am fine', 'I need help', 'Thank you'].map(t => (
                <button key={t} className="btn-small" onClick={() => handleNewSpeech(t)}>{t}</button>
              ))}
              {sourceLang === 'Russian' && ['Привет', 'Как дела', 'Я в порядке', 'Мне нужна помощь', 'Спасибо'].map(t => (
                <button key={t} className="btn-small" onClick={() => handleNewSpeech(t)}>{t}</button>
              ))}
              {sourceLang === 'Turkish' && ['Merhaba', 'Nasılsınız', 'İyiyim', 'Yardım lazım', 'Teşekkürler'].map(t => (
                <button key={t} className="btn-small" onClick={() => handleNewSpeech(t)}>{t}</button>
              ))}
            </div>

            <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Matn kiriting..." 
                value={manualInput} 
                onChange={(e) => setManualInput(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '13px' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Phone frame & live transcripts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Phone Frame Simulator */}
          <div className="phone-frame">
            <div className="phone-notch"></div>
            
            <div className="phone-screen">
              {interfaceType === 'samsung' ? (
                /* Samsung Call Interface Mockup */
                <div className="calling-screen">
                  <div className="caller-info">
                    <div className="caller-avatar">👤</div>
                    <div className="caller-name">{targetLang === 'English' ? 'John Doe' : 'Suhbatdosh'}</div>
                    <div className="caller-status">
                      {callActive ? `Qo'ng'iroq faol (${formatDuration(callDuration)})` : 'Kiruvchi qo\'ng\'iroq...'}
                    </div>
                  </div>

                  {callActive ? (
                    <div>
                      {/* Active Subtitles display */}
                      {translationEnabled && (originalText || translatedText) && (
                        <div className="call-subtitles">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                            <span style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></span>
                            <span style={{ fontSize: '10px', color: '#93c5fd', fontWeight: 'bold' }}>ANTIGRAVITY TRANSLATOR</span>
                          </div>
                          {originalText && <p className="subtitle-original">"{originalText}"</p>}
                          {translatedText && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '4px' }}>
                              <p className="subtitle-trans" style={{ margin: 0 }}>➔ "{translatedText}"</p>
                              <button 
                                onClick={() => speakText(translatedText, targetLang)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--secondary)', cursor: 'pointer', display: 'flex', padding: '4px', flexShrink: 0 }}
                                title="Ovozli eshittirish"
                              >
                                <Volume2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Call action grid */}
                      <div className="call-actions-grid">
                        <button className="action-btn">
                          <div className="action-icon-circle">🔊</div>
                          <span>Spiker</span>
                        </button>
                        <button className="action-btn">
                          <div className="action-icon-circle">🔇</div>
                          <span>Mute</span>
                        </button>
                        <button className="action-btn">
                          <div className="action-icon-circle">⌨️</div>
                          <span>Klaviatura</span>
                        </button>
                      </div>

                      {/* Translate button overlay */}
                      <button 
                        className={`translate-overlay-btn ${translationEnabled ? 'active' : ''}`}
                        onClick={() => setTranslationEnabled(!translationEnabled)}
                      >
                        <Globe size={16} />
                        {translationEnabled ? "Tarjima Yoqilgan" : "Tarjimani Yoqish"}
                      </button>

                      <div className="decline-btn-wrapper">
                        <button className="decline-btn" onClick={() => setCallActive(false)}>
                          <PhoneOff size={24} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Answer buttons */
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: '32px' }}>
                      <button 
                        className="decline-btn" 
                        style={{ background: '#22c55e', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.4)' }}
                        onClick={() => setCallActive(true)}
                      >
                        <Phone size={24} />
                      </button>
                      <button className="decline-btn" onClick={() => setCallActive(false)}>
                        <PhoneOff size={24} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* WhatsApp Call Simulator Mockup */
                <div className="whatsapp-screen">
                  <div className="wa-header">
                    <div className="wa-avatar">W</div>
                    <div className="wa-user">
                      <div className="wa-name">WhatsApp Translation</div>
                      <div className="wa-status">Accessibility Service Faol</div>
                    </div>
                  </div>

                  <div className="wa-chats">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`wa-msg ${msg.sender === 'me' ? 'out' : 'in'}`}>
                        {msg.text}
                        {translationEnabled && (
                          <div className="wa-translation" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <div>
                              <span className="wa-caption">ANTIGRAVITY</span>
                              {msg.trans}
                            </div>
                            <button 
                              onClick={() => speakText(msg.trans, targetLang)}
                              style={{ background: 'transparent', border: 'none', color: '#a78bfa', cursor: 'pointer', display: 'flex', padding: '2px', flexShrink: 0 }}
                              title="Ovozli eshittirish"
                            >
                              <Volume2 size={12} />
                            </button>
                          </div>
                        )}
                        <span className="wa-subtext">21:12</span>
                      </div>
                    ))}
                  </div>

                  <div className="wa-overlay">
                    <button 
                      className={`translate-overlay-btn ${translationEnabled ? 'active' : ''}`}
                      onClick={() => setTranslationEnabled(!translationEnabled)}
                      style={{ width: '100%' }}
                    >
                      <MessageSquare size={16} />
                      {translationEnabled ? "WhatsApp tarjimani o'chirish" : "WhatsApp tarjimani yoqish"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right box: Real-time Audio Stream Monitor */}
          <div className="glass-panel sim-console">
            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Tizim Monitori (Logs)</h3>
            
            {!offlineCheck.allowed ? (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', display: 'flex', gap: '8px', color: '#fca5a5', fontSize: '12px', lineHeight: '1.4' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{offlineCheck.reason}</span>
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px', display: 'flex', gap: '8px', color: '#a7f3d0', fontSize: '12px' }}>
                <Sparkles size={18} style={{ flexShrink: 0 }} />
                <span>Barcha AI modellar yuklangan va tayyor. Ovoz yozishni boshlashingiz mumkin.</span>
              </div>
            )}

            <div className="transcript-monitor">
              {(originalText || translatedText) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>[INPUT SOUND STREAM]</span>
                    <p style={{ fontSize: '14px', marginTop: '4px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      {originalText}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--secondary)', fontWeight: 'bold' }}>[TRANSLATION STREAM]</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <p style={{ flexGrow: 1, fontSize: '14px', background: 'rgba(6, 182, 212, 0.05)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(6, 182, 212, 0.2)', color: '#22d3ee', margin: 0 }}>
                        {translatedText}
                      </p>
                      <button 
                        onClick={() => speakText(translatedText, targetLang)}
                        className="btn-primary"
                        style={{ padding: '10px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Qayta eshittirish"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {isSpeaking && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--accent)' }}>
                      <Volume2 size={14} className="glow-primary" />
                      <span>Sun'iy ovoz eshittirilmoqda (TTS stream...)</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="monitor-placeholder">
                  <Mic size={32} style={{ color: 'var(--text-muted)' }} />
                  <p style={{ fontSize: '13px' }}>Hozircha faol oqim yo'q</p>
                </div>
              )}
            </div>

            {/* Audio Waveform */}
            <div className="vad-visualizer">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className={`vad-bar ${isRecording ? 'animating' : ''}`}
                  style={{
                    height: isRecording ? undefined : `${4 + Math.random() * 8}px`
                  }}
                />
              ))}
            </div>

            {/* Microphone Activation Button */}
            <div className="mic-action-box">
              <button 
                className={`mic-button ${isRecording ? 'active' : ''}`}
                onClick={startListening}
                title={isRecording ? "Yozishni to'xtatish" : "Gapirishni boshlash"}
              >
                <Mic size={28} />
              </button>
              <span style={{ fontSize: '12px', fontWeight: '500', color: isRecording ? 'var(--danger)' : 'var(--text-muted)' }}>
                {isRecording ? "Sizni eshitmoqdaman... (Gapiring)" : "Mikrofonni faollashtirish"}
              </span>
              {recognitionError && (
                <span style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '4px', textAlign: 'center' }}>
                  {recognitionError}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
