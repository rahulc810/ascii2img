const express = require('express');
const router = express.Router();
const getColors = require('get-image-colors')
const jpegJs = require('jpeg-js')
const ASCII_MAP = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. "

router.post('/', function(req, res) {

    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
      }
    let img = jpegJs.decode(req.files.rawImg.data, true)
    
    let oneD = getAvgArray(img.data)
    console.log(img.data.length);
    console.log(oneD.length);
    console.log(img.width, img.height)
   // oneD.forEach(x => console.log(ASCII_MAP.charAt(getAscii(x))))
   printImg(oneD, img.width, img.height)

    res.send("Done")
});

const printImg = (arr, width, height) => {
    let line = ""
    for(let i=0; i < arr.length; i=i+width ){
        line = ""
        for(let j=i; j < width; j++ ){
            line += ""+ getAscii(arr[j])
        }
        console.log(line)
    }
}

const getAvgArray = (raw) => {
    let oneD = []
    for(let i=0 ; i < raw.length-3; i=i+4){
        let j = i+ 1;
        let k = i+ 2;
        let alpha = i +4;
        let avg = (raw[i] + raw[j] + raw[k]) /3;
        oneD.push(avg);
    }
    
    return oneD
}

const getAscii = val => new Uint8Array(val*70/255)

module.exports = router;