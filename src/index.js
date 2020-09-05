'use strict'

import { app, BrowserWindow } from 'electron'
import devtools from './devtools'
import handleErrors from './handle-errors'
import setMainIpc from './ipcMainEvents'

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
  setMainIpc(win)
  handleErrors(win)
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

