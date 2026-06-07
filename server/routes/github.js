const router = require('express').Router();
const axios  = require('axios');

router.get('/:username', async (req, res) => {
  try {
   const h = { 
  'User-Agent': 'PlaceMint',
  'Authorization': `token ${process.env.GITHUB_TOKEN}`
};
    const [u, r] = await Promise.all([
      axios.get(`https://api.github.com/users/${req.params.username}`, { headers: h }),
      axios.get(`https://api.github.com/users/${req.params.username}/repos?per_page=100&sort=updated`, { headers: h }),
    ]);
    const langs = {};
    r.data.forEach(repo => { if (repo.language) langs[repo.language] = (langs[repo.language]||0)+1; });
    res.json({
      name: u.data.name, bio: u.data.bio,
      public_repos: u.data.public_repos, followers: u.data.followers,
      stars: r.data.reduce((s,x)=>s+x.stargazers_count,0),
      top_languages: Object.entries(langs).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([l])=>l),
      recent_repos: r.data.slice(0,5).map(x=>({ name:x.name, description:x.description, stars:x.stargazers_count, language:x.language, url:x.html_url })),
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;