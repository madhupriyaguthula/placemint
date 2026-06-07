import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#8FAF8F', color: '#1E2A14', fontFamily: 'Outfit, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2.5rem', borderBottom: `1px solid ${colors.border}`,
        background:'#7A9E7A', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#1E2A14' }}>
  PlaceMint
</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {user ? (
            <button onClick={() => navigate('/input')} style={btnPrimary}>
              Go to Dashboard →
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/auth')} style={btnSecondary}>Login</button>
              <button onClick={() => navigate('/auth')} style={btnPrimary}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem 3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: colors.primaryBg, border: `1px solid ${colors.primaryLight}`,
          borderRadius: '100px', padding: '5px 16px',
          fontSize: '12px', color: colors.primary, fontWeight: 600, marginBottom: '1.5rem'
        }}>
          ✦ AI-Powered Career Analyzer
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
          letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '1.25rem',
          color: colors.text
        }}>
          Know exactly where you<br />
          <span style={{ color: colors.primary }}>stand right now</span>
        </h1>

        <p style={{
          fontSize: '16px', color: colors.textSub, maxWidth: '480px',
          margin: '0 auto 2.5rem', lineHeight: 1.7
        }}>
          Connect LeetCode, GitHub, CodeChef — get real eligibility % for your
          dream companies with a personalized roadmap to close the gap.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/auth')} style={{ ...btnPrimary, padding: '13px 32px', fontSize: '15px' }}>
            Analyze my profile →
          </button>
          <button onClick={() => navigate('/auth')} style={{ ...btnSecondary, padding: '13px 32px', fontSize: '15px' }}>
            See how it works
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '3rem',
        flexWrap: 'wrap', padding: '2.5rem',
        background: colors.bgCard, borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`
      }}>
        {[
          { num: '50+', label: 'Companies analyzed' },
          { num: '10+', label: 'Platforms connected' },
          { num: '100%', label: 'Free to use' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: colors.primary }}>{s.num}</div>
            <div style={{ fontSize: '13px', color: colors.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, marginBottom: '2rem', color: colors.text }}>
          Everything you need to get placed
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { icon: '⚡', title: 'Real-time data', desc: 'Fetches your actual LeetCode, GitHub, CodeChef stats live — no manual entry.' },
            { icon: '🎯', title: 'Company eligibility', desc: 'See exact % score for Google, Flipkart, TCS and 50+ companies based on your profile.' },
            { icon: '🗺️', title: 'Personalized roadmap', desc: 'AI tells you exactly what to learn, build and improve — with direct resource links.' },
            { icon: '📄', title: 'Resume analysis', desc: 'Upload your resume — AI extracts skills and weighs them against company requirements.' },
          ].map((f, i) => (
            <div key={i} style={{
              background: colors.bgCard, border: `1px solid ${colors.border}`,
              borderRadius: '14px', padding: '1.5rem'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: colors.text }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: colors.textSub, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: colors.primaryBg, padding: '4rem 2rem', borderTop: `1px solid ${colors.primaryLight}`, borderBottom: `1px solid ${colors.primaryLight}` }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '2.5rem', color: colors.text }}>How it works</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { step: '1', title: 'Connect platforms', desc: 'Enter your LeetCode, GitHub, CodeChef usernames' },
              { step: '2', title: 'Set your goal', desc: 'Choose your dream role and target companies' },
              { step: '3', title: 'Get analysis', desc: 'AI analyzes and gives you eligibility % + roadmap' },
            ].map((s, i) => (
              <div key={i} style={{ flex: '1', minWidth: '160px', textAlign: 'center' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: colors.primary, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 800, margin: '0 auto 12px'
                }}>{s.step}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '5px', color: colors.text }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: colors.textSub, lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '1rem', color: colors.text }}>
          Ready to know your eligibility?
        </h2>
        <button onClick={() => navigate('/auth')} style={{ ...btnPrimary, padding: '13px 32px', fontSize: '15px' }}>
          Get started for free →
        </button>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', padding: '1.5rem',
        borderTop: `1px solid ${colors.border}`,
        fontSize: '13px', color: colors.textMuted,
        background: colors.bgCard
      }}>
        PlaceMint © 2024 — Built for students, by students
      </div>
    </div>
  );
}

const btnPrimary = {
  background: '#1E2A14', color: '#fff', border: 'none',
  borderRadius: '8px', padding: '9px 20px', fontSize: '13px',
  fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
};

const btnSecondary = {
  background: 'transparent', color: '#1E2A14',
  border: '1px solid #7A8C5E', borderRadius: '8px',
  padding: '9px 20px', fontSize: '13px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
};