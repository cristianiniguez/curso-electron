import { ipcRenderer, remote, clipboard } from 'electron'
import settings from 'electron-settings'
import { addImagesEvent, clearImages, loadImages, selectFirstImage } from './images-ui'
import { saveImage } from './filters'
import Cloudup from 'cloudup-client'
import crypto from 'crypto'
import path from 'path'
import os from 'os'

function setIpc() {
  if (settings.hasSync('directory')) {
    ipcRenderer.send('load-directory', settings.getSync('directory'))
  }
  ipcRenderer.on('load-images', (event, dir, images) => {
    clearImages()
    loadImages(images)
    addImagesEvent()
    selectFirstImage()
    settings.setSync('directory', dir)
    document.getElementById('directory').innerHTML = dir
  })
  ipcRenderer.on('save-image', (event, file) => {
    saveImage(file, (err) => {
      if (err) {
        showDialog('error', 'Platzipics', err.message)
      } else {
        document.getElementById('image-displayed').dataset.filtered = file
        showDialog('info', 'Platzipics', 'La imagen fue guardada')
      }
    })
  })
}

function openPreferences() {
  const BrowserWindow = remote.BrowserWindow
  const mainWindow = remote.getGlobal('win')
  const preferencesWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Preferencias',
    center: true,
    modal: true,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  if (os.platform() !== 'win32') {
    preferencesWindow.setParentWindow(mainWindow)
  }
  preferencesWindow.once('ready-to-show', () => {
    preferencesWindow.show()
    preferencesWindow.focus()
  })
  preferencesWindow.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`)
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
    title: title,
    message: msg
  })
}

function uploadImage() {
  let imageNode = document.getElementById('image-displayed')
  let image
  if (imageNode.dataset.filtered) {
    image = imageNode.dataset.filtered
  } else {
    image = imageNode.src
  }
  image = image.replace('file:///', '')
  let fileName = path.basename(image)
  if (settings.hasSync('cloudup.user') && settings.hasSync('cloudup.passwd')) {
    let textParts = settings.getSync('cloudup.passwd').split(':')
    let iv = Buffer.from(textParts.shift(), 'hex')
    let encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from('jhdskhfk234423fsdf6sd43444df63dd'), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted += decipher.final('utf8')

    const client = Cloudup({
      user: settings.getSync('cloudup.user'),
      pass: decrypted
    })

    const stream = client.stream({
      title: `Platzipics - ${fileName}`
    })
    stream.file(image).save((err) => {
      if (err) {
        showDialog('error', 'Platzipics', 'Verifique su conexión o sus credenciales de cloudup')
        console.error(err)
      } else {
        clipboard.writeText(stream.url)
        showDialog('info', 'Platzipics', `Imagen cargada con éxito - ${stream.url} - Enlace copiado en el portapapeles`)
      }
    })
  } else {
    showDialog('error', 'Platzipics', 'Por favor complete las preferencias de cloudup')
  }
}

function pasteImage() {
  const image = clipboard.readImage()
  const data = image.toDataURL()
  if (data.indexOf('data:image/png;base64') !== -1 && !image.isEmpty()) {
    let mainImage = document.getElementById('image-displayed')
    mainImage.src = data
    mainImage.dataset.original = data
  } else {
    showDialog('error', 'Platzipics', 'No hay imagen válida en el portapapeles')
  }
}

module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory,
  saveFile: saveFile,
  openPreferences: openPreferences,
  uploadImage: uploadImage,
  pasteImage: pasteImage
}