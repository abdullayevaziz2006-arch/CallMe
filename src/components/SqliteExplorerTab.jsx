import React, { useState } from 'react';
import { Database, Play, Trash2, Shield, Calendar, ArrowRight, Layers } from 'lucide-react';

export default function SqliteExplorerTab({ logs, onClearLogs }) {
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM conversations ORDER BY timestamp DESC;');
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState('');
  const [queryLatency, setQueryLatency] = useState(0);

  const runQuery = (e) => {
    e.preventDefault();
    setQueryError('');
    const t0 = performance.now();

    try {
      const query = sqlQuery.trim().toLowerCase();

      if (!query.startsWith('select')) {
        throw new Error('Xavfsizlik cheklovi: Ushbu interfeysda faqat SELECT so\'rovlari qo\'llab-quvvatlanadi.');
      }

      // Basic SQL filtering simulation
      let filtered = [...logs];

      if (query.includes("where")) {
        const whereClause = query.split("where")[1].split("order")[0].split("limit")[0].trim();
        
        if (whereClause.includes("source_language")) {
          const val = whereClause.split("=")[1].replace(/['";\s]/g, '');
          filtered = filtered.filter(l => l.source_language.toLowerCase() === val);
        } else if (whereClause.includes("target_language")) {
          const val = whereClause.split("=")[1].replace(/['";\s]/g, '');
          filtered = filtered.filter(l => l.target_language.toLowerCase() === val);
        } else if (whereClause.includes("mode")) {
          const val = whereClause.split("=")[1].replace(/['";\s]/g, '').toUpperCase();
          filtered = filtered.filter(l => l.mode === val);
        }
      }

      if (query.includes("order by")) {
        // Just sort by ID or timestamp desc as fallback
        if (query.includes("asc")) {
          filtered.sort((a, b) => a.id - b.id);
        } else {
          filtered.sort((a, b) => b.id - a.id);
        }
      }

      if (query.includes("limit")) {
        const limitVal = parseInt(query.split("limit")[1].trim().replace(';', ''));
        if (!isNaN(limitVal)) {
          filtered = filtered.slice(0, limitVal);
        }
      }

      setTimeout(() => {
        setQueryResults(filtered);
        setQueryLatency((performance.now() - t0).toFixed(2));
      }, 50);

    } catch (err) {
      setQueryError(err.message || 'SQL so\'rovida sintaktik xatolik.');
      setQueryResults(null);
    }
  };

  const activeLogsList = queryResults !== null ? queryResults : logs;

  return (
    <div className="sqlite-layout">
      {/* DB Info Card */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database style={{ color: 'var(--primary)' }} />
            SQLite Tizim Fayli (conversations.db)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
            Suhbatlar tarixi va tarjima jurnali qurilmaning shifrlangan SQLite ma'lumotlar bazasida saqlanadi. Quyidagi terminal orqali SQL so'rovlar yozib test qilishingiz mumkin.
          </p>
        </div>
        <button 
          className="btn-small" 
          onClick={onClearLogs}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
        >
          <Trash2 size={14} />
          Baza Tozalash
        </button>
      </div>

      {/* SQL Console Card */}
      <div className="glass-panel query-editor-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Layers size={16} style={{ color: 'var(--secondary)' }} />
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>SQL Query Editor</span>
        </div>
        
        <form onSubmit={runQuery} className="query-editor-box">
          <input 
            type="text" 
            className="query-input"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Play size={14} />
            SQL Ishga Tushirish
          </button>
        </form>

        {queryError && (
          <div style={{ marginTop: '12px', color: 'var(--danger)', fontSize: '12px', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚠️ {queryError}
          </div>
        )}

        {queryResults !== null && (
          <div style={{ marginTop: '12px', color: 'var(--success)', fontSize: '12px' }}>
            ✓ So'rov muvaffaqiyatli bajarildi. {queryResults.length} ta satr topildi ({queryLatency} ms)
          </div>
        )}
      </div>

      {/* DB Table Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="panel-header">
          <h3 className="panel-title">Jadval: <code>conversations</code></h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Jami satrlar: {logs.length} ta</span>
        </div>

        <div className="table-wrapper">
          <table className="db-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vaqt (Timestamp)</th>
                <th>Tillar (Source ➔ Target)</th>
                <th>Asl Matn (Original Text)</th>
                <th>Tarjima Matn (Translated Text)</th>
                <th>Kechikish (Latency)</th>
                <th>Rejim</th>
              </tr>
            </thead>
            <tbody>
              {activeLogsList.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{log.id}</td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={12} />
                      {log.timestamp}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                      {log.source_language}
                      <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                      {log.target_language}
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{log.source_text}"
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--secondary)', fontWeight: '500' }}>
                    "{log.translated_text}"
                  </td>
                  <td style={{ fontWeight: '600', color: log.latency > 2.0 ? 'var(--warning)' : 'var(--success)' }}>
                    {log.latency}s
                  </td>
                  <td>
                    <span 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        background: log.mode === 'OFFLINE' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                        color: log.mode === 'OFFLINE' ? '#c084fc' : '#22d3ee'
                      }}
                    >
                      {log.mode}
                    </span>
                  </td>
                </tr>
              ))}
              {activeLogsList.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Hech qanday ma'lumot topilmadi. Simulyatorda ovoz yozib, bazaga ma'lumot qo'shishingiz mumkin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
