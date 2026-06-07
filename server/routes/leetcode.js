const router = require('express').Router();
const axios  = require('axios');

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
          }
          userCalendar {
            streak
          }
        }
      }
    `;

    const { data } = await axios.post(
      'https://leetcode.com/graphql',
      { query, variables: { username } },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'Origin': 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      }
    );

    const u = data?.data?.matchedUser;
    if (!u) return res.status(404).json({ error: 'User not found' });
    
    const s = u.submitStats.acSubmissionNum;
    res.json({
      total:   s.find(x => x.difficulty === 'All')?.count    || 0,
      easy:    s.find(x => x.difficulty === 'Easy')?.count   || 0,
      medium:  s.find(x => x.difficulty === 'Medium')?.count || 0,
      hard:    s.find(x => x.difficulty === 'Hard')?.count   || 0,
      ranking: u.profile.ranking,
      streak:  u.userCalendar?.streak || 0,
    });
  } catch (err) {
    console.error('LEETCODE ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;