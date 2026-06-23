const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    const lastMessage = messages[messages.length - 1]?.content;

    res.json({
      reply: `You asked: ${lastMessage}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Something went wrong."
    });
  }
});

module.exports = router;