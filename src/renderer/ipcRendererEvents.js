import { ipcRenderer } from 'electron'
import { addImagesEvent, clearImages, loadImages, selectFirstImage } from './images-ui'
import { saveImage } from './filters'
import path from 'path'

function setIpc() {
  ipcRenderer.on('load-images', (event, images) => {
    clearImages()
    loadImages(images)
    addImagesEvent()
    selectFirstImage()
  })
  ipcRenderer.on('save-image', (event, file) => {
    saveImage(file)
  })
}

function openDirectory() {
  ipcRenderer.send('open-directory')
}

function saveFile() {
  const image = document.getElementById('image-displayed').dataset.original
  const ext = path.extname(image)
  ipcRenderer.send('open-save-dialog', ext)
}

module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory,
  saveFile: saveFile
}