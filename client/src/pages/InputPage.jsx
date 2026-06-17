import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLeetCode, getGitHub, getCodeChef, analyzeProfile } from '../services/api';
import { colors } from '../theme';

export default function InputPage() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const [form, setForm] = useState({
    leetcode: '', github: '', codechef: '',
    cgpa: 7.5, branch: 'Computer Science', gradYear: '2026',
    skills: [], role: 'Full Stack Developer', companies: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading]       = useState(false);
  const [status, setStatus]         = useState('');
  const [connected, setConnected]   = useState({});
  const [error, setError]           = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeName, setResumeName] = useState('');

  const roles = [
    'Full Stack Developer', 'Frontend Developer',
    'Backend Developer', 'Data Analyst',
    'AI / ML Engineer', 'DevOps Engineer'
  ];
  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Flipkart',
    'Swiggy', 'Zomato', 'Razorpay', 'PhonePe',
    'Infosys', 'TCS', 'Wipro', 'Accenture', 'Capgemini', 'HCL'
  ];

  async function connectPlatform(platform) {
    const username = form[platform];
    if (!username) return setError(`Enter ${platform} username first`);
    setError('');
    setStatus(`Fetching ${platform} data...`);
    try {
      let data;
      if (platform === 'leetcode') data = await getLeetCode(username);
      if (platform === 'github')   data = await getGitHub(username);
      if (platform === 'codechef') data = await getCodeChef(username);
      setConnected(prev => ({ ...prev, [platform]: data }));
      setStatus('');
    } catch (err) {
      setError(`${platform} fetch failed — check username`);
      setStatus('');
    }
  }

  function addSkill() {
    if (!skillInput.trim()) return;
    if (form.skills.includes(skillInput.trim())) return;
    setForm(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  }

  function removeSkill(s) {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }));
  }

  function toggleCompany(c) {
    setForm(prev => ({
      ...prev,
      companies: prev.companies.includes(c)
        ? prev.companies.filter(x => x !== c)
        : [...prev.companies, c]
    }));
  }

  async function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setResumeName(file.name);
    if (file.type === 'text/plain') {
      const text = await file.text();
      setResumeText(text.slice(0, 500));
    } else {
      const reader = new FileReader();
      reader.onload = () => setResumeText(reader.result.slice(0, 500));
      reader.readAsDataURL(file);
    }
  }

  async function handleAnalyze() {
    if (Object.keys(connected).length === 0) return setError('Connect at least 1 platform');
    if (form.companies.length === 0) return setError('Select at least 1 company');
    setError('');
    setLoading(true);
    try {
      setStatus('AI analyzing your profile...');
      const result = await analyzeProfile({
        leetcode:   connected.leetcode || {},
        github:     connected.github   || {},
        codechef:   connected.codechef || {},
        cgpa:       form.cgpa,
        skills:     form.skills,
        role:       form.role,
        companies:  form.companies,
        resumeText: resumeText,
      });

      const safeState = JSON.stringify({
        result: result.data || result,
        connected,
        form: {
          cgpa: form.cgpa,
          skills: form.skills,
          role: form.role,
          companies: form.companies,
          branch: form.branch,
          gradYear: form.gradYear,
        }
      });

      sessionStorage.setItem('dashboardData', safeState);
      navigate('/dashboard');
    } catch (err) {
      setError('Analysis failed: ' + err.message);
    }
    setLoading(false);
    setStatus('');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#8FAF8F', color: '#070807', fontFamily: 'Outfit, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', borderBottom: `1px solid ${colors.border}`,
        background: '#13131A', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: colors.primary }}>PlaceMint</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: colors.textSub }}>Hi, {user?.name} 👋</span>
          <button onClick={logoutUser} style={btnSecondary}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }} className="fade-in">

        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px', color: '#15210c' }}>Setup your profile</h1>
<p style={{ fontSize: '13px', color: '#000000', marginBottom: '2rem' }}>
  Connect your platforms and set your goal to get AI eligibility analysis
