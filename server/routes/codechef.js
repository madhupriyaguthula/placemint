const router  = require('express').Router();
const axios   = require('axios');
const cheerio = require('cheerio');

router.get('/:username', async (req, res) => {
  try {
    const { data: html } = await axios.get(`https://www.codechef.com/users/${req.params.username}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(html);
    res.json({
      rating:      $('.rating-number').first().text().trim() || 'N/A',
      stars:       $('.user-stars').first().text().trim()    || 'N/A',
      global_rank: $('.rating-ranks li:first-child strong').text().trim() || 'N/A',
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;