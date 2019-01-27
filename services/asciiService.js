const logger = require('../utils/logger')
const jpegJs = require('jpeg-js')
const _ = require('lodash')

const ASCII_RAMPS = {
  'smallInvert': ' .:-=+*#%@',
  'small': '@%#*++-:. ',
  'medium': '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  'large': '@MBHENR#KWXDFPQASUZbdehx*8Gm&04LOVYkpq5Tagns69owz$CIu23Jcfry%1v7l+it[] {}?j|()=~!-/<>"^_\';,:`. ',
  'color': '@@@@'
}
const ASCII_MAP = ASCII_RAMPS.small
const DEFAULT_RENDERING_FACTOR = 4

const _printImgage = function (img) {
  const arr = img.data
  const width = img.width
  let ret = '', line = '', prev = '', lastPx = arr[0].rgb
  for (let i = 0; i < arr.length; i += width, line = '') {
    for (let j = i; j < i + width && j < arr.length; j++) {
      // TODO: _colorize only if factor is 1
      // ascii value is derived from greyscale part
      let ascii = ASCII_MAP[_toIndex(arr[j].grey)]
      // console.log(parseInt(j-prev.length/2))
      // console.log(sourceImg)
      lastPx = arr[parseInt(j - prev.length / 2)].rgb
      // if(!lastPx){
      //   lastPx = sourceImg[j]
      // }
      if (prev && prev.charAt(0).toString() !== ascii.toString()) {
        // _colorize
        line += _colorize(prev, lastPx)
        prev = ''
      }
      prev += ascii
    }
    // _colorize last chunk of prev
    line += _colorize(prev, lastPx)
    prev = ''
    // lastPx = null
    ret += line + '\n'
  }
  return ret
}

const _rgbToHex = function (element) {
  return '#' + ((1 << 24) + (element.r << 16) + (element.g << 8) + element.b).toString(16).slice(1)
}

const _colorize = function (val, element) {
  return val
// return "<span style='color:" + _rgbToHex(element) + ";'>" + val + '</span>'
}

const _trimImgage = function (img, factor) {
  const rawPixels = img.data
  const width = img.width
  const factorChunks = Math.floor(width / factor)
  const extra = width - (factorChunks * factor)
  const prunedImg = []
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

const _getPixels = function (raw) {
  let pixelArray = []
  for (let i = 0; i < raw.length - 3; i += 4) {
    pixelArray.push({
      r: raw[i],
      g: raw[i + 1],
      b: raw[i + 2],
      a: raw[i + 3]
    })
  }
  return pixelArray;
}

const _convertToGreyscale = function (img, factor) {
  const pixelArray = img.data
  const width = img.width
  const scaledPixels = []
  for (let i = 0; i < pixelArray.length; i = i + ((width / factor) * factor * factor)) {
    for (let j = i; j < i + width; j += factor) {
      let area = []
      for (let k = j; k < j + factor; k++) {
        for ( let l = 0, idx = k; l < factor && idx < pixelArray.length; l++, idx = idx + width) {
          // console.log(idx, '*******',pixelArray[idx]);
          if(!pixelArray[idx]){
            console.log(idx, '*******',pixelArray[idx]);
          }
          area.push({grey: _normalizePixel(pixelArray[idx]), rgb: pixelArray[idx]})
        }
      }
      scaledPixels.push({grey: _.meanBy(area, function (o) { return o.grey; }), rgb: _postNormalization(area)})
    }
  }
  return {data: scaledPixels, width: parseInt(img.width / factor)}
}

const _postNormalization = function (pixels) {
  return {r: _.meanBy(pixels, function (o) { return o.rgb.r; }),g: _.meanBy(pixels, function (o) { return o.rgb.g; }),b: _.meanBy(pixels, function (o) { return o.rgb.b; })}
}

const _normalizePixel = function (pixel) {
  // GrayScale = 0.21 R + 0.72 G + 0.07 B gives better contrast than average of rgb
  // return pixel ?  _.mean([pixel.r,pixel.g,pixel.b]) : 0
  return pixel ? (0.21 * pixel.r) + (0.72 * pixel.g) + (0.07 * pixel.b) : 0
}

const _toIndex = val => Math.ceil((val * (ASCII_MAP.length - 1)) / 255)

const validateFactor = (factor, width, height) => {
  return factor < 1 || factor > width || factor > height ? false : true
}

const render = function (data, factor) {
  if (!factor) {
    factor = DEFAULT_RENDERING_FACTOR
  }
  // prepare pixel array
  let img = jpegJs.decode(data, true)

  if (!validateFactor(factor, img.width, img.height)) {
    throw 'Invalid rendering factor'
  }

  // Convert array of values to array of Pixels. r1,g1,b1,r2,g2,b2... -> {r1g1b1},{r2,g2,b2}...
  const pixelArray = _getPixels(img.data)
  // trim image width so it is a multiple of factor
  const scaledImage = _trimImgage({data: pixelArray, width: img.width}, factor)

  const scaledGreyImg = _convertToGreyscale(scaledImage, factor)
  // render it as wall of text
  return _printImgage(scaledGreyImg)
}

module.exports = {
  render: render,
  _colorize: _colorize,
  _printImgage: _printImgage,
  _rgbToHex: _rgbToHex,
  _trimImgage: _trimImgage,
  _convertToGreyscale: _convertToGreyscale,
  _getPixels: _getPixels,
  _normalizePixel: _normalizePixel,
  _postNormalization: _postNormalization,
  _toIndex: _toIndex
}
