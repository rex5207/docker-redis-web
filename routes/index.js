'use strict';
let express = require('express');
let router = express.Router();

/* GET Root path. */
router.get('/', (req, res) => {
  res.json({
    status: 'on',
  });
});

module.exports = router;
