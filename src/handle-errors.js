import { app, dialog } from 'electron'

function relaunchApp(win) {
  dialog.showMessageBox(win, {
    type: 'error',
    title: 'PlatziPics',
    message: 'Ocurrió un error inesperado, se reiniciará la aplicación'
  })
    .then(res => {
      app.relaunch()
      app.exit(0)
    })
}

function setupErrors(win) {
  win.webContents.on('crashed', () => {
    relaunchApp(win)
  })
  win.on('unresponsive', () => {
    dialog.showMessageBox(win, {
      type: 'warning',
      title: 'PlatziPics',
      message: 'Un proceso está tardando demasiado, puede esperar o reiniciar el aplicativo manualmente'
    })
  })
  process.on('uncaughtException', (err) => {
    relaunchApp(win)
  })
}

module.exports = setupErrors