import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are PlaceMint's AI assistant. You help students with:
1. Career guidance — DSA tips, interview prep, skill development advice
2. Website help — how to use PlaceMint, what features are available

PlaceMint is an AI-powered career eligibility analyzer that:
- Connects LeetCode, GitHub, CodeChef profiles
- Shows company eligibility % for companies like Google, Microsoft, Flipkart, TCS etc
- Gives personalized roadmaps and skill gap analysis
- Has a "How to improve" feature for each company

Be friendly, concise, and helpful. Use emojis occasionally. Keep responses short and actionable.`;

export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m PlaceMint\'s AI assistant. Ask me anything about your career or how to use this website!' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef         = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://placemint-backend-02uy.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again!' }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating bubble */}
      <button
  title="🤖Need help? Ask me!"
  onClick={() => setOpen(!open)}
  style={{
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#1E2A14',
    color: '#A8C898',
    border: 'none',
    cursor: 'pointer',
    zIndex: 999,
    fontSize: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  {open ? '✕' : '💬'}
</button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px',
          width: '340px', height: '460px',
          background: '#F0F7F0', borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column',
          zIndex: 998, overflow: 'hidden',
          border: '1px solid #C8D4B0',
          animation: 'fadeInUp 0.3s ease',
          fontFamily: 'Outfit, sans-serif'
        }}>

          {/* Header */}
          <div style={{
            background: '#1E2A14', padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#A8C898', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px'
            }}>🌿</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0F7F0' }}>PlaceMint Assistant</div>
              <div style={{ fontSize: '11px', color: '#A8C898' }}>Career & website help</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '9px 12px',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? '#1E2A14' : '#fff',
                  color: m.role === 'user' ? '#F0F7F0' : '#1E2A14',
                  fontSize: '13px', lineHeight: 1.5,
                  border: m.role === 'assistant' ? '1px solid #C8D4B0' : 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '9px 14px', borderRadius: '12px 12px 12px 2px',
                  background: '#fff', border: '1px solid #C8D4B0',
                  fontSize: '13px', color: '#7A9870'
                }}>
                  <span className="pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['How to use PlaceMint?', 'How to improve for Google?', 'Best DSA resources?'].map(q => (
                <button key={q} onClick={() => { setInput(q); }}
                  style={{
                    background: '#E8F2E8', border: '1px solid #C8D4B0',
                    borderRadius: '100px', padding: '4px 10px',
                    fontSize: '11px', color: '#2C3B1E', cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 12px', borderTop: '1px solid #C8D4B0',
            display: 'flex', gap: '8px', background: '#fff'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything..."
              style={{
                flex: 1, border: '1px solid #C8D4B0', borderRadius: '8px',
                padding: '8px 12px', fontSize: '13px', outline: 'none',
                fontFamily: 'Outfit, sans-serif', background: '#F0F7F0',
                color: '#1E2A14'
              }}
            />
            <button onClick={sendMessage} disabled={loading}
              style={{
                background: '#1E2A14', color: '#A8C898', border: 'none',
                borderRadius: '8px', padding: '8px 12px', cursor: 'pointer',
                fontSize: '14px', fontFamily: 'Outfit, sans-serif'
              }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}