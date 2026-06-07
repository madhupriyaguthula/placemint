const router = require('express').Router();
const axios  = require('axios');
const auth   = require('../middleware/authMiddleware');

router.post('/', auth, async (req, res) => {
  try {
    const { company, role, skills, gaps, leetcode, github } = req.body;

    const prompt = `You are an expert tech recruiter for ${company.name}.
A student wants to become a ${role} at ${company.name}. Currently ${company.eligibility}% eligible.
Their skills: ${skills?.join(', ') || 'none'}
Their gaps: ${gaps?.join(', ') || 'none'}
LeetCode solved: ${leetcode?.total || 0} (easy:${leetcode?.easy||0}, medium:${leetcode?.medium||0}, hard:${leetcode?.hard||0})
GitHub repos: ${github?.public_repos || 0}

Return ONLY valid JSON, no markdown:
{
  "factors": [
    {"name": "DSA / LeetCode", "you": 45, "need": 80},
    {"name": "System Design", "you": 20, "need": 75},
    {"name": "Projects", "you": 55, "need": 80},
    {"name": "Core CS", "you": 60, "need": 70},
    {"name": "Communication", "you": 65, "need": 70}
  ],
  "gaps": [
    {"level": "critical", "title": "DSA — not enough solved", "desc": "Need 200+ problems with focus on Trees, DP, Graphs", "link": "https://leetcode.com/studyplan/top-interview-150/", "linkText": "LeetCode Top 150"},
    {"level": "important", "title": "System Design missing", "desc": "Must know HLD/LLD basics for ${company.name} interviews", "link": "https://github.com/donnemartin/system-design-primer", "linkText": "System Design Primer"},
    {"level": "nice", "title": "Open source contribution", "desc": "Even 1-2 PRs improve your profile significantly", "link": "https://goodfirstissue.dev", "linkText": "Good First Issues"}
  ],
  "steps": [
    {"title": "Solve 150+ LeetCode problems", "desc": "Focus on Arrays, Trees, DP, Graphs — exactly what ${company.name} asks", "time": "6 weeks", "effort": "2-3 problems/day", "link": "https://leetcode.com/company/${company.name.toLowerCase()}/", "linkText": "${company.name} tagged problems"},
    {"title": "Learn System Design", "desc": "Study HLD patterns — load balancer, caching, sharding", "time": "3 weeks", "effort": "1 design/week", "link": "https://github.com/donnemartin/system-design-primer", "linkText": "System Design Primer"},
    {"title": "Build 2 production projects", "desc": "Full stack apps with auth, API, DB, deployed live", "time": "3 weeks", "effort": "1 project/1.5 weeks", "link": "https://roadmap.sh/full-stack", "linkText": "Project ideas"},
    {"title": "Mock interviews", "desc": "Practice with peers or platforms before applying", "time": "ongoing", "effort": "2/week", "link": "https://www.pramp.com", "linkText": "Pramp — free mock interviews"}
  ]
}`;

    const { data } = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    let raw = data.choices?.[0]?.message?.content || '';
    raw = raw.replace(/```json|```/g, '').trim();
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    const result = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    res.json(result);

  } catch (err) {
    console.error('COMPANY DETAIL ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;