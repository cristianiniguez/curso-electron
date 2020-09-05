import { remote, ipcRenderer } from 'electron'
import settings from 'electron-settings'
// import crypto from 'crypto'

window.addEventListener('load', () => {
  cancelButton()
  saveButton()
  if (settings.hasSync('cloudup.user')) {
    document.getElementById('cloudup-user').value = settings.getSync('cloudup.user')
  }
  if (settings.hasSync('cloudup.passwd')) {
    document.getElementById('cloudup-passwd').value = settings.getSync('cloudup.passwd')
  }
})

function cancelButton() {
  const cancelButton = document.getElementById('cancel-button')
  cancelButton.addEventListener('click', () => {
    const prefsWindow = remote.getCurrentWindow()
    prefsWindow.close()
  })
}

function saveButton() {
  const saveButton = document.getElementById('save-button')
  const prefsForm = document.getElementById('preferences-form')
  saveButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (prefsForm.reportValidity()) {
      settings.setSync('cloudup.user', document.getElementById('cloudup-user').value)
      settings.setSync('cloudup.passwd', document.getElementById('cloudup-passwd').value)
      const prefsWindow = remote.getCurrentWindow()
      prefsWindow.close()
    } else {
      ipcRenderer.send('show-dialog', {
        type: 'error',
        title: 'Platzipics',
        message: 'Por favor, complete los campos requeridos'
      })
    }
  })
}