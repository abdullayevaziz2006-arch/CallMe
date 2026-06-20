import React, { useState } from 'react';
import { Layers, Database, ShieldAlert, Cpu, Activity, PhoneCall, Globe, Menu, Sparkles } from 'lucide-react';
import DashboardTab from './components/DashboardTab';
import SimulatorTab from './components/SimulatorTab';
import ModelManagerTab from './components/ModelManagerTab';
import SqliteExplorerTab from './components/SqliteExplorerTab';
import ArchitectureTab from './components/ArchitectureTab';
import './App.css';

const SEED_MODELS = [
  // STT Models
  { id: 1, model_type: 'stt', language: 'Uzbek', model_path: 'vosk-uz-0.15', size_mb: 150, is_downloaded: true, is_active: true },
  { id: 2, model_type: 'stt', language: 'English', model_path: 'whisper-small-en', size_mb: 1500, is_downloaded: false, is_active: false },
  { id: 3, model_type: 'stt', language: 'Russian', model_path: 'vosk-ru-0.22', size_mb: 350, is_downloaded: false, is_active: false },
  { id: 4, model_type: 'stt', language: 'Turkish', model_path: 'vosk-tr-0.3', size_mb: 220, is_downloaded: false, is_active: false },
  
  // Translation Models
  { id: 5, model_type: 'translation', language: 'Multilingual', model_path: 'nllb-200-distilled-600M', size_mb: 1200, is_downloaded: true, is_active: true },
  { id: 6, model_type: 'translation', language: 'Multilingual', model_path: 'nllb-200-distilled-1.3B', size_mb: 3000, is_downloaded: false, is_active: false },
  { id: 7, model_type: 'translation', language: 'Multilingual', model_path: 'gemma-3-4b-int8', size_mb: 8000, is_downloaded: false, is_active: false },
  
  // TTS Models
  { id: 8, model_type: 'tts', language: 'English', model_path: 'android-tts-en', size_mb: 0, is_downloaded: true, is_active: true },
  { id: 9, model_type: 'tts', language: 'Uzbek', model_path: 'android-tts-uz', size_mb: 0, is_downloaded: true, is_active: true },
  { id: 10, model_type: 'tts', language: 'Russian', model_path: 'android-tts-ru', size_mb: 0, is_downloaded: true, is_active: true },
  { id: 11, model_type: 'tts', language: 'Turkish', model_path: 'android-tts-tr', size_mb: 0, is_downloaded: true, is_active: true },
  { id: 12, model_type: 'tts', language: 'German', model_path: 'coqui-tts-de', size_mb: 4000, is_downloaded: false, is_active: false }
];

const SEED_LOGS = [
  { id: 1, timestamp: '2026-06-20 20:30:15', source_language: 'Uzbek', target_language: 'English', source_text: 'Salom, qandaysiz?', translated_text: 'Hello, how are you?', audio_file_path: '/audio/rendered_1.wav', latency: 1.1, mode: 'ONLINE' },
  { id: 2, timestamp: '2026-06-20 20:32:44', source_language: 'Uzbek', target_language: 'English', source_text: 'Uchrashuv qachon?', translated_text: 'When is the meeting?', audio_file_path: '/audio/rendered_2.wav', latency: 2.3, mode: 'OFFLINE' },
  { id: 3, timestamp: '2026-06-20 20:45:12', source_language: 'Russian', target_language: 'Uzbek', source_text: 'Мне нужна помощь', translated_text: 'Menga yordam kerak', audio_file_path: '/audio/rendered_3.wav', latency: 0.9, mode: 'ONLINE' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeModels, setActiveModels] = useState(SEED_MODELS);
  const [logs, setLogs] = useState(SEED_LOGS);
  const [currentMode, setCurrentMode] = useState('online');

  // Stats computation
  const totalTranslations = logs.length;
  const avgLatency = totalTranslations > 0 
    ? (logs.reduce((acc, l) => acc + l.latency, 0) / totalTranslations).toFixed(2)
    : '0.00';

  const stats = {
    totalTranslations,
    avgLatency
  };

  const handleAddLog = (logEntry) => {
    const newLog = {
      id: logs.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...logEntry
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleToggleModel = (modelId) => {
    setActiveModels(prev => prev.map(m => {
      if (m.id === modelId) {
        if (!m.is_downloaded) return m; // Can't activate if not downloaded
        return { ...m, is_active: !m.is_active };
      }
      return m;
    }));
  };

  const handleDownloadModel = (modelId) => {
    setActiveModels(prev => prev.map(m => {
      if (m.id === modelId) {
        return { ...m, is_downloaded: true, is_active: true };
      }
      return m;
    }));
  };

  const handleClearLogs = () => {
    if (window.confirm("Barcha suhbatlar tarixini o'chirishni xohlaysizmi?")) {
      setLogs([]);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="logo-text">Antigravity</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Universal AI Translator</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Layers size={18} />
            Boshqaruv paneli
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <PhoneCall size={18} />
            Ovoz Simulyatori
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'models' ? 'active' : ''}`}
            onClick={() => setActiveTab('models')}
          >
            <Database size={18} />
            Offline AI Modellar
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            <Activity size={18} />
            SQLite Explorer
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Cpu size={18} />
            Arxitektura & Reja
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="wa-avatar" style={{ background: 'var(--primary)' }}>A</div>
          <div className="user-badge">
            <span className="user-name">Developer</span>
            <span className="user-status">Sandbox Faol</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-panel">
        <header className="header">
          <div className="header-title-section">
            <h1 style={{ fontSize: '18px', fontWeight: '600' }}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'simulator' && 'Voice Simulator & Interceptor'}
              {activeTab === 'models' && 'AI Offline Model Manager'}
              {activeTab === 'database' && 'SQLite Logs Browser'}
              {activeTab === 'architecture' && 'Technical Specification & Roadmap'}
            </h1>
            <span className="header-subtitle">Antigravity real-time engine control center</span>
          </div>

          <div className="stats-badges">
            <div className={`badge online ${currentMode === 'offline' ? 'offline' : ''}`}>
              <Globe size={14} />
              <span>Rejim: {currentMode.toUpperCase()}</span>
            </div>
            <div className="badge latency">
              <Cpu size={14} />
              <span>O'rtacha kechikish: {avgLatency}s</span>
            </div>
          </div>
        </header>

        <main className="content">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              onNavigate={setActiveTab} 
              stats={stats} 
              activeModels={activeModels} 
            />
          )}
          {activeTab === 'simulator' && (
            <SimulatorTab 
              activeModels={activeModels} 
              onAddLog={handleAddLog} 
              currentMode={currentMode}
              setCurrentMode={setCurrentMode}
            />
          )}
          {activeTab === 'models' && (
            <ModelManagerTab 
              activeModels={activeModels} 
              onToggleModel={handleToggleModel} 
              onDownloadModel={handleDownloadModel} 
            />
          )}
          {activeTab === 'database' && (
            <SqliteExplorerTab 
              logs={logs} 
              onClearLogs={handleClearLogs} 
            />
          )}
          {activeTab === 'architecture' && (
            <ArchitectureTab />
          )}
        </main>
      </div>
    </div>
  );
}
