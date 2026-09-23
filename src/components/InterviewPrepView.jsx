import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Building2, 
  Calendar, 
  Sparkles, 
  HelpCircle, 
  Code2, 
  UserCheck 
} from 'lucide-react';

const INITIAL_CHECKLISTS = [
  { id: 'hr-1', category: 'HR Interview', text: 'Siapkan perkenalan diri (Elevator Pitch) 2 menit', done: true },
  { id: 'hr-2', category: 'HR Interview', text: 'Riset profil & berita terbaru tentang perusahaan', done: true },
  { id: 'hr-3', category: 'HR Interview', text: 'Tentukan range ekspektasi gaji berdasarkan riset pasar', done: false },
  { id: 'tech-1', category: 'Technical Interview', text: 'Review konsep arsitektur proyek terbaru yang diselesaikan', done: false },
  { id: 'tech-2', category: 'Technical Interview', text: 'Latihan live coding & struktur data dasar (Array, Hash, Graph)', done: true },
  { id: 'tech-3', category: 'Technical Interview', text: 'Siapkan contoh penanganan tantangan teknis/bug tersulit', done: false },
  { id: 'questions-1', category: 'Pertanyaan Balik', text: 'Tanyakan ekspektasi tim untuk 90 hari pertama', done: false },
  { id: 'questions-2', category: 'Pertanyaan Balik', text: 'Tanyakan tantangan terbesar tim saat ini', done: false }
];

export function InterviewPrepView({ jobs }) {
  const interviewJobs = jobs.filter(j => j.status === 'Interview' || j.status === 'Screening' || j.status === 'Offer');
  const [selectedJobId, setSelectedJobId] = useState(interviewJobs[0]?.id || jobs[0]?.id);
  const [checklist, setChecklist] = useState(INITIAL_CHECKLISTS);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const completedCount = checklist.filter(c => c.done).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      
      {/* Header Info */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
              Interview Prep & Checklist Master
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Panduan dan templat persiapan lengkap menghadapi HR & Technical Interview
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>
              Kesiapan: <span style={{ color: 'var(--accent-primary)' }}>{progressPct}%</span>
            </div>
            <div style={{
              width: '120px',
              height: '8px',
              borderRadius: '999px',
              background: 'var(--bg-input)',
              overflow: 'hidden',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'var(--accent-primary)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Left: Job Selector */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Pilih Target Interview ({interviewJobs.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {interviewJobs.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Belum ada lamaran di tahap Screening atau Interview.
              </div>
            ) : (
              interviewJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: selectedJobId === job.id ? 'var(--accent-light)' : 'var(--bg-input)',
                    border: '1px solid',
                    borderColor: selectedJobId === job.id ? 'var(--accent-primary)' : 'var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)' }}>
                      {job.company}
                    </span>
                    <span className={`status-badge ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {job.position}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Checklist Items */}
        <div className="glass-panel" style={{ padding: '20px', gridColumn: 'span 2' }}>
          {selectedJob ? (
            <div>
              <div style={{ paddingBottom: '14px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Persiapan Untuk {selectedJob.company}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                  {selectedJob.position}
                </h3>
              </div>

              {/* Checklist Categories */}
              {['HR Interview', 'Technical Interview', 'Pertanyaan Balik'].map(cat => {
                const items = checklist.filter(c => c.category === cat);
                return (
                  <div key={cat} style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {cat === 'HR Interview' && <UserCheck size={16} />}
                      {cat === 'Technical Interview' && <Code2 size={16} />}
                      {cat === 'Pertanyaan Balik' && <HelpCircle size={16} />}
                      {cat}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {items.map(item => (
                        <div
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            color: item.done ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: item.done ? 'line-through' : 'none'
                          }}
                        >
                          {item.done ? <CheckSquare size={18} color="var(--accent-primary)" /> : <Square size={18} color="var(--text-muted)" />}
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Pilih salah satu lamaran di sebelah kiri untuk mulai mengelola checklist persiapan interview.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
