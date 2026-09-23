import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  UserCheck, 
  Code2, 
  HelpCircle
} from 'lucide-react';

const STORAGE_KEY = 'jobtrack_interview_checklists_v1';

const DEFAULT_CHECKLISTS = [
  { id: 'hr-1', category: 'HR Interview', text: 'Siapkan perkenalan diri (Elevator Pitch) 2 menit', done: true },
  { id: 'hr-2', category: 'HR Interview', text: 'Riset profil & produk terbaru perusahaan', done: true },
  { id: 'hr-3', category: 'HR Interview', text: 'Tentukan range ekspektasi gaji berdasarkan riset pasar', done: false },
  { id: 'tech-1', category: 'Technical Interview', text: 'Review arsitektur proyek utama & keputusan teknis', done: false },
  { id: 'tech-2', category: 'Technical Interview', text: 'Latihan live coding & struktur data dasar', done: true },
  { id: 'tech-3', category: 'Technical Interview', text: 'Siapkan contoh penanganan tantangan teknis tersulit', done: false },
  { id: 'questions-1', category: 'Pertanyaan Balik', text: 'Tanyakan ekspektasi tim untuk 90 hari pertama', done: false },
  { id: 'questions-2', category: 'Pertanyaan Balik', text: 'Tanyakan tantangan teknis terbesar tim saat ini', done: false }
];

export function InterviewPrepView({ jobs }) {
  const interviewJobs = jobs.filter(j => j.status === 'Interview' || j.status === 'Screening' || j.status === 'Offer');
  const [selectedJobId, setSelectedJobId] = useState(interviewJobs[0]?.id || jobs[0]?.id || '');

  // Persistent Checklist State
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading checklist:', e);
    }
    return DEFAULT_CHECKLISTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
    } catch (e) {
      console.error('Error saving checklist:', e);
    }
  }, [checklist]);

  // Modal State for Add & Edit Checklist Item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formText, setFormText] = useState('');
  const [formCategory, setFormCategory] = useState('HR Interview');

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleOpenAddModal = (category = 'HR Interview') => {
    setEditingItem(null);
    setFormText('');
    setFormCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormText(item.text);
    setFormCategory(item.category);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Hapus item checklist ini?')) {
      setChecklist(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formText.trim()) return;

    if (editingItem) {
      setChecklist(prev => prev.map(c => c.id === editingItem.id ? { ...c, text: formText, category: formCategory } : c));
    } else {
      const newItem = {
        id: `item-${Date.now()}`,
        category: formCategory,
        text: formText,
        done: false
      };
      setChecklist(prev => [...prev, newItem]);
    }

    setIsModalOpen(false);
  };

  const completedCount = checklist.filter(c => c.done).length;
  const progressPct = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const categories = Array.from(new Set(checklist.map(c => c.category)));

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
              Kelola dan kustomisasi templat persiapan HR & Technical Interview Anda
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => handleOpenAddModal('HR Interview')}
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              <Plus size={16} />
              Tambah Checklist
            </button>

            <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>
              Kesiapan: <span style={{ color: 'var(--accent-primary)' }}>{progressPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
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

        {/* Right: Checklist Items with CRUD */}
        <div className="glass-panel" style={{ padding: '20px', gridColumn: 'span 2' }}>
          {selectedJob ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Persiapan Untuk {selectedJob.company}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                    {selectedJob.position}
                  </h3>
                </div>
                
                <button
                  className="btn btn-secondary"
                  onClick={() => handleOpenAddModal('HR Interview')}
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  <Plus size={14} />
                  Tambah Item
                </button>
              </div>

              {/* Checklist Categories */}
              {categories.map(cat => {
                const items = checklist.filter(c => c.category === cat);
                return (
                  <div key={cat} style={{ marginBottom: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {cat === 'HR Interview' && <UserCheck size={16} />}
                        {cat === 'Technical Interview' && <Code2 size={16} />}
                        {cat === 'Pertanyaan Balik' && <HelpCircle size={16} />}
                        {cat}
                      </h4>
                      <button
                        className="btn btn-ghost btn-icon"
                        style={{ width: '24px', height: '24px' }}
                        onClick={() => handleOpenAddModal(cat)}
                        title={`Tambah item ke ${cat}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {items.map(item => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.85rem'
                          }}
                        >
                          <div 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                              flex: 1,
                              color: item.done ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: item.done ? 'line-through' : 'none'
                            }}
                            onClick={() => toggleCheck(item.id)}
                          >
                            {item.done ? <CheckSquare size={18} color="var(--accent-primary)" /> : <Square size={18} color="var(--text-muted)" />}
                            <span>{item.text}</span>
                          </div>

                          {/* Actions: Edit & Delete */}
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              className="btn btn-ghost btn-icon"
                              style={{ width: '26px', height: '26px' }}
                              onClick={() => handleOpenEditModal(item)}
                              title="Edit item"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              className="btn btn-ghost btn-icon"
                              style={{ width: '26px', height: '26px', color: 'var(--status-rejected-text)' }}
                              onClick={() => handleDeleteItem(item.id)}
                              title="Hapus item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
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

      {/* Add / Edit Checklist Item Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }} onClick={() => setIsModalOpen(false)}>
          <div
            className="glass-panel animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: '24px',
              backgroundColor: 'var(--bg-secondary)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>
                {editingItem ? 'Edit Item Checklist' : 'Tambah Item Checklist Baru'}
              </h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Kategori
                </label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="HR Interview">HR Interview</option>
                  <option value="Technical Interview">Technical Interview</option>
                  <option value="Pertanyaan Balik">Pertanyaan Balik</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Detail Persiapan / Pertanyaan
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Latihan penjelasan arsitektur mikro-frontend..."
                  value={formText}
                  onChange={e => setFormText(e.target.value)}
                  required
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  Simpan Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
