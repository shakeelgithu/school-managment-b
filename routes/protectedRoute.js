const express = require('express');
const router = express.Router();
const auth = require('../middleware/uthMiddleware');

// Only accessible if token is valid
router.get('/dashboard', auth, (req, res) => {
  res.json({ msg: "Welcome to the dashboard!" });
});

module.exports = router;
