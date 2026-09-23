import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';

const THEME_KEY = 'jobtrack_theme_v1';
const AUTH_TOKEN_KEY = 'jobtrack_auth_token_v1';

export function useJobTrack() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth State
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || '';
  });

  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active Main Tab: 'dashboard' | 'interview-prep'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeView, setActiveView] = useState('kanban');

  // Jobs State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedWorkType, setSelectedWorkType] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  const triggerCelebration = () => {
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  // Check Current Session (GET /api/auth/me)
  const checkSession = useCallback(async (token) => {
    if (!token) {
      setUser(null);
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && json.user) {
        setUser(json.user);
      } else {
        // Invalid token
        setAuthToken('');
        setUser(null);
        setJobs([]);
      }
    } catch (err) {
      console.error('Error checking auth session:', err);
      setUser(null);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Jobs from API
  const fetchJobs = useCallback(async () => {
    if (!authToken) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/jobs', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (res.status === 401) {
        setAuthToken('');
        setUser(null);
        setJobs([]);
        setIsAuthModalOpen(true);
        return;
      }

      const json = await res.json();
      if (json.success) {
        setJobs(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
      checkSession(authToken);
      fetchJobs();
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
      setJobs([]);
      setLoading(false);
    }
  }, [authToken, checkSession, fetchJobs]);

  // Login Handler
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success && json.token) {
        setAuthToken(json.token);
        setUser(json.user);
        setIsAuthModalOpen(false);
        return true;
      } else {
        setAuthError(json.error || 'Login gagal.');
        return false;
      }
    } catch (err) {
      setAuthError('Gagal terhubung ke API server.');
      return false;
    }
  };

  // Register Handler
  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const json = await res.json();
      if (json.success && json.token) {
        setAuthToken(json.token);
        setUser(json.user);
        setIsAuthModalOpen(false);
        return true;
      } else {
        setAuthError(json.error || 'Registrasi gagal.');
        return false;
      }
    } catch (err) {
      setAuthError('Gagal terhubung ke API server.');
      return false;
    }
  };

  // Logout Handler (Cleanly clear auth state and token)
  const logout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken('');
    setUser(null);
    setJobs([]);
    setIsAuthModalOpen(true);
  };

  // CRUD Operations
  const addJob = async (jobData) => {
    if (!authToken) {
      setIsAuthModalOpen(true);
      return;
    }

    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      appliedDate: jobData.appliedDate || new Date().toISOString().split('T')[0],
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          status: jobData.status || 'Applied',
          note: 'Lamaran dibuat'
        }
      ]
    };

    setJobs(prev => [newJob, ...prev]);

    if (newJob.status === 'Offer') {
      triggerCelebration();
    }

    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(newJob)
      });
      fetchJobs();
    } catch (err) {
      console.error('Error adding job:', err);
    }
  };

  const updateJob = async (updatedJob) => {
    if (!authToken) return;

    const targetJob = jobs.find(j => j.id === updatedJob.id);
    const statusChanged = targetJob && targetJob.status !== updatedJob.status;

    const newTimeline = statusChanged
      ? [
          ...(updatedJob.timeline || []),
          {
            date: new Date().toISOString().split('T')[0],
            status: updatedJob.status,
            note: `Status diperbarui ke ${updatedJob.status}`
          }
        ]
      : updatedJob.timeline || [];

    const payload = { ...updatedJob, timeline: newTimeline };

    setJobs(prev => prev.map(j => (j.id === updatedJob.id ? payload : j)));

    if (updatedJob.status === 'Offer' && statusChanged) {
      triggerCelebration();
    }

    try {
      await fetch(`/api/jobs/${updatedJob.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
      fetchJobs();
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  const deleteJob = async (id) => {
    if (!authToken) return;
    setJobs(prev => prev.filter(j => j.id !== id));

    try {
      await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const updateJobStatus = async (id, newStatus) => {
    const targetJob = jobs.find(j => j.id === id);
    if (!targetJob) return;
    updateJob({ ...targetJob, status: newStatus });
  };

  const resetToSample = async () => {
    if (!authToken) return;
    try {
      await fetch('/api/jobs/reset', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      fetchJobs();
    } catch (err) {
      console.error('Error resetting DB:', err);
    }
  };

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = searchTerm === '' ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = selectedStatus === 'ALL' || job.status === selectedStatus;
      const matchWorkType = selectedWorkType === 'ALL' || job.workType === selectedWorkType;

      return matchSearch && matchStatus && matchWorkType;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
      if (sortBy === 'oldest') return new Date(a.appliedDate || 0) - new Date(b.appliedDate || 0);
      if (sortBy === 'salary-high') return (b.salaryMax || 0) - (a.salaryMax || 0);
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      return 0;
    });
  }, [jobs, searchTerm, selectedStatus, selectedWorkType, sortBy]);

  // Analytics Computation
  const analytics = useMemo(() => {
    const total = jobs.length;
    const wishlist = jobs.filter(j => j.status === 'Wishlist').length;
    const applied = jobs.filter(j => j.status === 'Applied').length;
    const screening = jobs.filter(j => j.status === 'Screening').length;
    const interview = jobs.filter(j => j.status === 'Interview').length;
    const offer = jobs.filter(j => j.status === 'Offer').length;
    const rejected = jobs.filter(j => j.status === 'Rejected').length;

    const activePipeline = applied + screening + interview;
    const evaluatedApplications = total - wishlist;
    const winRate = evaluatedApplications > 0 ? Math.round((offer / evaluatedApplications) * 100) : 0;
    const responseRate = (total - wishlist) > 0 
      ? Math.round(((screening + interview + offer + rejected) / (total - wishlist)) * 100) 
      : 0;

    return {
      total,
      wishlist,
      applied,
      screening,
      interview,
      offer,
      rejected,
      activePipeline,
      winRate,
      responseRate
    };
  }, [jobs]);

  return {
    jobs,
    filteredJobs,
    analytics,
    loading,
    theme,
    toggleTheme,
    user,
    login,
    register,
    logout,
    authError,
    clearAuthError: () => setAuthError(null),
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
  };
}
