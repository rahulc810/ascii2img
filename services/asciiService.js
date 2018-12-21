const logger = require('../utils/logger')
const jpegJs = require('jpeg-js')
const _ = require('lodash')

const ASCII_RAMPS = {
  'smallInvert': ' .:-=+*#%@',
  'small': '@%#*++-:. ',
  'medium': '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  'large': '@MBHENR#KWXDFPQASUZbdehx*8Gm&04LOVYkpq5Tagns69owz$CIu23Jcfry%1v7l+it[] {}?j|()=~!-/<>"^_\';,:`. '
}

const ASCII_MAP = ASCII_RAMPS.small

const printImgage = function (arr, width) {
  let ret = '', line = ''
  for (let i = 0; i < arr.length; i += width, line='') {
    for (let j = i; j < i + width && j < arr.length; j++) {
      line += ASCII_MAP[toIndex(arr[j])]
    }
    ret += line + '\n'
  }
  return ret
}

const trimImgage = function (rawPixels, factor, width) {
  let factorChunks = Math.floor(width / factor)
  let extra = width - (factorChunks * factor)
  let prunedImg = []
  for (let i = 0, row = 0; i < rawPixels.length; i++) {
    if (i > (row * width) + (factorChunks * factor) - 1) {
      // jump extra
      i += extra - 1
      row++
      continue
    }
    prunedImg.push(rawPixels[i])
  }
  raw = null
  return {'data': prunedImg, 'width': factorChunks * factor}
}

const getPixels = function (raw) {
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
  return pixelArray
}

const convertToGreyscale = function (pixelArray, factor, width) {
  const grayScalePixels = []
  for (let i = 0; i < pixelArray.length; i = i + ((width / factor) * factor * factor)) {
    for (let j = i; j < i + width; j += factor) {
      let area = []
      for (let k = j; k < j + factor; k++) {
        for ( let l = 0, idx = k; l < factor; l++, idx = idx + width) {
          area.push(normalizePixel(pixelArray[idx]))
        }
      }
      grayScalePixels.push(_.mean(area))
    }
  }
  return grayScalePixels
}

const normalizePixel = function (pixel) {
  // GrayScale = 0.21 R + 0.72 G + 0.07 B gives better contrast than average of rgb
  // return pixel ?  _.mean([pixel.r,pixel.g,pixel.b]) : 0
  return pixel ? (0.21 * pixel.r) + (0.72 * pixel.g) + (0.07 * pixel.b) : 0
}

const toIndex = val => Math.ceil((val * (ASCII_MAP.length - 1)) / 255)

const validateFactor = (factor, width, height) => {
  return factor < 1 || factor > width || factor > height ? false : true
}

const render = function (data, factor) {
  // prepare pixel array
  let img = jpegJs.decode(data, true)

   if (!validateFactor(factor, img.width, img.height)) {
     throw 'Invalid rendering factor'
   }

  const pixelArray = getPixels(img.data)
  img = trimImgage(pixelArray, factor, img.width)

  const oneD = convertToGreyscale(img.data, factor, img.width)
  logger.info('Image details: ' + JSON.stringify({
      width: img.width,
      height: img.height
    }))
  // render it as wall of text
  return printImgage(oneD, parseInt(img.width / factor))
}

module.exports = render
