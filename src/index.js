'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import devtools from './devtools'
import fs from 'fs'
import isImage from 'is-image'
import fileSize from 'filesize'
import path from 'path'

let win

if (process.env.NODE_ENV === 'development') {
  devtools()
}

app.on('before-quit', () => {
  console.log('Saliendo')
})

app.on('ready', () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Hola Mundo',
    center: true,
    maximizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.once('ready-to-show', () => {
    win.show()
  })
  win.on('move', () => {
    const position = win.getPosition()
    console.log(position)
  })
  win.on('closed', () => {
    win = null
    app.quit()
  })
  win.loadURL(`file://${__dirname}/renderer/index.html`)
  // win.toggleDevTools()
})

ipcMain.on('open-directory', event => {
  dialog.showOpenDialog(win, {
    title: 'Seleccione la nueva ubicación',
    buttonLabel: 'Abrir ubicación',
    properties: ['openDirectory']
  })
    .then(dir => {
      const images = []
      if (dir) {
        fs.readdir(dir.filePaths[0], (err, files) => {
          for (let i = 0; i < files.length; i++) {
            if (isImage(files[i])) {
              let imageFile = path.join(dir.filePaths[0], files[i])
              let stats = fs.statSync(imageFile)
              let size = fileSize(stats.size, {round: 0})
              images.push({
                filename: files[i],
                src: `file://${imageFile}`,
                size: size
              })
            }
          }
          console.log(images)
        })
      }
    })
})
