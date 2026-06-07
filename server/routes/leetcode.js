const router = require('express').Router();
const axios  = require('axios');

router.get('/:username', async (req, res) => {
  try {
    const query = `query($username:String!){matchedUser(username:$username){submitStats{acSubmissionNum{difficulty count}}profile{ranking}userCalendar{streak}}}`;
    const { data } = await axios.post('https://leetcode.com/graphql',
      { query, variables: { username: req.params.username } },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const u = data?.data?.matchedUser;
    if (!u) return res.status(404).json({ error: 'User not found' });
    const s = u.submitStats.acSubmissionNum;
    res.json({
      total:   s.find(x => x.difficulty==='All')?.count    || 0,
      easy:    s.find(x => x.difficulty==='Easy')?.count   || 0,
      medium:  s.find(x => x.difficulty==='Medium')?.count || 0,
      hard:    s.find(x => x.difficulty==='Hard')?.count   || 0,
      ranking: u.profile.ranking,
      streak:  u.userCalendar?.streak || 0,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;