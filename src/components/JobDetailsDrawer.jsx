import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Clock, 
  FileText,
  CheckCircle2
} from 'lucide-react';

export function JobDetailsDrawer({ job, onClose, onEdit, onDelete, onUpdateStatus }) {
  if (!job) return null;

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Tidak dicantumkan';
    const formatNum = (num) => (num / 1000000).toFixed(0);
    if (min && max) return `Rp ${formatNum(min)} - ${formatNum(max)} Jt / bulan`;
    if (min) return `Rp ${formatNum(min)}+ Jt / bulan`;
    return `s/d Rp ${formatNum(max)} Jt / bulan`;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 1000
    }} onClick={onClose}>
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          borderRadius: '0',
          borderLeft: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className={`status-badge ${job.status.toLowerCase()}`}>
                <span className="status-dot"></span>
                {job.status}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {job.workType}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', lineHeight: '1.2' }}>
              {job.position}
            </h2>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={16} />
              {job.company}
            </div>
          </div>

          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Action Toolbar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          paddingBottom: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.82rem' }} onClick={() => onEdit(job)}>
            <Edit3 size={15} />
            Edit Data
          </button>
          
          {job.jobUrl && (
            <a 
              href={job.jobUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <ExternalLink size={15} />
              Buka URL
            </a>
          )}

          <button 
            className="btn btn-secondary btn-icon" 
            style={{ color: 'var(--status-rejected-text)' }}
            onClick={() => {
              if (window.confirm(`Hapus lamaran di ${job.company}?`)) {
                onDelete(job.id);
                onClose();
              }
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Key Info Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
          marginBottom: '24px',
          background: 'var(--bg-card)',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Lokasi</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{job.location || '-'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Range Gaji</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
              {formatSalary(job.salaryMin, job.salaryMax)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Tanggal Apply</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{job.appliedDate || '-'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Target Follow Up</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{job.followUpDate || '-'}</div>
          </div>
        </div>

        {/* Notes & Context */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={15} />
            Catatan & Persiapan
          </h3>
          <div style={{
            background: 'var(--bg-input)',
            padding: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6'
          }}>
            {job.notes || 'Belum ada catatan khusus.'}
          </div>
        </div>

        {/* Status Timeline History */}
        <div style={{ marginTop: 'auto' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} />
            Riwayat Perkembangan
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(!job.timeline || job.timeline.length === 0) ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Belum ada log riwayat.</div>
            ) : (
              job.timeline.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--accent-light)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700' }}>
                      Status: <span style={{ color: 'var(--accent-primary)' }}>{item.status}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {item.date} — {item.note || 'Pembaruan status'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
