const logger = require('../utils/logger');
const jpegJs = require('jpeg-js');
const ASCII_MAP = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. "

const printImg = function (arr, width, height) {
    let ret = line = ""
    for (let i = 0; i < arr.length; i += width) {
        line = ""
        for (let j = i; j < i + width; j++) {
            line += ASCII_MAP.charAt(toIndex(arr[j]) - 1)
        }
        ret += line + "\n"
    }
    return ret;
}

const getAvgArray = function (raw) {
    let oneD = []
    for (let i = 0; i < raw.length - 3; i = i + 4) {
        //i is red index
        let j = i + 1; //green index
        let k = i + 2; //blue index
        let alpha = i + 4; // alpha index
        let avg = (raw[i] + raw[j] + raw[k]) / 3;
        oneD.push(avg);
    }

    return oneD
}

const toIndex = val => parseInt(val * 70 / 255)

const render = function(data){
    //prepare pixel array
    let img = jpegJs.decode(data, true)
    //convert to grayscale
    let oneD = getAvgArray(img.data)
    logger.info('Image details: ' + { width: img.width, height: img.height})
    //render it as wall of text
    let ret = printImg(oneD, img.width, img.height)
    return ret
}

module.exports = render