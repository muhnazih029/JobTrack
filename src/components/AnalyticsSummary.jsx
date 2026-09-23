import React from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Target, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

export function AnalyticsSummary({ analytics }) {
  const {
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
  } = analytics;

  const evaluatedTotal = Math.max(1, total - wishlist);
  const pctApplied = Math.round((applied / evaluatedTotal) * 100);
  const pctScreening = Math.round((screening / evaluatedTotal) * 100);
  const pctInterview = Math.round((interview / evaluatedTotal) * 100);
  const pctOffer = Math.round((offer / evaluatedTotal) * 100);
  const pctRejected = Math.round((rejected / evaluatedTotal) * 100);

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Bento Grid Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Total Applications */}
        <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Lamaran
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Briefcase size={17} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1' }}>
            {total}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{wishlist} Lamaran di Wishlist</span>
          </div>
        </div>

        {/* Active Pipeline */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pipeline Aktif
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={17} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1', color: '#fbbf24' }}>
            {activePipeline}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {applied} Applied &bull; {screening} Screening &bull; {interview} Interview
          </div>
        </div>

        {/* Offers */}
        <div className="glass-panel" style={{ 
          padding: '20px', 
          borderColor: offer > 0 ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
          boxShadow: offer > 0 ? '0 0 20px rgba(16, 185, 129, 0.12)' : 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Penawaran (Offer)
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.18)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1', color: '#34d399' }}>
            {offer}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {rejected} Lamaran Ditolak
          </div>
        </div>

        {/* Success Rate */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Win Rate & Response
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={17} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1' }}>
            {winRate}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Response Rate: <strong style={{ color: 'var(--text-primary)' }}>{responseRate}%</strong>
          </div>
        </div>
      </div>

      {/* Funnel Progress Breakdown Bar */}
      <div className="glass-panel" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Funnel Breakdown
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Dievaluasi: {evaluatedTotal} lamaran
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div style={{
          display: 'flex',
          height: '10px',
          borderRadius: '9999px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-input)',
          marginBottom: '14px',
          border: '1px solid var(--border-color)'
        }}>
          {pctApplied > 0 && <div style={{ width: `${pctApplied}%`, background: 'var(--status-applied-text)' }} title={`Applied: ${applied}`} />}
          {pctScreening > 0 && <div style={{ width: `${pctScreening}%`, background: 'var(--status-screening-text)' }} title={`Screening: ${screening}`} />}
          {pctInterview > 0 && <div style={{ width: `${pctInterview}%`, background: 'var(--status-interview-text)' }} title={`Interview: ${interview}`} />}
          {pctOffer > 0 && <div style={{ width: `${pctOffer}%`, background: 'var(--status-offer-text)' }} title={`Offer: ${offer}`} />}
          {pctRejected > 0 && <div style={{ width: `${pctRejected}%`, background: 'var(--status-rejected-text)' }} title={`Rejected: ${rejected}`} />}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', fontSize: '0.78rem', fontWeight: '600' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-wishlist-text)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Wishlist ({wishlist})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-applied-text)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Applied ({applied})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-screening-text)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Screening ({screening})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-interview-text)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Interview ({interview})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-offer-text)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Offer ({offer})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-rejected-text)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Rejected ({rejected})</span>
          </div>
        </div>

      </div>
    </div>
  );
}
