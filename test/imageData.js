module.exports = {
  EMPTY_IMAGE: {
    data: [],
    width: 0,
    height: 0,
    metdata: '0x0 empty image'
  },
  TWO_X_TWO: {
    data: [
      {grey: 255, rgb: {r: 255,g: 255,b: 255}},
      {grey: 255, rgb: {r: 255,g: 255,b: 255}},
      {grey: 255, rgb: {r: 255,g: 255,b: 255}},
      {grey: 255, rgb: {r: 255,g: 255,b: 255}}
    ],
    width: 2,
    height: 2,
    metdata: '2x2 black image'
  },
  FOUR_X_ONE: {
    data: [
      {grey: 255, rgb: {r: 255,g: 255,b: 255}},
      {grey: 255, rgb: {r: 255,g: 255,b: 255}},
      {grey: 255, rgb: {r: 255,g: 255,b: 255}},
      {grey: 255, rgb: {r: 255,g: 255,b: 255}}
    ],
    width: 4,
    height: 1,
    metdata: '4x1 black image'
  },
  PSUEDO_SEVEN_X_FIVE: {
    data: [
      1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, 32, 33, 34, 35 ],
    width: 7,
    height: 5,
    metdata: '7x5 psuedo image'
  },
  PSUEDO_THREE_X_THREE: {
    data: [
      1, 2, 3,
      4, 5, 6,
      7, 8, 9],
    width: 3,
    height: 3,
    metdata: '3x3 psuedo image'
  },
  PSUEDO_FIVE_X_TWO: {
    data: [
      1, 2, 3, 4, 5,
      6, 7, 8, 9, 10],
    width: 5,
    height: 2,
    metdata: '5x2 psuedo image'
  }
}
