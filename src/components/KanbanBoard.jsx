import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Plus
} from 'lucide-react';

const STATUSES = [
  { id: 'Wishlist', title: 'Wishlist', className: 'wishlist', accent: '#94a3b8' },
  { id: 'Applied', title: 'Applied', className: 'applied', accent: '#3b82f6' },
  { id: 'Screening', title: 'Screening', className: 'screening', accent: '#f59e0b' },
  { id: 'Interview', title: 'Interview', className: 'interview', accent: '#a855f7' },
  { id: 'Offer', title: 'Offer / Accepted', className: 'offer', accent: '#10b981' },
  { id: 'Rejected', title: 'Rejected', className: 'rejected', accent: '#f43f5e' }
];

export function KanbanBoard({ 
  jobs, 
  onUpdateStatus, 
  onSelectJob, 
  onEditJob, 
  onDeleteJob,
  onOpenAddModal 
}) {
  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const formatNum = (num) => (num / 1000000).toFixed(0);
    if (min && max) return `Rp ${formatNum(min)} - ${formatNum(max)} Jt`;
    if (min) return `Rp ${formatNum(min)}+ Jt`;
    return `s/d Rp ${formatNum(max)} Jt`;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
      gap: '20px',
      alignItems: 'start',
      overflowX: 'auto',
      paddingBottom: '24px'
    }}>
      {STATUSES.map(col => {
        const colJobs = jobs.filter(j => j.status === col.id);

        return (
          <div 
            key={col.id} 
            className="glass-panel" 
            style={{
              padding: '18px',
              backgroundColor: 'var(--bg-secondary)',
              minHeight: '440px',
              display: 'flex',
              flexDirection: 'column',
              borderTop: `3px solid ${col.accent}`
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`status-badge ${col.className}`}>
                  <span className="status-dot"></span>
                  {col.title}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-input)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)'
                }}>
                  {colJobs.length}
                </span>
              </div>

              <button
                className="btn btn-ghost btn-icon"
                style={{ width: '28px', height: '28px' }}
                onClick={() => onOpenAddModal(col.id)}
                title={`Tambah lamaran di ${col.title}`}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Job Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              {colJobs.length === 0 ? (
                <div style={{
                  padding: '36px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '12px'
                }}>
                  Belum ada lamaran
                </div>
              ) : (
                colJobs.map(job => (
                  <div
                    key={job.id}
                    className="glass-panel animate-fade-in"
                    style={{
                      padding: '16px',
                      cursor: 'pointer',
                      position: 'relative',
                      background: 'var(--bg-card)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'var(--border-color-strong)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                    onClick={() => onSelectJob(job)}
                  >
                    {/* Top row: Company Avatar & Name */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="company-avatar">
                          {job.company.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {job.company}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {job.location || job.workType}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                        <button 
                          className="btn btn-ghost btn-icon" 
                          style={{ width: '26px', height: '26px' }}
                          onClick={() => onEditJob(job)}
                          title="Edit Data"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="btn btn-ghost btn-icon" 
                          style={{ width: '26px', height: '26px', color: 'var(--status-rejected-text)' }}
                          onClick={() => {
                            if (window.confirm(`Hapus lamaran ${job.position} di ${job.company}?`)) {
                              onDeleteJob(job.id);
                            }
                          }}
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Position Title */}
                    <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', lineHeight: '1.3' }}>
                      {job.position}
                    </h3>

                    {/* Work Type & Salary badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {job.workType && (
                        <span style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-secondary)',
                          fontWeight: '600'
                        }}>
                          {job.workType}
                        </span>
                      )}
                      {formatSalary(job.salaryMin, job.salaryMax) && (
                        <span className="font-mono" style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'var(--accent-light)',
                          color: 'var(--accent-primary)',
                          fontWeight: '600'
                        }}>
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      )}
                    </div>

                    {/* Footer Date & Status Selector */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-color)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        {job.appliedDate || 'Belum apply'}
                      </div>

                      {/* Quick Status Select */}
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          fontWeight: '700',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {STATUSES.map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
