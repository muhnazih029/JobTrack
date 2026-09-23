import React from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Eye, 
  Building2, 
  MapPin, 
  Calendar 
} from 'lucide-react';

export function JobTable({ 
  jobs, 
  searchTerm, 
  setSearchTerm, 
  selectedStatus, 
  setSelectedStatus, 
  selectedWorkType, 
  setSelectedWorkType, 
  sortBy, 
  setSortBy, 
  onUpdateStatus, 
  onSelectJob, 
  onEditJob, 
  onDeleteJob 
}) {
  const formatSalary = (min, max) => {
    if (!min && !max) return '-';
    const formatNum = (num) => (num / 1000000).toFixed(0);
    if (min && max) return `Rp ${formatNum(min)} - ${formatNum(max)} Jt`;
    if (min) return `Rp ${formatNum(min)}+ Jt`;
    return `s/d Rp ${formatNum(max)} Jt`;
  };

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      
      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Cari perusahaan, posisi, lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="ALL">Semua Status</option>
            <option value="Wishlist">Wishlist</option>
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Work Type Filter */}
          <select
            value={selectedWorkType}
            onChange={(e) => setSelectedWorkType(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="ALL">Semua Tipe Kerja</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="newest">Urutkan: Terbaru</option>
            <option value="oldest">Urutkan: Terlama</option>
            <option value="salary-high">Urutkan: Gaji Tertinggi</option>
            <option value="company">Urutkan: Perusahaan (A-Z)</option>
          </select>

        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Perusahaan & Posisi</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Tipe / Lokasi</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Range Gaji</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Tgl Apply</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Tidak ada data lamaran yang sesuai filter.
                </td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr
                  key={job.id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Company & Position */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      {job.position}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Building2 size={13} />
                      {job.company}
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={job.status}
                      onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                      className={`status-badge ${job.status.toLowerCase()}`}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none'
                      }}
                    >
                      <option value="Wishlist">Wishlist</option>
                      <option value="Applied">Applied</option>
                      <option value="Screening">Screening</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Work Type & Location */}
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: '600' }}>{job.workType || '-'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.location || '-'}</div>
                  </td>

                  {/* Salary */}
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </td>

                  {/* Applied Date */}
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    {job.appliedDate || '-'}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        className="btn btn-ghost btn-icon"
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => onSelectJob(job)}
                        title="Lihat Rincian"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon"
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => onEditJob(job)}
                        title="Edit Data"
                      >
                        <Edit3 size={15} />
                      </button>
                      {job.jobUrl && (
                        <a
                          href={job.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-ghost btn-icon"
                          style={{ width: '30px', height: '30px', display: 'inline-flex' }}
                          title="Buka Link Lowongan"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                      <button
                        className="btn btn-ghost btn-icon"
                        style={{ width: '30px', height: '30px', color: 'var(--status-rejected-text)' }}
                        onClick={() => {
                          if (window.confirm(`Hapus lamaran ${job.position} di ${job.company}?`)) {
                            onDeleteJob(job.id);
                          }
                        }}
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
