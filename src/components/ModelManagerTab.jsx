import React, { useState } from 'react';
import { Database, Download, Check, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ModelManagerTab({ activeModels, onToggleModel, onDownloadModel }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Group models by type
  const sttModels = activeModels.filter(m => m.model_type === 'stt');
  const translationModels = activeModels.filter(m => m.model_type === 'translation');
  const ttsModels = activeModels.filter(m => m.model_type === 'tts');

  // Compute storage statistics
  const downloadedSize = activeModels
    .filter(m => m.is_downloaded)
    .reduce((acc, m) => acc + m.size_mb, 0);
  const activeSize = activeModels
    .filter(m => m.is_active)
    .reduce((acc, m) => acc + m.size_mb, 0);
  const maxStorage = 16384; // 16 GB in MB
  const storagePercentage = (downloadedSize / maxStorage) * 100;

  const handleDownloadSim = (modelId, sizeMb) => {
    if (downloadingId !== null) return;
    setDownloadingId(modelId);
    setDownloadProgress(0);

    // Simulate progress download
    const duration = 2000; // 2 seconds download
    const step = 5;
    const intervalTime = duration / (100 / step);

    const timer = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          onDownloadModel(modelId);
          setDownloadingId(null);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Introduction Card */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database style={{ color: 'var(--secondary)' }} />
            Offline AI Model Manager (Offline Paketlar)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', maxWidth: '800px' }}>
            Antigravity dasturi internetsiz ishlashi uchun zarur AI modellarini shu erda boshqarishingiz mumkin. Telefoningiz xotirasi va tezligiga mos keladigan modellarni yuklab oling. Kerakli tillarni yuklab olgach, "Faollashtirish" tugmasini yoqing.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 16px', borderRadius: '8px', color: 'var(--success)', fontSize: '13px', fontWeight: 'bold' }}>
          <ShieldCheck size={18} />
          Xavfsiz: Offline rejim
        </div>
      </div>

      {/* Storage warning/statistics bar */}
      <div className="glass-panel storage-summary-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Telefon xotirasining bandligi (Simulyatsiya)</span>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>
              {(downloadedSize / 1024).toFixed(2)} GB / {(maxStorage / 1024).toFixed(0)} GB (Maksimal xotira limiti)
            </div>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: storagePercentage > 80 ? 'var(--danger)' : 'var(--secondary)' }}>
            {storagePercentage.toFixed(1)}% band
          </span>
        </div>

        <div className="storage-bar-outer">
          <div className="storage-bar-inner" style={{ width: `${Math.min(storagePercentage, 100)}%` }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Band: {(downloadedSize / 1024).toFixed(2)} GB</span>
          <span>Bo'sh joy: {((maxStorage - downloadedSize) / 1024).toFixed(2)} GB</span>
        </div>

        {storagePercentage > 75 && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '10px 14px', borderRadius: '8px', color: 'var(--warning)', fontSize: '12px', alignItems: 'center' }}>
            <AlertTriangle size={16} />
            <span>Xotira limiti to'lib bormoqda. Keraksiz tillar modellarini o'chirib yuborishingiz mumkin.</span>
          </div>
        )}
      </div>

      {/* Models group grids */}
      <div className="models-grid">
        
        {/* STT Group */}
        <div className="glass-panel model-group-card">
          <div className="model-header">
            <span style={{ fontSize: '20px' }}>🎙️</span>
            <div>
              <h3 className="model-group-title">Speech-to-Text (STT)</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ovozni matnga o'girish modellar</p>
            </div>
          </div>

          <div className="model-card-list">
            {sttModels.map(model => (
              <div key={model.id} className={`sub-model-card ${model.is_active ? 'active' : ''}`}>
                <div className="sub-model-top">
                  <span className="sub-model-name">{model.language} ({model.model_path.split('-')[0]})</span>
                  <span className="sub-model-size">{model.size_mb} MB</span>
                </div>
                
                <div className="sub-model-status-row">
                  {model.is_downloaded ? (
                    <>
                      <span style={{ color: 'var(--success)', fontWeight: '500' }}>Yuklangan</span>
                      <button 
                        className="btn-small" 
                        onClick={() => onToggleModel(model.id)}
                        style={{ borderColor: model.is_active ? 'var(--primary)' : undefined, background: model.is_active ? 'var(--primary-glow)' : undefined }}
                      >
                        {model.is_active ? 'Faol (Active)' : 'Yoqish'}
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ color: 'var(--text-muted)' }}>Mavjud</span>
                      <button 
                        className={`btn-small ${downloadingId === model.id ? 'downloading' : ''}`}
                        onClick={() => handleDownloadSim(model.id, model.size_mb)}
                        disabled={downloadingId !== null}
                      >
                        {downloadingId === model.id ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <RefreshCw size={10} style={{ animation: 'spin 1s linear infinite' }} />
                            {downloadProgress}%
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Download size={10} />
                            Yuklash
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
                {downloadingId === model.id && (
                  <div className="download-bar-container">
                    <div className="download-bar" style={{ width: `${downloadProgress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Translation Group */}
        <div className="glass-panel model-group-card">
          <div className="model-header">
            <span style={{ fontSize: '20px' }}>🔤</span>
            <div>
              <h3 className="model-group-title">Translation (Tarjima)</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Matnni boshqa tilga tarjima qilish</p>
            </div>
          </div>

          <div className="model-card-list">
            {translationModels.map(model => (
              <div key={model.id} className={`sub-model-card ${model.is_active ? 'active' : ''}`}>
                <div className="sub-model-top">
                  <span className="sub-model-name">{model.language} ({model.model_path})</span>
                  <span className="sub-model-size">{(model.size_mb / 1024).toFixed(1)} GB</span>
                </div>
                
                <div className="sub-model-status-row">
                  {model.is_downloaded ? (
                    <>
                      <span style={{ color: 'var(--success)', fontWeight: '500' }}>Yuklangan</span>
                      <button 
                        className="btn-small" 
                        onClick={() => onToggleModel(model.id)}
                        style={{ borderColor: model.is_active ? 'var(--primary)' : undefined, background: model.is_active ? 'var(--primary-glow)' : undefined }}
                      >
                        {model.is_active ? 'Faol' : 'Yoqish'}
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ color: 'var(--text-muted)' }}>Mavjud</span>
                      <button 
                        className={`btn-small ${downloadingId === model.id ? 'downloading' : ''}`}
                        onClick={() => handleDownloadSim(model.id, model.size_mb)}
                        disabled={downloadingId !== null}
                      >
                        {downloadingId === model.id ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <RefreshCw size={10} style={{ animation: 'spin 1s linear infinite' }} />
                            {downloadProgress}%
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Download size={10} />
                            Yuklash
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
                {downloadingId === model.id && (
                  <div className="download-bar-container">
                    <div className="download-bar" style={{ width: `${downloadProgress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TTS Group */}
        <div className="glass-panel model-group-card">
          <div className="model-header">
            <span style={{ fontSize: '20px' }}>🗣️</span>
            <div>
              <h3 className="model-group-title">Text-to-Speech (TTS)</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tarjimani ovozli qilish modellari</p>
            </div>
          </div>

          <div className="model-card-list">
            {ttsModels.map(model => (
              <div key={model.id} className={`sub-model-card ${model.is_active ? 'active' : ''}`}>
                <div className="sub-model-top">
                  <span className="sub-model-name">{model.language} ({model.model_path})</span>
                  <span className="sub-model-size">{model.size_mb} MB</span>
                </div>
                
                <div className="sub-model-status-row">
                  {model.is_downloaded ? (
                    <>
                      <span style={{ color: 'var(--success)', fontWeight: '500' }}>
                        {model.size_mb === 0 ? 'Tizimli' : 'Yuklangan'}
                      </span>
                      <button 
                        className="btn-small" 
                        onClick={() => onToggleModel(model.id)}
                        style={{ borderColor: model.is_active ? 'var(--primary)' : undefined, background: model.is_active ? 'var(--primary-glow)' : undefined }}
                      >
                        {model.is_active ? 'Faol' : 'Yoqish'}
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ color: 'var(--text-muted)' }}>Mavjud</span>
                      <button 
                        className={`btn-small ${downloadingId === model.id ? 'downloading' : ''}`}
                        onClick={() => handleDownloadSim(model.id, model.size_mb)}
                        disabled={downloadingId !== null}
                      >
                        {downloadingId === model.id ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <RefreshCw size={10} style={{ animation: 'spin 1s linear infinite' }} />
                            {downloadProgress}%
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Download size={10} />
                            Yuklash
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
                {downloadingId === model.id && (
                  <div className="download-bar-container">
                    <div className="download-bar" style={{ width: `${downloadProgress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
