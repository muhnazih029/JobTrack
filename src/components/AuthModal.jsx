import React, { useState } from 'react';
import { ShieldCheck, LogIn, UserPlus, X } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onLogin, onRegister, error, clearError }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();
    if (isRegisterMode) {
      if (!formData.name.trim()) {
        alert('Nama lengkap harus diisi.');
        return;
      }
      onRegister(formData.name, formData.email, formData.password);
    } else {
      onLogin(formData.email, formData.password);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
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
          maxWidth: '420px',
          padding: '28px',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Security Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                {isRegisterMode ? 'Buat Akun Baru' : 'Login JobTrack'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Keamanan Standar Kriptografi Argon2id
              </p>
            </div>
          </div>

          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            className={`btn ${!isRegisterMode ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, fontSize: '0.8rem', padding: '6px' }}
            onClick={() => { setIsRegisterMode(false); clearError(); }}
          >
            <LogIn size={15} />
            Masuk / Login
          </button>
          <button
            type="button"
            className={`btn ${isRegisterMode ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, fontSize: '0.8rem', padding: '6px' }}
            onClick={() => { setIsRegisterMode(true); clearError(); }}
          >
            <UserPlus size={15} />
            Daftar Akun
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'var(--status-rejected-bg)',
            color: 'var(--status-rejected-text)',
            fontSize: '0.8rem',
            marginBottom: '16px',
            border: '1px solid var(--status-rejected-text)'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {isRegisterMode && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Contoh: Muh Nazih"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required={isRegisterMode}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Alamat Email
            </label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '10px' }}>
            {isRegisterMode ? 'Daftar Sekarang' : 'Masuk ke Dashboard'}
          </button>
        </form>

        {/* Security Note Footer */}
        <div style={{
          marginTop: '20px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          🛡️ Password dienkripsi aman dengan <strong>Argon2id Memory Hashing</strong> pada SQLite Database.
        </div>

      </div>
    </div>
  );
}
