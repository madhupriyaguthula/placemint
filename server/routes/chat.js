const router = require('express').Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    const { data } = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `
You are PlaceMint's AI assistant.

You help students with:
- Career guidance
- DSA preparation
- Interview preparation
- Resume improvement
- Using PlaceMint features

Keep responses concise and helpful.
`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error(err.response?.data || err);

    res.status(500).json({
      reply: 'Sorry, something went wrong.'
    });
  }
});

module.exports = router;