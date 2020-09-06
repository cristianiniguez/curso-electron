import { ipcMain, dialog } from 'electron'
import fs from 'fs'
import isImage from 'is-image'
import fileSize from 'filesize'
import path from 'path'

function setMainIpc(win) {
  ipcMain.on('open-directory', event => {
    dialog.showOpenDialog(win, {
      title: 'Seleccione la nueva ubicación',
      buttonLabel: 'Abrir ubicación',
      properties: ['openDirectory']
    })
      .then(res => {
        if (!res.canceled) {
          loadImges(event, res.filePaths[0])
        }
      })
  })

  ipcMain.on('load-directory', (event, dir) => {
    loadImges(event, dir)
  })

  ipcMain.on('open-save-dialog', (event, ext) => {
    dialog.showSaveDialog(win, {
      title: 'Guardar imagen modificada',
      buttonLabel: 'Guardar imagen',
      filters: [{ name: 'Images', extensions: [ext.substr(1)] }]
    })
      .then(res => {
        if (!res.canceled) {
          event.sender.send('save-image', res.filePath)
        }
      })
  })

  ipcMain.on('show-dialog', (event, info) => {
    dialog.showMessageBox(win, {
      type: info.type,
      title: info.title,
      message: info.message
    })
  })
}

function loadImges(event, dir) {
  const images = []
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err
    }
    for (let i = 0; i < files.length; i++) {
      if (isImage(files[i])) {
        let imageFile = path.join(dir, files[i])
        let stats = fs.statSync(imageFile)
        let size = fileSize(stats.size, { round: 0 })
        images.push({
          filename: files[i],
          src: `plp://${imageFile}`,
          size: size
        })
      }
    }
    event.sender.send('load-images', dir, images)
  })
}

module.exports = setMainIpc
