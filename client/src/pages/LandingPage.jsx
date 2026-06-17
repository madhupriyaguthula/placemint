import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#8FAF8F', color: '#1E2A14', fontFamily: 'Outfit, sans-serif', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2.5rem', borderBottom: '1px solid #6A8F6A',
        background: '#7A9E7A', position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.5s ease'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#1E2A14' }}>PlaceMint</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {user ? (
            <button onClick={() => navigate('/input')} style={btnPrimary}>Go to Dashboard →</button>
          ) : (
            <>
              <button onClick={() => navigate('/auth')} style={btnSecondary}>Login</button>
              <button onClick={() => navigate('/auth')} style={btnPrimary}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '6rem 2rem 4rem', animation: 'fadeInUp 0.7s ease' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#1E2A14', borderRadius: '100px', padding: '5px 16px',
          fontSize: '12px', color: '#A8C898', fontWeight: 600, marginBottom: '1.5rem',
          animation: 'fadeInUp 0.5s ease'
        }}>
          ✦ AI-Powered Career Analyzer
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 800,
          letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '1.25rem',
          color: '#1E2A14', animation: 'fadeInUp 0.6s ease'
        }}>
          Know exactly where you<br />
          <span style={{ color: '#F0F7F0' }}>stand right now</span>
        </h1>

        <p style={{
          fontSize: '16px', color: '#2C3B1E', maxWidth: '480px',
          margin: '0 auto 2.5rem', lineHeight: 1.7,
          animation: 'fadeInUp 0.7s ease'
        }}>
          Connect LeetCode, GitHub, CodeChef — get real eligibility % for your
          dream companies with a personalized roadmap to close the gap.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeInUp 0.8s ease' }}>
          <button onClick={() => navigate('/auth')} style={{ ...btnPrimary, padding: '14px 36px', fontSize: '15px' }}>
            Analyze my profile →
          </button>
          <button onClick={() => navigate('/auth')} style={{ ...btnSecondary, padding: '14px 36px', fontSize: '15px' }}>
            See how it works
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="scroll-reveal" style={{
        display: 'flex', justifyContent: 'center', gap: '4rem',
        flexWrap: 'wrap', padding: '2.5rem',
        background: '#7A9E7A', borderTop: '1px solid #6A8F6A', borderBottom: '1px solid #6A8F6A'
      }}>
        {[
          { num: '50+', label: 'Companies analyzed' },
          { num: '10+', label: 'Platforms connected' },
          { num: '100%', label: 'Free to use' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1E2A14' }}>{s.num}</div>
            <div style={{ fontSize: '13px', color: '#2C3B1E' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h2 className="scroll-reveal" style={{ textAlign: 'center', fontSize: '26px', fontWeight: 800, marginBottom: '2.5rem', color: '#1E2A14' }}>
          Everything you need to get placed
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { icon: '⚡', title: 'Real-time data', desc: 'Fetches your actual LeetCode, GitHub, CodeChef stats live — no manual entry.' },
            { icon: '🎯', title: 'Company eligibility', desc: 'See exact % score for Google, Flipkart, TCS and 50+ companies.' },
            { icon: '🗺️', title: 'Personalized roadmap', desc: 'AI tells you exactly what to learn and build — with resource links.' },
            { icon: '📄', title: 'Resume analysis', desc: 'Upload resume — AI extracts skills and weighs them against requirements.' },
          ].map((f, i) => (
            <div key={i} className="scroll-reveal hover-card" style={{
              background: '#7A9E7A', border: '1px solid #6A8F6A',
              borderRadius: '14px', padding: '1.5rem',
              transitionDelay: `${i * 0.1}s`
            }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E2A14' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#2C3B1E', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="scroll-reveal" style={{
        background: '#6A8F6A', padding: '4rem 2rem',
        borderTop: '1px solid #5A7A4A', borderBottom: '1px solid #5A7A4A'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '2.5rem', color: '#F0F7F0' }}>How it works</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }} className="stagger">
            {[
              { step: '1', title: 'Connect platforms', desc: 'Enter your LeetCode, GitHub, CodeChef usernames' },
              { step: '2', title: 'Set your goal', desc: 'Choose your dream role and target companies' },
              { step: '3', title: 'Get analysis', desc: 'AI analyzes and gives eligibility % + roadmap' },
            ].map((s, i) => (
              <div key={i} style={{ flex: '1', minWidth: '160px', textAlign: 'center' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#1E2A14', color: '#A8C898',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 800, margin: '0 auto 12px'
                }}>{s.step}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '5px', color: '#F0F7F0' }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: '#C8D4B0', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="scroll-reveal" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '0.75rem', color: '#1E2A14' }}>
          Ready to know your eligibility?
        </h2>
        <p style={{ fontSize: '14px', color: '#2C3B1E', marginBottom: '1.5rem' }}>
          Free to use — no credit card required
        </p>
        <button onClick={() => navigate('/auth')} style={{ ...btnPrimary, padding: '14px 36px', fontSize: '15px' }}>
          Get started for free →
        </button>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', padding: '1.5rem',
        borderTop: '1px solid #6A8F6A',
        fontSize: '13px', color: '#2C3B1E',
        background: '#7A9E7A'
      }}>
        PlaceMint © 2024 — Built for students, by students
      </div>
    </div>
  );
}

const btnPrimary = {
  background: '#1E2A14', color: '#F0F7F0', border: 'none',
  borderRadius: '10px', padding: '10px 22px', fontSize: '13px',
  fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
};

const btnSecondary = {
  background: 'transparent', color: '#1E2A14',
  border: '1px solid #1E2A14', borderRadius: '10px',
  padding: '10px 22px', fontSize: '13px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
};