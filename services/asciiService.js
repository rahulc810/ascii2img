const logger = require('../utils/logger');
const jpegJs = require('jpeg-js');
const _ = require('lodash');
const ndarray = require('ndarray')
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


const getAvgArrayNew = function (raw, factor, width) {
    let pixelArray = []
    for (let i = 0; i < raw.length - 3; i += 4) {
        pixelArray.push({
            r: raw[i],
            g: raw[i + 1],
            b: raw[i + 2],
            a: raw[i + 3]
        });
    }
    logger.info("Total pixels: " + pixelArray.length)

    let oneD = []
    let sumOfArea = 0;
    for (let i = 0; i < pixelArray.length ; i = i + ((width/factor)*factor*factor)) {
        for (let j = i; j < i+width ; j+= factor) {
            //if( i < 900){console.log(j)}
            let area=[], temp =[]
            for (let k = j; k < j+factor ; k++) {
               for( let l=0, idx=k; l< factor; l++,idx= idx + width){
                    if( i < 900){console.log(idx)}
                    let pixel = pixelArray[idx];
                    area.push(normalizePixel(pixel))
                   // temp.push(idx)
               }
              // console.log("****")
            }
            
            //if( j < 100){console.log(idx)}
            oneD.push(_.mean(area));
        }
    }
    //logger.error(oneD)
    return oneD
}

const normalizePixel = function(pixel){
    val = _.mean([pixel.r,pixel.g,pixel.b])
   // logger.error(val)
    return val
}

const toIndex = val => parseInt(val * 70 / 255)

const render = function (data) {
    //prepare pixel array
    let img = jpegJs.decode(data, true)
    //convert to grayscale
    let factor = 1;

    let oneD = getAvgArrayNew(img.data, factor, img.width)
    logger.info('Image details: ' + JSON.stringify({
        width: img.width,
        height: img.height
    }))
    //render it as wall of text
    let ret = printImg(oneD, img.width, img.height)
    return ret
}

module.exports = render