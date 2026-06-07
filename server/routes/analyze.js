const router = require('express').Router();
const axios  = require('axios');
const auth   = require('../middleware/authMiddleware');
const User   = require('../models/User');

router.post('/', auth, async (req, res) => {
  try {
    const { leetcode, github, codechef, cgpa, skills, role, companies, resumeText } = req.body;

    console.log('ANALYZE REQUEST:', { role, companies, skills, cgpa });

    // resume text limit cheyyi
    const shortResume = resumeText ? resumeText.slice(0, 500) : 'not provided';

    const prompt = `You are a tech recruiter. Analyze this student for ${role} role.
Return ONLY raw JSON, no markdown.

Data:
- LeetCode solved: ${leetcode?.total || 0} (easy:${leetcode?.easy||0}, medium:${leetcode?.medium||0}, hard:${leetcode?.hard||0})
- GitHub repos: ${github?.public_repos || 0}, stars: ${github?.stars || 0}, languages: ${github?.top_languages?.join(',')||'none'}
- CodeChef rating: ${codechef?.rating || 'N/A'}, stars: ${codechef?.stars || 'N/A'}
- CGPA: ${cgpa}/10
- Skills: ${skills?.join(', ') || 'none'}
- Target companies: ${companies?.join(', ')}
- Role: ${role}

Return this exact JSON:
{"overallScore":65,"techStrength":70,"companies":[{"name":"TCS","eligibility":80,"missingSkills":["System Design"],"strengths":["Python"],"verdict":"Strong profile but needs DSA"}],"gaps":["System Design","DSA"],"roadmap":[{"priority":"high","title":"Solve 150 LeetCode problems","description":"Focus on Arrays, Trees, DP","timeEstimate":"6 weeks","resourceUrl":"https://leetcode.com/studyplan/top-interview-150/","resourceLabel":"LeetCode Top 150"}]}`;

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
    console.log('Raw response:', raw.slice(0, 300));
    raw = raw.replace(/```json|```/g, '').trim();
// JSON start and end find cheyyi
const jsonStart = raw.indexOf('{');
const jsonEnd = raw.lastIndexOf('}');
const jsonStr = raw.slice(jsonStart, jsonEnd + 1);
const result = JSON.parse(jsonStr);
console.log('overallScore:', result.overallScore);
console.log('techStrength:', result.techStrength);

    await User.findByIdAndUpdate(req.user.id, { lastAnalysis: result });
    res.json(result);

  } catch (err) {
    console.error('ANALYZE ERROR:', err.message);
    console.error('FULL ERROR:', err.response?.data || err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;