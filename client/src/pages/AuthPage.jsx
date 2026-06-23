import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [form, setForm]       = useState({ name: '', email: '', password: '' });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit() {
    setError('');
    if (!form.email || !form.password) return setError('Fill all fields');
    if (!isLogin && !form.name) return setError('Enter your name');
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(form.email)) return setError('Please enter a valid email address');
  if (!isLogin && form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = isLogin
        ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password });
      loginUser(res.data.token, res.data.user);
      navigate('/input');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', background: colors.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', fontFamily: 'Outfit, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: '420px' }}></div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: colors.primary, marginBottom: '6px' }}>
            PlaceMint
          </div>
          <div style={{ fontSize: '13px', color: colors.textSub }}>
            {isLogin ? 'Welcome back!' : 'Create your free account'}
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: colors.bgCard, border: `1px solid ${colors.border}`,
          borderRadius: '16px', padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
        }}>

          {/* Toggle */}
          <div style={{
            display: 'flex', background: colors.bgSecond,
            borderRadius: '10px', padding: '4px', marginBottom: '1.5rem'
          }}>
            {['Login', 'Sign Up'].map((t, i) => (
              <button key={i} onClick={() => { setIsLogin(i === 0); setError(''); }}
                style={{
                  flex: 1, padding: '9px', border: 'none', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  background: isLogin === (i === 0) ? colors.primary : 'transparent',
                  color: isLogin === (i === 0) ? '#fff' : colors.textSub,
                  transition: 'all 0.15s'
                }}>
                {t}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!isLogin && (
              <div>
                <div style={labelStyle}>Full name</div>
                <input
                  name="name" value={form.name} onChange={handle}
                  placeholder="John Doe" style={inputStyle}
                />
              </div>
            )}
            <div>
              <div style={labelStyle}>Email</div>
              <input
                name="email" type="email" value={form.email} onChange={handle}
                placeholder="john@example.com" style={inputStyle}
              />
            </div>
            <div>
              <div style={labelStyle}>Password</div>
              <input
                name="password" type="password" value={form.password} onChange={handle}
                placeholder="••••••••" style={inputStyle}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: colors.dangerBg, border: `1px solid #E8C0C0`,
              borderRadius: '8px', padding: '10px 14px',
              fontSize: '13px', color: colors.danger, marginTop: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              width: '100%', marginTop: '1.25rem',
              background: loading ? colors.primaryLight : colors.primary,
              color: '#fff', border: 'none', borderRadius: '10px',
              padding: '13px', fontSize: '14px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s'
            }}>
            {loading ? 'Please wait...' : isLogin ? 'Login →' : 'Create Account →'}
          </button>

          {/* Switch */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: colors.textSub }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ color: colors.primary, cursor: 'pointer', fontWeight: 600 }}>
              {isLogin ? 'Sign up' : 'Login'}
            </span>
          </div>
        </div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <span onClick={() => navigate('/')}
            style={{ fontSize: '13px', color: colors.textSub, cursor: 'pointer' }}>
            ← Back to home
          </span>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: '12px', fontWeight: 600,
  color: '#6B6B5E', marginBottom: '6px'
};

const inputStyle = {
  width: '100%', background: '#F7F6F1',
  border: '1px solid #E2E0D5', borderRadius: '8px',
  padding: '11px 13px', fontSize: '13px',
  color: '#2C2C2C', fontFamily: 'Outfit, sans-serif',
  outline: 'none', boxSizing: 'border-box'
};