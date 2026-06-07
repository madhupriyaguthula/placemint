const router = require('express').Router();
const axios  = require('axios');

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const { data } = await axios.get(
      `https://alfa-leetcode-api.onrender.com/${username}`,
      { timeout: 15000 }
    );

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