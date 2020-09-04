import { ipcRenderer } from 'electron'
import { addImagesEvent, clearImages, loadImages, selectFirstImage } from './images-ui'

function setIpc() {
  ipcRenderer.on('load-images', (event, images) => {
    clearImages()
    loadImages(images)
    addImagesEvent()
    selectFirstImage()
  })
}

function openDirectory() {
  ipcRenderer.send('open-directory')
}

module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory
}