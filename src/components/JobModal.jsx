import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export function JobModal({ isOpen, onClose, onSubmit, initialData = null, defaultStatus = 'Applied' }) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    workType: 'Remote',
    location: '',
    salaryMin: '',
    salaryMax: '',
    appliedDate: new Date().toISOString().split('T')[0],
    followUpDate: '',
    jobUrl: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        position: initialData.position || '',
        status: initialData.status || 'Applied',
        workType: initialData.workType || 'Remote',
        location: initialData.location || '',
        salaryMin: initialData.salaryMin || '',
        salaryMax: initialData.salaryMax || '',
        appliedDate: initialData.appliedDate || new Date().toISOString().split('T')[0],
        followUpDate: initialData.followUpDate || '',
        jobUrl: initialData.jobUrl || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        company: '',
        position: '',
        status: defaultStatus || 'Applied',
        workType: 'Remote',
        location: '',
        salaryMin: '',
        salaryMax: '',
        appliedDate: new Date().toISOString().split('T')[0],
        followUpDate: '',
        jobUrl: '',
        notes: ''
      });
    }
  }, [initialData, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.position.trim()) {
      alert('Nama perusahaan dan posisi harus diisi.');
      return;
    }

    onSubmit({
      ...formData,
      salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }} onClick={onClose}>
      <div 
        className="glass-panel animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>
            {initialData ? 'Edit Data Lamaran' : 'Tambah Lamaran Baru'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Company & Position */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Nama Perusahaan *
              </label>
              <input
                type="text"
                placeholder="Contoh: Tokopedia"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Posisi / Jabatan *
              </label>
              <input
                type="text"
                placeholder="Contoh: Frontend Engineer"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Status & Work Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Status Lamaran
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Tipe Kerja
              </label>
              <select
                value={formData.workType}
                onChange={e => setFormData({ ...formData, workType: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Location & Salary Range */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Lokasi
              </label>
              <input
                type="text"
                placeholder="Jakarta / Remote"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Gaji Min (IDR)
              </label>
              <input
                type="number"
                placeholder="20000000"
                value={formData.salaryMin}
                onChange={e => setFormData({ ...formData, salaryMin: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Gaji Max (IDR)
              </label>
              <input
                type="number"
                placeholder="28000000"
                value={formData.salaryMax}
                onChange={e => setFormData({ ...formData, salaryMax: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Applied Date & Follow Up Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Tanggal Apply
              </label>
              <input
                type="date"
                value={formData.appliedDate}
                onChange={e => setFormData({ ...formData, appliedDate: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Target Follow Up
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Link Lowongan (URL)
            </label>
            <input
              type="url"
              placeholder="https://www.linkedin.com/jobs/..."
              value={formData.jobUrl}
              onChange={e => setFormData({ ...formData, jobUrl: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Catatan & Detail Interview
            </label>
            <textarea
              rows={3}
              placeholder="Catatan recruiter, persiapan interview, benefit, dll..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              Simpan Lamaran
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
