import fs from 'fs'

function applyFilter(filter, currentImage) {
  let imgObj = new Image();
  imgObj.src = currentImage.dataset.original;
  filterous.importImage(imgObj, {})
    .applyInstaFilter(filter)
    .renderHtml(currentImage);
}

function saveImage(fileName, callback) {
  let fileSrc = document.getElementById('image-displayed').src
  fileSrc = fileSrc.replace(/^data:([A-Za-z-+/]+);base64,/, '')
  fs.writeFile(fileName, fileSrc, 'base64', callback)
}

module.exports = {
  applyFilter: applyFilter,
  saveImage: saveImage
}