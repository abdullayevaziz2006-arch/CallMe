import React, { useState } from 'react';
import { Cpu, CheckCircle2, TrendingUp, AlertTriangle, Layers, DollarSign, Clock, Check } from 'lucide-react';

export default function ArchitectureTab() {
  const [phases, setPhases] = useState([
    {
      id: 1,
      title: "1-bosqich: Prototip (Mavjud Bosqich)",
      time: "1-2 oy",
      status: "completed",
      tag: "done",
      desc: "Vosk + NLLB + Android TTS integratsiyasi. Oddiy ovoz yozib olish va real-vaqtda tarjima qilishni boshqarish.",
      cost: 5000,
      tasks: [
        "Veb-prototip va vizual simulyator yaratish",
        "Android TTS integratsiyasi va test qilish",
        "Vosk offline modelini o'rnatish va audio oqimni ulash"
      ]
    },
    {
      id: 2,
      title: "2-bosqich: Qo'ng'iroq integratsiyasi",
      time: "2 oy",
      status: "current",
      tag: "dev",
      desc: "Android Telecom API orqali kiruvchi va chiquvchi telefon qo'ng'iroqlariga ulanish. Samsung qo'ng'iroq menyusiga maxsus 'Translate' tugmasini joylash.",
      cost: 8000,
      tasks: [
        "Telecom ConnectionService va Connection sinflarini yozish",
        "Qo'ng'iroq menyusiga custom layout overlay qo'shish",
        "Ikki tomonlama audio oqimni (mikrofon va spiker) ajratib olish va qayta ishlash"
      ]
    },
    {
      id: 3,
      title: "3-bosqich: Offline to'liq versiya",
      time: "2 oy",
      status: "pending",
      tag: "dev",
      desc: "Whisper.cpp + NLLB + Coqui TTS modellarini to'liq mobil telefonga moslash. Modellarni faqat kerakli tillar bo'yicha dinamik yuklab olish tizimini yaratish.",
      cost: 10000,
      tasks: [
        "Whisper.cpp modelini Android NDK orqali C++ da optimallashtirish",
        "NLLB-200-Distilled-600M modelini ONNX/TFLite rejimiga o'tkazish",
        "Model downloader va MD5 checksum tekshiruvi tizimini yaratish"
      ]
    },
    {
      id: 4,
      title: "4-bosqich: Messenger integratsiyasi",
      time: "1.5 oy",
      status: "pending",
      tag: "dev",
      desc: "AccessibilityService va MediaProjection API orqali WhatsApp va Telegram messenjerlaridagi audio va matn oqimlarini ushlab olish va tarjima qilish.",
      cost: 5000,
      tasks: [
        "TranslationAccessibilityService klassini yaratish",
        "Ekran translyatsiyasi yordamida messenjer qo'ng'iroqlarini aniqlash",
        "Overlay chat bubble (tarjima subtitrlari) interfeysini yozish"
      ]
    },
    {
      id: 5,
      title: "5-bosqich: Test va optimallashtirish",
      time: "1 oy",
      status: "pending",
      tag: "testing",
      desc: "Batareya sarfini kamaytirish (soatiga 15% dan kamroq), RAM xotirani 4GB ichida ushlash. Android NN API orqali GPU/NPU tezlatgichlarini yoqish.",
      cost: 2000,
      tasks: [
        "Android Profiler orqali RAM va CPU sarfini o'lchash",
        "NPU/GPU neyron tarmoq tezlatgichlarini sozlash",
        "BLEU score va STT Word Error Rate (WER) testlarini o'tkazish"
      ]
    },
    {
      id: 6,
      title: "6-bosqich: Chiqarish (Release)",
      time: "0.5 oy",
      status: "pending",
      tag: "testing",
      desc: "Google Play Store va Samsung Galaxy Store do'konlariga yuklash. Kerakli Telecom/Accessibility ruxsatnomalarini olish.",
      cost: 2000,
      tasks: [
        "Store listing va vizual materiallarni tayyorlash",
        "Google Play Policy bo'yicha maxfiylik deklaratsiyasini to'ldirish",
        "Ilovani do'konlarga yuklash va tasdiqdan o'tkazish"
      ]
    }
  ]);

  const toggleTask = (phaseId, taskIndex) => {
    setPhases(prev => prev.map(p => {
      if (p.id === phaseId) {
        const newTasks = [...p.tasks];
        // Note: in a real app, tasks could be objects with completed state, 
        // but here we just toggle visual completed state of the phase if clicked
        return p;
      }
      return p;
    }));
  };

  return (
    <div className="archi-layout">
      {/* Interactive Blueprint Diagram */}
      <div className="glass-panel pipeline-diagram">
        <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers style={{ color: 'var(--secondary)' }} />
          Antigravity Offline Tarjima Pipeline (Tizim Arxitekturasi)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Quyidagi blok-sxemada audio signal mikrofondan kirib, tarjima bo'lib spikerga chiqqungacha bo'lgan offline AI quvuri tasvirlangan:
        </p>

        <div className="pipeline-nodes">
          <div className="glass-panel pipeline-node" style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
            <span style={{ fontSize: '18px' }}>🎙️</span>
            <div className="node-title">Audio Input</div>
            <div className="node-desc">16 kHz, 16-bit PCM Stream</div>
          </div>
          
          <div className="node-arrow" />

          <div className="glass-panel pipeline-node" style={{ borderColor: 'var(--secondary)', background: 'var(--secondary-glow)' }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <div className="node-title">VAD Engine</div>
            <div className="node-desc">Nutq faolligini aniqlash</div>
          </div>

          <div className="node-arrow" />

          <div className="glass-panel pipeline-node" style={{ borderColor: 'var(--primary)', background: 'var(--primary-glow)' }}>
            <span style={{ fontSize: '18px' }}>🧠</span>
            <div className="node-title">STT (Whisper/Vosk)</div>
            <div className="node-desc">Tilni aniqlash + Matnga o'tkazish</div>
          </div>

          <div className="node-arrow" />

          <div className="glass-panel pipeline-node" style={{ borderColor: 'var(--accent)', background: 'rgba(236, 72, 153, 0.15)' }}>
            <span style={{ fontSize: '18px' }}>🔤</span>
            <div className="node-title">Translation (NLLB)</div>
            <div className="node-desc">Matn tarjimasi (200+ til)</div>
          </div>

          <div className="node-arrow" />

          <div className="glass-panel pipeline-node" style={{ borderColor: 'var(--success)', background: 'rgba(16, 185, 129, 0.15)' }}>
            <span style={{ fontSize: '18px' }}>🔊</span>
            <div className="node-title">TTS (Coqui/Android)</div>
            <div className="node-desc">Matnni nutqqa o'girish (Ovoz)</div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '12px', lineHeight: '1.6' }}>
          <strong>Qurilma resurslarini tejash (Latency & Battery Optimization):</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '6px', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <li>• <strong>VAD (Voice Activity Detection)</strong>: Mikrofon jim turganda STT modelini to'xtatib turadi, bu batareyani 60% gacha tejaydi.</li>
            <li>• <strong>NPU API (Neural Processing Unit)</strong>: Android 14+ qurilmalarda neyron modellar yukini maxsus chipga o'tkazib, kechikishni 1.5 soniyadan kamaytiradi.</li>
            <li>• <strong>Quantization (Kvantlash)</strong>: Modellar hajmini 4 barobar kichraytirib (FP32 dan INT8 ga), RAM xotirani band qilishni cheklaydi.</li>
            <li>• <strong>Dynamic Load</strong>: Modellar xotirada doimiy turmaydi. Faqat qo'ng'iroq boshlanganda yuklanib, qo'ng'iroq tugagach xotiradan o'chiriladi.</li>
          </ul>
        </div>
      </div>

      {/* Development Roadmap (Timeline) */}
      <div className="glass-panel timeline-card">
        <div className="panel-header">
          <h2 className="panel-title">Loyiha Yo'l Xaritasi (Roadmap) va Byudjet</h2>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={14} style={{ color: 'var(--success)' }} /> Jami Byudjet: $40,000</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} style={{ color: 'var(--secondary)' }} /> Jami Muddat: 9 oy</span>
          </div>
        </div>

        <div className="timeline">
          {phases.map((phase) => (
            <div key={phase.id} className={`timeline-item ${phase.status}`}>
              <div className="timeline-dot" />
              
              <div className="timeline-header">
                <span className="timeline-title">
                  {phase.title}
                  {phase.status === 'completed' && <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />}
                </span>
                <span className={`timeline-tag ${phase.tag}`}>{phase.tag.toUpperCase()}</span>
              </div>

              <p className="timeline-desc">{phase.desc}</p>

              <div className="timeline-details">
                <div className="detail-row">
                  <span className="detail-label">Tahminiy muddat / Bosqich byudjeti:</span>
                  <span className="detail-val" style={{ color: 'var(--success)' }}>{phase.time} / ${phase.cost}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingPt: '8px', marginTop: '4px' }}>
                  <span style={{ fontWeight: '600', fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Asosiy Texnik Vazifalar:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {phase.tasks.map((task, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: phase.status === 'completed' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${phase.status === 'completed' ? 'var(--success)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justify: 'center', fontSize: '8px', color: 'var(--success)', marginTop: '2px' }}>
                          {phase.status === 'completed' && '✓'}
                        </span>
                        <span style={{ textDecoration: phase.status === 'completed' ? 'line-through' : 'none', color: phase.status === 'completed' ? 'var(--text-dark)' : 'var(--text-main)' }}>
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risks and Solutions Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <AlertTriangle style={{ color: 'var(--warning)' }} />
          Texnik Xavflar va Ularning Yechimlari (Risk & Mitigations)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontWeight: '700', fontSize: '13px', color: 'var(--warning)', marginBottom: '8px' }}>Xavf 1: Katta model o'lchamlari va xotira kamligi</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Offline AI modellarining umumiy o'lchami 15 GB gacha borishi mumkin. Bu foydalanuvchining telefon xotirasini to'ldirib qo'yishi va ilovani yuklab olishda qiyinchilik tug'diradi.
            </p>
            <div style={{ marginTop: '8px', borderTop: '1px solid rgba(245, 158, 11, 0.1)', paddingTop: '8px', fontSize: '12px' }}>
              <strong>Yechim:</strong> Modellarni guruhlarga bo'lish va foydalanuvchiga faqat u tanlagan tillarning modellarini yuklash imkoniyatini taqdim etish (masalan, faqat O'zbek-Ingliz to'plami ~1.8 GB bo'ladi).
            </div>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontWeight: '700', fontSize: '13px', color: 'var(--danger)', marginBottom: '8px' }}>Xavf 2: Samsung va Android xavfsizlik cheklovlari</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Android 14+ tizimida qo'ng'iroq audio oqimini (Telecom API) ushlash va boshqa ilovalar (WhatsApp/Telegram) oynalari ustidan rasm/matn chiqarish xavfsizlik nuqtai nazaridan cheklangan.
            </p>
            <div style={{ marginTop: '8px', borderTop: '1px solid rgba(239, 68, 68, 0.1)', paddingTop: '8px', fontSize: '12px' }}>
              <strong>Yechim:</strong> AccessibilityService va maxsus System Alert Window ruxsatnomalaridan foydalanish. Samsung B2B Knox SDK bilan hamkorlikda maxsus tizim ruxsatnomasini olish.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