</p>

        {/* Platform Connect */}
        <div style={cardStyle}>
          <div style={sectionLabel}>⚡ Connect your platforms</div>
          {['leetcode', 'github', 'codechef'].map(p => (
            <div key={p} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
              <div style={{ width: '90px', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', color: colors.textSub }}>{p}</div>
              <input
                value={form[p]}
                onChange={e => setForm(prev => ({ ...prev, [p]: e.target.value }))}
                placeholder={`${p} username`}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button onClick={() => connectPlatform(p)} style={connected[p] ? btnSuccess : btnPrimary}>
                {connected[p] ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        {/* Academic */}
        <div style={cardStyle}>
          <div style={sectionLabel}>🎓 Academic details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div>
              <div style={labelStyle}>Branch</div>
              <select value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} style={inputStyle}>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Electronics & Communication</option>
                <option>Electrical Engineering</option>
                <option>Mechanical Engineering</option>
                <option>Data Science</option>
                <option>AI & ML</option>
              </select>
            </div>
            <div>
              <div style={labelStyle}>Graduation year</div>
              <select value={form.gradYear} onChange={e => setForm(p => ({ ...p, gradYear: e.target.value }))} style={inputStyle}>
                <option>2025</option><option>2026</option><option>2027</option><option>2028</option>
              </select>
            </div>
          </div>
          <div style={labelStyle}>CGPA — <strong style={{ color: colors.primary }}>{form.cgpa}</strong> / 10</div>
          <input type="range" min="0" max="10" step="0.1" value={form.cgpa}
            onChange={e => setForm(p => ({ ...p, cgpa: parseFloat(e.target.value) }))}
            style={{ width: '100%', accentColor: colors.primary, marginTop: '6px' }}
          />
        </div>

        {/* Skills */}
        <div style={cardStyle}>
          <div style={sectionLabel}>🛠 Your skills</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Type a skill and press Enter"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={addSkill} style={btnSecondary}>+ Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {form.skills.map(s => (
              <span key={s} style={{
                background: colors.primaryBg, color: colors.primaryDark,
                border: `1px solid ${colors.primaryLight}`,
                borderRadius: '100px', padding: '5px 12px', fontSize: '12px', fontWeight: 500
              }}>
                {s} <span onClick={() => removeSkill(s)} style={{ cursor: 'pointer', marginLeft: '4px', color: colors.textMuted }}>×</span>
              </span>
            ))}
            {form.skills.length === 0 && <span style={{ fontSize: '12px', color: colors.textMuted }}>No skills added yet</span>}
          </div>
        </div>

        {/* Resume Upload */}
        <div style={cardStyle}>
          <div style={sectionLabel}>📄 Resume (optional but recommended)</div>
          <div
            onClick={() => document.getElementById('resume-input').click()}
            style={{
              border: `2px dashed ${resumeText ? colors.success : colors.border}`,
              borderRadius: '12px', padding: '1.5rem', textAlign: 'center',
              cursor: 'pointer',
              background: resumeText ? colors.successBg : colors.bgSecond,
              transition: 'all 0.15s'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{resumeText ? '✅' : '📄'}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: resumeText ? colors.success : colors.textSub }}>
              {resumeText ? resumeName : 'Click to upload resume (PDF or TXT)'}
            </div>
            <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '4px' }}>
              {resumeText ? 'Resume ready — AI will use this for better analysis' : 'Helps AI give more accurate eligibility scores'}
            </div>
          </div>
          <input id="resume-input" type="file" accept=".pdf,.txt" style={{ display: 'none' }} onChange={handleResumeUpload} />
        </div>

        {/* Goal */}
        <div style={cardStyle}>
          <div style={sectionLabel}>🎯 Your goal</div>
          <div style={labelStyle}>Desired role</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '18px' }}>
            {roles.map(r => (
              <div key={r} onClick={() => setForm(p => ({ ...p, role: r }))}
                style={{
                  border: `1.5px solid ${form.role === r ? colors.primary : colors.border}`,
                  background: form.role === r ? colors.primaryBg : colors.bgCard,
                  borderRadius: '10px', padding: '10px 14px',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  color: form.role === r ? colors.primaryDark : colors.text,
                  transition: 'all 0.15s'
                }}>
                {r}
              </div>
            ))}
          </div>
          <div style={labelStyle}>Target companies</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {companies.map(c => (
              <span key={c} onClick={() => toggleCompany(c)}
                style={{
                  border: `1.5px solid ${form.companies.includes(c) ? colors.primary : colors.border}`,
                  background: form.companies.includes(c) ? colors.primaryBg : colors.bgCard,
                  borderRadius: '100px', padding: '6px 14px',
                  fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                  color: form.companies.includes(c) ? colors.primaryDark : colors.textSub,
                  transition: 'all 0.15s'
                }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            background: colors.dangerBg, border: `1px solid #3d542d`,
            borderRadius: '10px', padding: '12px 16px',
            fontSize: '13px', color: colors.danger, marginBottom: '1rem'
          }}>{error}</div>
        )}

        {status && (
          <div style={{
            background: colors.primaryBg, border: `1px solid ${colors.primaryLight}`,
            borderRadius: '10px', padding: '12px 16px',
            fontSize: '13px', color: colors.primary, marginBottom: '1rem'
          }}>⏳ {status}</div>
        )}

        <button onClick={handleAnalyze} disabled={loading} style={{
          width: '100%', background: loading ? colors.primaryLight : colors.primary,
          color: '#fff', border: 'none', borderRadius: '10px',
          padding: '15px', fontSize: '15px', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'Outfit, sans-serif', marginBottom: '2rem'
        }}>
          {loading ? '⏳ Analyzing your profile...' : '✦ Analyze my eligibility →'}
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#eef0ee',
  border: '1px solid #C8D4B0',
  borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
};
const sectionLabel = {
  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: '#000000', marginBottom: '14px'
};
const labelStyle = { fontSize: '12px', fontWeight: 600, color: '#581b1b', marginBottom: '6px' };
const inputStyle = {
  width: '100%', background: '#ffffff', border: '1px solid #39351e',
  borderRadius: '8px', padding: '10px 12px', fontSize: '13px',
  color: '#0e0c0c', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box'
};
const btnPrimary = {
  background: '#171414', color: '#fefffe', border: 'none',
  borderRadius: '8px', padding: '9px 16px', fontSize: '12px',
  fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap'
};
const btnSecondary = {
  background: 'transparent', color: '#253014', border: '1px solid #7A8C5E',
  borderRadius: '8px', padding: '9px 16px', fontSize: '12px',
  fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap'
};
const btnSuccess = {
  background: '#E8F2EC', color: '#23412d', border: '1px solid #9FD4B0',
  borderRadius: '8px', padding: '9px 16px', fontSize: '12px',
  fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap'
};