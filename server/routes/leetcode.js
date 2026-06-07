const router = require('express').Router();
const axios  = require('axios');

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Unofficial LeetCode stats API
    const { data } = await axios.get(
      `https://leetcode-stats-api.herokuapp.com/${username}`,
      { timeout: 10000 }
    );

    if (data.status === 'error') {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      total:   data.totalSolved   || 0,
      easy:    data.easySolved    || 0,
      medium:  data.mediumSolved  || 0,
      hard:    data.hardSolved    || 0,
      ranking: data.ranking       || 0,
      streak:  0,
    });
  } catch (err) {
    console.error('LEETCODE ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;