import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyzeProfile } from '../services/api';

export default function CompanyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedCompany');
    if (!stored) { navigate('/dashboard'); return; }
    const parsed = JSON.parse(stored);
    setData(parsed);
    fetchCompanyPlan(parsed);
  }, []);

  async function fetchCompanyPlan(parsed) {
    setLoading(true);
    try {
      const dashData = JSON.parse(sessionStorage.getItem('dashboardData') || '{}');
      const connected = dashData.connected || {};

      const response = await fetch('https://placemint-backend-02uy.onrender.com/api/company-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          company: parsed.company,
          role: parsed.role,
          skills: parsed.skills,
          gaps: parsed.gaps,
          leetcode: connected.leetcode || {},
          github: connected.github || {},
        })
      });
      const res = await response.json();
      setResult(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#8FAF8F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔍</div>
        <div style={{ color: '#1E2A14', fontSize: '15px', fontWeight: 600 }}>Analyzing {data?.company?.name} requirements...</div>
        <div style={{ color: '#3D5230', fontSize: '13px', marginTop: '6px' }}>AI is building your personalized plan</div>
      </div>
    </div>
  );

  if (!result) return (
    <div style={{ minHeight: '100vh', background: '#8FAF8F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ color: '#1E2A14' }}>Something went wrong. <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Go back</span></div>
    </div>
  );

  const pct = Math.round(data?.company?.eligibility || 0);
  const color = pct >= 80 ? '#2D6A4F' : pct >= 60 ? '#8A6A30' : '#8A3A3A';

  return (
    <div style={{ minHeight: '100vh', background: '#8FAF8F', color: '#1E2A14', fontFamily: 'Outfit, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', borderBottom: '1px solid #6A8F6A',
        background: '#7A9E7A', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E2A14' }}>PlaceMint</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#2C3B1E' }}>Hi, {user?.name} 👋</span>
          <button onClick={() => navigate('/dashboard')} style={btnSecondary}>← Back to Dashboard</button>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#1E2A14', borderRadius: '100px', padding: '5px 14px',
            fontSize: '12px', color: '#A8C898', fontWeight: 600, marginBottom: '12px'
          }}>
            ✦ {data?.role}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', color: '#1E2A14' }}>
              {data?.company?.name} — Improvement Plan
            </h1>
            <div style={{
              background: '#1E2A14', color: '#A8C898',
              borderRadius: '100px', padding: '6px 16px',
              fontSize: '14px', fontWeight: 800
            }}>
              Currently {pct}%
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#2C3B1E', marginTop: '6px' }}>
            Personalized roadmap to improve your eligibility for {data?.company?.name}
          </p>
        </div>

        {/* Progress */}
        <div style={cardStyle}>
          <div style={sectionLabel}>📊 Eligibility Progress</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#3D5230', marginBottom: '4px' }}>Current</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#8A3A3A' }}>{pct}%</div>
            </div>
            <div style={{ fontSize: '24px', color: '#3D5230', alignSelf: 'center' }}>→</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#3D5230', marginBottom: '4px' }}>Target to apply</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#2D6A4F' }}>80%</div>
            </div>
          </div>
          <div style={{ height: '10px', background: '#C8D4B0', borderRadius: '100px', overflow: 'hidden', marginBottom: '6px' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '100px', transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#3D5230' }}>
            <span>0%</span>
            <span style={{ color: '#8A3A3A' }}>{pct}% — you now</span>
            <span style={{ color: '#2D6A4F' }}>80% — safe to apply</span>
            <span>100%</span>
          </div>
        </div>

        {/* Factor breakdown */}
        {result.factors && (
          <div style={cardStyle}>
            <div style={sectionLabel}>🎯 Score Breakdown</div>
            {result.factors.map((f, i) => {
              const fc = f.you >= f.need ? '#2D6A4F' : f.you >= f.need * 0.7 ? '#8A6A30' : '#8A3A3A';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ minWidth: '150px', fontSize: '13px', fontWeight: 500, color: '#1E2A14' }}>{f.name}</div>
                  <div style={{ flex: 1, height: '6px', background: '#C8D4B0', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${f.you}%`, background: fc, borderRadius: '100px' }} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: fc, minWidth: '36px', textAlign: 'right' }}>{f.you}%</div>
                  <div style={{ fontSize: '11px', color: '#3D5230', minWidth: '60px' }}>need {f.need}%</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Gaps */}
        <div style={cardStyle}>
          <div style={sectionLabel}>⚠️ Critical Gaps to Close</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {result.gaps?.map((g, i) => {
              const bgMap    = { critical: '#F5E8E8', important: '#F5EDD8', nice: '#E8F4EC' };
              const colorMap = { critical: '#8A3A3A', important: '#8A6A30', nice: '#2D6A4F' };
              const c = colorMap[g.level] || '#1E2A14';
              return (
                <div key={i} style={{
                  background: bgMap[g.level] || '#F0F7F0',
                  border: `1px solid ${c}40`,
                  borderRadius: '10px', padding: '14px'
                }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: `${c}20`, color: c,
                    borderRadius: '100px', padding: '3px 10px',
                    fontSize: '11px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase'
                  }}>
                    {g.level === 'critical' ? '🔥 Critical' : g.level === 'important' ? '⚡ Important' : '✓ Nice to have'}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: c, marginBottom: '5px' }}>{g.title}</div>
                  <div style={{ fontSize: '12px', color: '#3D5230', lineHeight: 1.5, marginBottom: '8px' }}>{g.desc}</div>
                  {g.link && (
                    <a href={g.link} target="_blank" rel="noreferrer"
                      style={{ fontSize: '11px', fontWeight: 700, color: '#1E2A14', textDecoration: 'none' }}>
                      {g.linkText} →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step by step plan */}
        <div style={cardStyle}>
          <div style={sectionLabel}>🗺️ Step-by-Step Improvement Plan</div>
          {result.steps?.map((s, i) => (
            <div key={i} style={{
              display: 'flex', gap: '16px', padding: '16px 0',
              borderBottom: i < result.steps.length - 1 ? '1px solid #C8D4B0' : 'none'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#1E2A14', color: '#A8C898',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 800, flexShrink: 0, marginTop: '2px'
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E2A14', marginBottom: '4px' }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: '#3D5230', lineHeight: 1.6, marginBottom: '8px' }}>{s.desc}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ background: '#C8D4B0', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', color: '#1E2A14', fontWeight: 500 }}>
                    ⏱ {s.time}
                  </span>
                  <span style={{ background: '#C8D4B0', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', color: '#1E2A14', fontWeight: 500 }}>
                    ⚡ {s.effort}
                  </span>
                  {s.link && (
                    <a href={s.link} target="_blank" rel="noreferrer"
                      style={{ fontSize: '12px', fontWeight: 700, color: '#1E2A14', textDecoration: 'none' }}>
                      {s.linkText} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/dashboard')} style={{
          width: '100%', background: '#1E2A14', color: '#A8C898',
          border: 'none', borderRadius: '10px', padding: '14px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif', marginBottom: '2rem'
        }}>
          ← Back to Dashboard
        </button>

      </div>
    </div>
  );
}

const cardStyle = {
  background: '#F0F7F0', border: '1px solid #C8D4B0',
  borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
};
const sectionLabel = {
  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: '#3D5230', marginBottom: '16px'
};
const btnSecondary = {
  background: 'transparent', color: '#1E2A14', border: '1px solid #1E2A14',
  borderRadius: '8px', padding: '7px 14px', fontSize: '12px',
  fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
};