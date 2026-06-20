import React from 'react';
import { Mic, Globe, Cpu, Database, Activity, Settings, PhoneCall, Volume2 } from 'lucide-react';

export default function DashboardTab({ onNavigate, stats, activeModels }) {
  // Compute active model count and storage size
  const totalModelsSize = activeModels.reduce((acc, m) => acc + m.size_mb, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="title-gradient" style={{ fontSize: '32px', marginBottom: '8px', fontWeight: '800' }}>
            Antigravity OS Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', lineHeight: '1.6' }}>
            Real-vaqt rejimida universal ovozli tarjima tizimini nazorat qilish va sozlash markazi. Bu erda offline AI modellarini boshqarish, tarjimalar tarixini tahlil qilish va simulyatorni sinab ko'rishingiz mumkin.
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => onNavigate('simulator')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <PhoneCall size={18} />
          Simulyatorni Ochish
        </button>
      </div>

      {/* Grid Stats */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Jami Tarjimalar</span>
            <Activity className="stat-icon" />
          </div>
          <div className="stat-value">{stats.totalTranslations}</div>
          <div className="stat-desc" style={{ color: 'var(--success)' }}>
            +12 ta bugun amalga oshirildi
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>O'rtacha Kechikish</span>
            <Cpu className="stat-icon" style={{ color: 'var(--secondary)' }} />
          </div>
          <div className="stat-value">{stats.avgLatency}s</div>
          <div className="stat-desc" style={{ color: 'var(--secondary)' }}>
            Offline: ~2.4s | Online: ~1.1s
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Yuklangan AI Modellar</span>
            <Database className="stat-icon" style={{ color: 'var(--warning)' }} />
          </div>
          <div className="stat-value">{(totalModelsSize / 1024).toFixed(2)} GB</div>
          <div className="stat-desc">
            {activeModels.filter(m => m.is_active).length} ta model faol (Maks: 16 GB)
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Qamrab Olingan Tillar</span>
            <Globe className="stat-icon" style={{ color: 'var(--accent)' }} />
          </div>
          <div className="stat-value">100+</div>
          <div className="stat-desc">
            50+ STT / 200+ Tarjima tillari
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="two-col-grid">
        {/* Active System Status */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="panel-header">
            <h2 className="panel-title">Tizim holati (System Status)</h2>
            <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 'bold' }}>BARCHA TIZIMLAR NORMAL</span>
          </div>
          <div className="list-container">
            <div className="list-item">
              <div className="item-info">
                <div className="item-icon-wrapper" style={{ color: 'var(--primary)' }}>
                  <Mic size={20} />
                </div>
                <div className="item-details">
                  <span className="item-name">Speech-to-Text (STT)</span>
                  <span className="item-subtitle">Ovozni matnga o'girish tizimi</span>
                </div>
              </div>
              <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '13px' }}>FAOL (Whisper/Vosk)</span>
            </div>

            <div className="list-item">
              <div className="item-info">
                <div className="item-icon-wrapper" style={{ color: 'var(--secondary)' }}>
                  <Globe size={20} />
                </div>
                <div className="item-details">
                  <span className="item-name">NMT Translation Engine</span>
                  <span className="item-subtitle">Meta NLLB-200 & Google API tarjimoni</span>
                </div>
              </div>
              <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '13px' }}>TAYYOR (Online/Offline)</span>
            </div>

            <div className="list-item">
              <div className="item-info">
                <div className="item-icon-wrapper" style={{ color: 'var(--accent)' }}>
                  <Volume2 size={20} />
                </div>
                <div className="item-details">
                  <span className="item-name">Text-to-Speech (TTS)</span>
                  <span className="item-subtitle">Sun'iy ovoz generatori</span>
                </div>
              </div>
              <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '13px' }}>FAOL (Android TTS)</span>
            </div>

            <div className="list-item">
              <div className="item-info">
                <div className="item-icon-wrapper">
                  <Database size={20} />
                </div>
                <div className="item-details">
                  <span className="item-name">Local SQLite Database</span>
                  <span className="item-subtitle">Suhbat tarixi va model bazasi</span>
                </div>
              </div>
              <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '13px' }}>ULANDI (v3.42)</span>
            </div>
          </div>
        </div>

        {/* Model quick stats */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="panel-header">
            <h2 className="panel-title">Faol Modellar</h2>
            <button className="btn-small" onClick={() => onNavigate('models')}>Boshqarish</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeModels.filter(m => m.is_active).map((model) => (
              <div key={model.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                    {model.model_type.toUpperCase()} ({model.language})
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {model.model_path.split('/').pop()}
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--secondary)' }}>
                  {model.size_mb} MB
                </span>
              </div>
            ))}
            {activeModels.filter(m => m.is_active).length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                Hech qaysi offline model faollashtirilmagan. Faqat Online tarjima ishlaydi.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
