'use strict'

import { app, BrowserWindow } from 'electron'
import devtools from './devtools'
import handleErrors from './handle-errors'
import setMainIpc from './ipcMainEvents'

global.win

if (process.env.NODE_ENV === 'development') {
  devtools()
}

app.on('before-quit', () => {
  console.log('Saliendo')
})

app.on('ready', () => {
  global.win = new BrowserWindow({
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
  setMainIpc(global.win)
  handleErrors(global.win)
  global.win.once('ready-to-show', () => {
    global.win.show()
  })
  global.win.on('move', () => {
    const position = global.win.getPosition()
    console.log(position)
  })
  global.win.on('closed', () => {
    global.win = null
    app.quit()
  })
  global.win.loadURL(`file://${__dirname}/renderer/index.html`)
  // win.toggleDevTools()
})

