import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [data, setData] = useState(null);
  const [activeCompany, setActiveCompany] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('dashboardData');
    if (!stored) { navigate('/input'); return; }
    const parsed = JSON.parse(stored);
    setData(parsed);
    if (parsed.result?.companies?.length > 0) {
      setActiveCompany(parsed.result.companies[0]);
    }
  }, []);

  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#EEF5EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#C8D4B0', fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>Loading your report...</div>
    </div>
  );

  const { result, connected, form } = data;

  return (
    <div style={{ minHeight: '100vh', background: '#86a186', color: '#1E2A14', fontFamily: 'Outfit, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', borderBottom: '1px solid #40473b',
        background: '#1E2A14', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#A8C898' }}>PlaceMint</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#e5e8df' }}>Hi, {user?.name} 👋</span>
          <button onClick={() => navigate('/input')} style={btnSecondary}>← Re-analyze</button>
          <button onClick={logoutUser} style={btnSecondary}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#563822', border: '1px solid #628650',
            borderRadius: '100px', padding: '5px 14px',
            fontSize: '12px', color: '#A8C898', fontWeight: 600, marginBottom: '12px'
          }}>
            ✦ {form?.role}
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px', color: '#1E2A14' }}>
            Your Eligibility Report
          </h1>
          <p style={{ fontSize: '14px', color: '#263015' }}>
            AI analysis based on your connected platforms and skills
          </p>
        </div>

        {/* Score Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Overall Score', value: result.overallScore, suffix: '/100', color: '#A8C898', bg: '#3D5230', border: '#5A7A4A' },
            { label: 'Tech Strength', value: result.techStrength, suffix: '/100', color: '#7EC8A0', bg: '#1E3D2A', border: '#3A7A54' },
            { label: 'Platforms',     value: Object.keys(connected).length, suffix: ' connected', color: '#D4B896', bg: '#3D3020', border: '#7A6040' },
            { label: 'Skill Gaps',    value: result.gaps?.length || 0, suffix: ' found', color: '#D49898', bg: '#3D2020', border: '#7A4040' },
          ].map((s, i) => (
            <div key={i} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: '14px', padding: '16px',
              boxShadow: '0 2px 8px rgba(180, 165, 165, 0.2)'
            }}>
              <div style={{ fontSize: '11px', color: '#A0B090', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>
                {s.value}<span style={{ fontSize: '13px', fontWeight: 400, color: '#7A9070' }}>{s.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Company Eligibility */}
        <div style={cardStyle}>
          <div style={sectionLabel}>🏢 Company Eligibility</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {result.companies?.map((c, i) => {
              const pct = Math.round(c.eligibility);
              const color = pct >= 80 ? '#7EC8A0' : pct >= 60 ? '#D4B896' : '#D49898';
              const isActive = activeCompany?.name === c.name;
              return (
                <div key={i}>
                  <div
                    onClick={() => setActiveCompany(isActive ? null : c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px', borderRadius: '10px', cursor: 'pointer',
                      background: isActive ? '#3D5230' : 'transparent',
                      border: `1px solid ${isActive ? '#5A7A4A' : 'transparent'}`,
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ minWidth: '110px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#dee4da' }}>{c.name}</div>
                    </div>
                    <div style={{ flex: 1, height: '8px', background: '#1E2A14', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '100px', transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color, minWidth: '45px', textAlign: 'right' }}>{pct}%</div>
                    <div style={{ fontSize: '12px', color: '#7A9070' }}>{isActive ? '▲' : '▼'}</div>
                  </div>

                  {isActive && (
                    <div style={{
                      margin: '4px 12px 8px', padding: '14px',
                      background: '#1E2A14', borderRadius: '10px',
                      border: '1px solid #3D5230'
                    }}>
                     
                      <div style={{ fontSize: '13px', color: '#C8D4B0', marginBottom: '12px', lineHeight: 1.5 }}>{c.verdict}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#7EC8A0', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>✓ Strengths</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {c.strengths?.map(s => (
                              <span key={s} style={{ background: '#1E3D2A', color: '#7EC8A0', border: '1px solid #3A7A54', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', fontWeight: 500 }}>{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#D49898', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>✗ Missing Skills</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {c.missingSkills?.map(s => (
                              <span key={s} style={{ background: '#3D2020', color: '#D49898', border: '1px solid #7A4040', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', fontWeight: 500 }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
  onClick={() => {
    sessionStorage.setItem('selectedCompany', JSON.stringify({
      company: c,
      role: form?.role,
      skills: form?.skills,
      gaps: result.gaps,
    }));
    navigate('/company');
  }}
  style={{
    marginTop: '12px', background: '#a1ba8c', color: '#152a14',
    border: 'none', borderRadius: '8px', padding: '8px 16px',
    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif'
  }}
>
  How to improve for {c.name} →
</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Snapshot */}
        <div style={cardStyle}>
          <div style={sectionLabel}>⚡ Platform Snapshot</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {connected.leetcode && (
              <>
                <div style={statCard}>
                  <div style={statLabel}>LeetCode Solved</div>
                  <div style={statVal}>{connected.leetcode.total}</div>
                  <div style={statSub}>Easy {connected.leetcode.easy} · Med {connected.leetcode.medium} · Hard {connected.leetcode.hard}</div>
                </div>
                <div style={statCard}>
                  <div style={statLabel}>Streak</div>
                  <div style={statVal}>{connected.leetcode.streak || 0}</div>
                  <div style={statSub}>days</div>
                </div>
              </>
            )}
            {connected.github && (
              <>
                <div style={statCard}>
                  <div style={statLabel}>GitHub Repos</div>
                  <div style={statVal}>{connected.github.public_repos}</div>
                  <div style={statSub}>⭐ {connected.github.stars} stars</div>
                </div>
                <div style={statCard}>
                  <div style={statLabel}>Top Languages</div>
                  <div style={{ fontSize: '12px', color: '#A8C898', marginTop: '6px', fontWeight: 600 }}>
                    {connected.github.top_languages?.slice(0, 3).join(', ') || 'N/A'}
                  </div>
                </div>
              </>
            )}
            {connected.codechef && (
              <div style={statCard}>
                <div style={statLabel}>CodeChef</div>
                <div style={statVal}>{connected.codechef.rating}</div>
                <div style={statSub}>{connected.codechef.stars}</div>
              </div>
            )}
            <div style={statCard}>
              <div style={statLabel}>CGPA</div>
              <div style={statVal}>{form?.cgpa}</div>
              <div style={statSub}>/ 10</div>
            </div>
          </div>
        </div>

        {/* Skills + Gaps */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
          <div style={cardStyle}>
            <div style={sectionLabel}>✅ Your Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {form?.skills?.map(s => (
                <span key={s} style={{ background: '#1E3D2A', color: '#7EC8A0', border: '1px solid #3A7A54', borderRadius: '100px', padding: '5px 12px', fontSize: '12px', fontWeight: 500 }}>{s}</span>
              ))}
              {(!form?.skills || form.skills.length === 0) && (
                <span style={{ fontSize: '12px', color: '#7A9070' }}>No skills added</span>
              )}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={sectionLabel}>⚠️ Skill Gaps</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {result.gaps?.map(g => (
                <span key={g} style={{ background: '#3D2020', color: '#D49898', border: '1px solid #7A4040', borderRadius: '100px', padding: '5px 12px', fontSize: '12px', fontWeight: 500 }}>+ {g}</span>
              ))}
              {(!result.gaps || result.gaps.length === 0) && (
                <span style={{ fontSize: '12px', color: '#7A9070' }}>No gaps found!</span>
              )}
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div style={cardStyle}>
          <div style={sectionLabel}>🗺️ Your Personalized Roadmap</div>
          {result.roadmap?.map((r, i) => {
            const colorMap = { high: '#D49898', med: '#D4B896', low: '#7EC8A0' };
            const bgMap    = { high: '#3D2020', med: '#3D3020', low: '#1E3D2A' };
            const labelMap = { high: 'High Priority', med: 'Medium', low: 'Nice to have' };
            const color    = colorMap[r.priority] || '#A8C898';
            return (
              <div key={i} style={{
                display: 'flex', gap: '16px', padding: '16px 0',
                borderBottom: i < result.roadmap.length - 1 ? '1px solid #3D5230' : 'none'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: bgMap[r.priority] || '#3D5230',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 800, color, flexShrink: 0, marginTop: '2px',
                  border: `1px solid ${color}40`
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#959d8f' }}>{r.title}</div>
                    <span style={{ background: bgMap[r.priority] || '#3D5230', color, borderRadius: '100px', padding: '2px 9px', fontSize: '10px', fontWeight: 700, border: `1px solid ${color}40` }}>
                      {labelMap[r.priority] || r.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#C8D4B0', marginBottom: '8px', lineHeight: 1.6 }}>{r.description}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ background: '#253518', border: '1px solid #3D5230', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', color: '#7A9070' }}>
                      ⏱ {r.timeEstimate}
                    </span>
                    {r.resourceUrl && (
                      <a href={r.resourceUrl} target="_blank" rel="noreferrer"
                        style={{ fontSize: '12px', fontWeight: 600, color: '#A8C898', textDecoration: 'none' }}>
                        {r.resourceLabel} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => navigate('/input')} style={{
          width: '100%', background: '#1E2A14', color: '#C8D4B0',
          border: '1px solid #3D5230', borderRadius: '10px',
          padding: '14px', fontSize: '14px', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginBottom: '2rem'
        }}>
          ← Analyze again with different data
        </button>

      </div>
    </div>
  );
}

const cardStyle = {
  background: '#131611', border: '1px solid #6f766a',
  borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem',
  boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
};
const sectionLabel = {
  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: '#fcfefa', marginBottom: '16px'
};
const btnSecondary = {
  background: 'transparent', color: '#b9ccaf', border: '1px solid #798772',
  borderRadius: '8px', padding: '7px 14px', fontSize: '12px',
  fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
};
const statCard = {
  background: '#1E2A14', border: '1px solid #3D5230',
  borderRadius: '10px', padding: '12px'
};
const statLabel = {
  fontSize: '11px', color: '#9ca298', marginBottom: '4px',
  textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600
};
const statVal = { fontSize: '20px', fontWeight: 700, color: '#F0F7F0', marginBottom: '2px' };
const statSub = { fontSize: '11px', color: '#7A9070' };