const expect = require('chai').expect
const assert = require('assert')
const forEach = require('mocha-each')
const svc = require('../services/asciiService')
const images = require('./imageData')

describe('_printImgage::convert image array to block of text', function () {
  forEach([
    [ images.TWO_X_TWO, '  \n  \n'],
    [ images.FOUR_X_ONE, '    \n']
  ]).it('input: %j, output: %s', (evaluatedImage, output) => {
    const evaled = svc._printImgage(evaluatedImage)
    expect(evaled).to.be.equal(output)
  })
})

describe('_rgbToHex::convert 255,255,255 notation to hex notation', function () {
  forEach([
    [{r: 255, g: 255, b: 255}, '#ffffff'],
    [{r: 0, g: 0, b: 0}, '#000000'],
    [{r: 100, g: 25, b: 35}, '#641923'],
    [{r: 22, g: 22, b: 22}, '#161616'],
    [{r: 96,  g: 245, b: 47}, '#60f52f']
  ]).it('input: %j output: %s', (rgbObject, output) => {
    const evaled = svc._rgbToHex(rgbObject)
    expect(evaled).to.be.equal(output)
  })
})

describe('_trimImgage:: trim the image so the dimensions are divisible by factor', function () {
  forEach([
    [ // 5x2 => 4x2
      images.PSUEDO_FIVE_X_TWO,
      2,
      {data: [
          1, 2, 3, 4,
          6, 7, 8, 9],
      width: 4}],
    // 0x0 => 0x0
    [{data: [], width: 0}, 2, {data: [], width: 0}],
    // 7x5 => 6x5
    [
      images.PSUEDO_SEVEN_X_FIVE,
      2,
      {data: [
          1, 2, 3, 4, 5, 6,
          8, 9, 10, 11, 12, 13,
          15, 16, 17, 18, 19, 20,
          22, 23, 24, 25, 26, 27,
          29, 30, 31, 32, 33, 34],
      width: 6}],
    // 3x3 => 3x3
    [
      images.PSUEDO_THREE_X_THREE,
      3,
      {data: [
          1, 2, 3,
          4, 5, 6,
          7, 8, 9],
      width: 3}],
    // 3x3 => 2x3
    [
      images.PSUEDO_THREE_X_THREE,
      2,
      {data: [
          1, 2,
          4, 5,
          7, 8],
      width: 2}]

  ]).it('input: %j %s %s output: %j', (img, factor, output) => {
    const evaled = svc._trimImgage(img, factor)
    expect(evaled).to.deep.include(output)
  })
})

// describe('_convertToGreyscale:: converts the imgae to its greyscale equivalent', function () {
//   forEach([
//     [images.TWO_X_TWO, 2, {}]
//   ]).it('input: %j  output: %s', (image, factor, output) => {
//     const evaled = svc._convertToGreyscale()
//     expect(evaled).to.be.equal(output)
//   })
// })

describe('', function(){
    forEach([
  
    ]).it('input: %j  output: %s', (output)=>{
      const evaled= svc.func()
      expect(evaled).to.be.equal(output)
    })
  })

// describe('', function(){
//   forEach([

//   ]).it('input: %j  output: %s', (output)=>{
//     const evaled= svc.func()
//     expect(evaled).to.be.equal(output)
//   })
// })
