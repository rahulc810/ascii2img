const express = require('express');
const router = express.Router();
var logger = require('../utils/logger');
var asciiService = require('../services/asciiService');

router.post('/', function (req, res) {
    if (Object.keys(req.files).length == 0) {
        logger.error('No files were uploaded.')
        return res.status(400).send('No files were uploaded.');
    }
    const ret = asciiService(req.files.rawImg.data)

    res.render('ascii2img', {
        asciiImg: ret
    })
});

module.exports = router;