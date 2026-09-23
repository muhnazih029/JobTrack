import React, { useState } from 'react';
import { useJobTrack } from './hooks/useJobTrack';
import { Header } from './components/Header';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { KanbanBoard } from './components/KanbanBoard';
import { JobTable } from './components/JobTable';
import { JobModal } from './components/JobModal';
import { JobDetailsDrawer } from './components/JobDetailsDrawer';
import { AuthModal } from './components/AuthModal';
import { InterviewPrepView } from './components/InterviewPrepView';
import { FloatingAddButton } from './components/FloatingAddButton';

export default function App() {
  const {
    jobs,
    filteredJobs,
    analytics,
    theme,
    toggleTheme,
    user,
    login,
    register,
    logout,
    authError,
    clearAuthError,
    isAuthModalOpen,
    setIsAuthModalOpen,
    activeTab,
    setActiveTab,
    activeView,
    setActiveView,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedWorkType,
    setSelectedWorkType,
    sortBy,
    setSortBy,
    addJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    resetToSample
  } = useJobTrack();

  // Modal & Drawer State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState('Applied');
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);

  const handleOpenAddModal = (status = 'Applied') => {
    setEditingJob(null);
    setDefaultStatusForNew(status);
    setIsJobModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setIsJobModalOpen(true);
  };

  const handleJobModalSubmit = (formData) => {
    if (editingJob) {
      updateJob({
        ...editingJob,
        ...formData
      });

      if (selectedJobForDetails && selectedJobForDetails.id === editingJob.id) {
        setSelectedJobForDetails({
          ...selectedJobForDetails,
          ...formData
        });
      }
    } else {
      addJob(formData);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px 24px 80px' }}>
      
      {/* Professional Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={logout}
        onOpenAddModal={() => handleOpenAddModal('Applied')}
        onReset={resetToSample}
      />

      {/* Main Content Body */}
      {activeTab === 'dashboard' ? (
        <>
          {/* Executive Analytics Summary */}
          <AnalyticsSummary analytics={analytics} />

          {/* Main View: Kanban Board or Data Table */}
          <main>
            {activeView === 'kanban' ? (
              <KanbanBoard
                jobs={filteredJobs}
                onUpdateStatus={updateJobStatus}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onEditJob={handleOpenEditModal}
                onDeleteJob={deleteJob}
                onOpenAddModal={(status) => handleOpenAddModal(status)}
              />
            ) : (
              <JobTable
                jobs={filteredJobs}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedWorkType={selectedWorkType}
                setSelectedWorkType={setSelectedWorkType}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onUpdateStatus={updateJobStatus}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onEditJob={handleOpenEditModal}
                onDeleteJob={deleteJob}
              />
            )}
          </main>
        </>
      ) : (
        /* Interview Prep Checklist View */
        <InterviewPrepView jobs={jobs} />
      )}

      {/* Floating Action Button (+ Add Job) */}
      <FloatingAddButton onClick={() => handleOpenAddModal('Applied')} />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={login}
        onRegister={register}
        error={authError}
        clearError={clearAuthError}
      />

      {/* Job Create/Edit Modal */}
      <JobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSubmit={handleJobModalSubmit}
        initialData={editingJob}
        defaultStatus={defaultStatusForNew}
      />

      {/* Job Details Drawer */}
      <JobDetailsDrawer
        job={selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        onEdit={(job) => {
          setSelectedJobForDetails(null);
          handleOpenEditModal(job);
        }}
        onDelete={deleteJob}
        onUpdateStatus={updateJobStatus}
      />

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '24px'
      }}>
        JobTrack &copy; {new Date().getFullYear()} &bull; Professional Job Application Tracker &bull; Keamanan Password Hashing Argon2id & SQLite Database.
      </footer>

    </div>
  );
}
