import { ipcRenderer, remote } from 'electron'
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
    saveImage(file, (err) => {
      if (err) {
        showDialog('error', 'Platzipics', err.message)
      } else {
        showDialog('info', 'Platzipics', 'La imagen fue guardada')
      }
    })
  })
}

function openPreferences() {
  const BrowserWindow = remote.BrowserWindow
  const preferencesWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Preferencias',
    center: true,
    modal: true,
    frame: true,
    show: false
  })
  preferencesWindow.show()
}

function openDirectory() {
  ipcRenderer.send('open-directory')
}

function saveFile() {
  const image = document.getElementById('image-displayed').dataset.original
  const ext = path.extname(image)
  ipcRenderer.send('open-save-dialog', ext)
}

function showDialog(type, title, msg) {
  ipcRenderer.send('show-dialog', {
    type: type,
    title, title,
    message: msg
  })
}

module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory,
  saveFile: saveFile,
  openPreferences: openPreferences
}