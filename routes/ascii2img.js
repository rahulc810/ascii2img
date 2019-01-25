const express = require('express');
const router = express.Router();
var logger = require('../utils/logger');
var asciiService = require('../services/asciiService');
const bodyParser = require("body-parser");

router.post('/', function (req, res) {
    if (Object.keys(req.files).length == 0) {
        logger.error('No files were uploaded.')
        return res.status(400).send('No files were uploaded.');
    }
    const factor = parseInt(req.body.factor)
    const ret = asciiService(req.files.rawImg.data, factor)

    res.send(ret)
});

module.exports = router;