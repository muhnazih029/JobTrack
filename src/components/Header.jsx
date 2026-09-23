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
  ChevronDown
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
  const profileMenuRef = useRef(null);

  // Close dropdown on click outside
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
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Briefcase size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              JobTrack
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Professional Job Application Dashboard
            </p>
          </div>
        </div>

        {/* Center Main Navigation Tabs */}
        <div style={{
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

        {/* Right Tools & User Profile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* View Switcher (Kanban / Table) if on Dashboard */}
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

            {/* Profile Dropdown Items */}
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

                {/* Reset Database Menu Item inside Settings Dropdown */}
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

                {/* Logout Button */}
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

      </div>
    </header>
  );
}
