const logger = require('../utils/logger')
const jpegJs = require('jpeg-js')
const _ = require('lodash')
// const ASCII_MAP = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. "
// const ASCII_MAP = "@MBHENR#KWXDFPQASUZbdehx*8Gm&04LOVYkpq5Tagns69owz$CIu23Jcfry%1v7l+it[] {}?j|()=~!-/<>\"^_';,:`. "
// const ASCII_MAP = " .:-=+*#%@"
const ASCII_MAP = '@%#*+=-:. '
// $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`'.
// @MBHENR#KWXDFPQASUZbdehx*8Gm&04LOVYkpq5Tagns69owz$CIu23Jcfry%1v7l+it[] {}?j|()=~!-/<>\"^_';,:`. 

const printImg = function (arr, width) {
  let ret = '', line = ''
  for (let i = 0; i < arr.length; i += width) {
    line = ''
    for (let j = i; j < i + width && j < arr.length; j++) {
      line += ASCII_MAP[toIndex(arr[j])]
    }
    ret += line + '\n'
  }
  return ret
}

const getAvgArray = function (raw) {
  let oneD = []
  for (let i = 0; i < raw.length - 3; i = i + 4) {
    // i is red index
    let j = i + 1 // green index
    let k = i + 2 // blue index
    let alpha = i + 4 // alpha index
    let avg = (raw[i] + raw[j] + raw[k]) / 3
    oneD.push(avg)
  }
  return oneD
}

const trimImg = function (img, factor) {
  const width = img.width
  let raw = img.data
  let factorChunks = Math.floor(width / factor)
  let extra = width - (factorChunks * factor)
  let prunedImg = []
  for (let i = 0, row = 0; i < raw.length; i++) {
    if (i > (row * width) + (factorChunks * factor) - 1) {
      // jump extra
      i += extra - 1
      row++
      continue
    }else {
      prunedImg.push(raw[i])
    }
  }
  img.data = Buffer.from(prunedImg)
  img.width = factorChunks * factor
  // free
  raw = null
  return img
}

const getAvgArrayNew = function (raw, factor, width) {
  let pixelArray = []
  for (let i = 0; i < raw.length - 3; i += 4) {
    pixelArray.push({
      r: raw[i],
      g: raw[i + 1],
      b: raw[i + 2],
      a: raw[i + 3]
    })
  }
  logger.info('Total pixels: ' + pixelArray.length)

  let oneD = []
  for (let i = 0; i < pixelArray.length; i = i + ((width / factor) * factor * factor)) {
    for (let j = i; j < i + width; j += factor) {
      let area = []
      for (let k = j; k < j + factor; k++) {
        for ( let l = 0, idx = k; l < factor; l++, idx = idx + width) {
          let pixel = pixelArray[idx]
          area.push(normalizePixel(pixel))
        }
      }
      oneD.push(_.mean(area))
    }
  }
  return oneD
}

const normalizePixel = function (pixel) {
  // GrayScale = 0.21 R + 0.72 G + 0.07 B
  // return pixel ?  _.mean([pixel.r,pixel.g,pixel.b]) : 0
  return pixel ? (0.21 * pixel.r) + (0.72 * pixel.g) + (0.07 * pixel.b) : 0
}

const toIndex = val => Math.ceil((val * (ASCII_MAP.length - 1)) / 255)

const render = function (data, factor) {

  // trimImg([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],4,6)

  // prepare pixel array
  let img = jpegJs.decode(data, true)
  // convert to grayscale
  if (factor > img.width || factor > img.height) {
    throw 'Invalid factor'
  }
  img = trimImg(img, factor)

  createImg(img.data)

  // const ratio = img.width / img.height

  let oneD = getAvgArrayNew(img.data, factor, img.width)
  logger.info('Image details: ' + JSON.stringify({
      width: img.width,
      height: img.height
    }))
  // render it as wall of text
  // parseInt(img.width/(factor * ratio)
  let ret = printImg(oneD, parseInt(img.width / factor))
  return ret
}

const createImg = function (data) {
  jpegJs.encode(data, 100)

  const fs = require('fs')
  fs.writeFile('/tmp/test.jpeg', data, function (err) {
    if (err) {
      return console.log(err)
    }

    console.log('The file was saved!')
  })
}

module.exports = render
