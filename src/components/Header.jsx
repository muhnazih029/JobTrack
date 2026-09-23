import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  LogIn, 
  RotateCcw,
  CheckSquare,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export function Header({ 
  activeTab,
  setActiveTab,
  activeView, 
  setActiveView, 
  theme, 
  toggleTheme, 
  user,
  onOpenAuthModal,
  onLogout,
  onOpenAddModal, 
  onReset 
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Briefcase size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              JobTrack
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} className="desktop-only">
              Professional Job Application Dashboard
            </p>
          </div>
        </div>

        {/* Center Main Navigation Tabs (Desktop) */}
        <div className="desktop-only" style={{
          display: 'flex',
          background: 'var(--bg-input)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <LayoutGrid size={15} />
            Dashboard
          </button>
          <button
            className={`btn ${activeTab === 'interview-prep' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('interview-prep')}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <CheckSquare size={15} />
            Interview Prep
          </button>
        </div>

        {/* Right Tools & User Profile Menu (Desktop) */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* View Switcher (Kanban / Table) */}
          {activeTab === 'dashboard' && (
            <div style={{
              display: 'flex',
              background: 'var(--bg-input)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <button
                className={`btn ${activeView === 'kanban' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveView('kanban')}
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                title="Tampilan Kanban Board"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                className={`btn ${activeView === 'table' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveView('table')}
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                title="Tampilan Tabel Data"
              >
                <TableIcon size={14} />
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary btn-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Profile Dropdown Menu */}
          <div style={{ position: 'relative' }} ref={profileMenuRef}>
            {user ? (
              <button
                className="btn btn-secondary"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ padding: '6px 12px', fontSize: '0.82rem', gap: '6px' }}
              >
                <User size={15} />
                <span>{user.name}</span>
                <ChevronDown size={14} />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={onOpenAuthModal}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <LogIn size={15} />
                Masuk / Login
              </button>
            )}

            {isProfileOpen && user && (
              <div 
                className="glass-panel animate-fade-in"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '220px',
                  padding: '8px',
                  zIndex: 200,
                  backgroundColor: 'var(--bg-secondary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '6px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user.email}
                  </div>
                </div>

                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (window.confirm('Reset SQLite Database ke sampel data awal? Data Anda saat ini akan di-overwrite.')) {
                      onReset();
                    }
                  }}
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                >
                  <RotateCcw size={15} />
                  Reset Database
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', color: 'var(--status-rejected-text)' }}
                >
                  <LogOut size={15} />
                  Keluar / Logout
                </button>
              </div>
            )}
          </div>

          {/* Primary Add Job Button */}
          <button 
            className="btn btn-primary"
            onClick={onOpenAddModal}
            style={{ padding: '8px 16px' }}
          >
            <Plus size={18} />
            Tambah
          </button>
        </div>

        {/* Mobile Navbar Hamburger Controls */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn btn-primary btn-icon"
            onClick={onOpenAddModal}
            title="Tambah Lamaran Baru"
          >
            <Plus size={18} />
          </button>

          <button
            className="btn btn-secondary btn-icon"
            onClick={() => setIsMobileMenuOpen(true)}
            title="Buka Menu Navigasi"
          >
            <Menu size={20} />
          </button>
        </div>

      </div>

      {/* Mobile Slide Drawer Navigation */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="glass-panel animate-fade-in"
            style={{
              width: '280px',
              height: '100%',
              borderRadius: 0,
              backgroundColor: 'var(--bg-secondary)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1rem', fontWeight: '800' }}>Menu Navigasi</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* User Info Card */}
            {user ? (
              <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
              >
                <LogIn size={16} />
                Masuk / Login
              </button>
            )}

            {/* Navigation Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMobileMenuOpen(false);
                }}
              >
                <LayoutGrid size={16} />
                Dashboard Utama
              </button>

              <button
                className={`btn ${activeTab === 'interview-prep' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => {
                  setActiveTab('interview-prep');
                  setIsMobileMenuOpen(false);
                }}
              >
                <CheckSquare size={16} />
                Interview Prep Master
              </button>
            </div>

            {/* View Switcher (Kanban / Table) */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Mode Tampilan</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`btn ${activeView === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, fontSize: '0.78rem' }}
                    onClick={() => setActiveView('kanban')}
                  >
                    Kanban
                  </button>
                  <button
                    className={`btn ${activeView === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, fontSize: '0.78rem' }}
                    onClick={() => setActiveView('table')}
                  >
                    Tabel
                  </button>
                </div>
              </div>
            )}

            {/* Secondary Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => {
                  toggleTheme();
                }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>

              {user && (
                <>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (window.confirm('Reset SQLite Database ke sampel data awal?')) {
                        onReset();
                      }
                    }}
                  >
                    <RotateCcw size={16} />
                    Reset Database
                  </button>

                  <button
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--status-rejected-text)' }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={16} />
                    Keluar / Logout
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
