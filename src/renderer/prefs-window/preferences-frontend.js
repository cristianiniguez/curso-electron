import { remote, ipcRenderer } from 'electron'
import settings from 'electron-settings'
import crypto from 'crypto'

window.addEventListener('load', () => {
  cancelButton()
  saveButton()
  if (settings.hasSync('cloudup.user')) {
    document.getElementById('cloudup-user').value = settings.getSync('cloudup.user')
  }
  if (settings.hasSync('cloudup.passwd')) {
    let textParts = settings.getSync('cloudup.passwd').split(':')
    let iv = Buffer.from(textParts.shift(), 'hex')
    let encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from('jhdskhfk234423fsdf6sd43444df63dd'), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted += decipher.final('utf8')
    
    document.getElementById('cloudup-passwd').value = decrypted
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
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from('jhdskhfk234423fsdf6sd43444df63dd'), iv)
      let encrypted = cipher.update(document.getElementById('cloudup-passwd').value)
      encrypted += cipher.final('hex')
      encrypted = `${iv.toString('hex')}:${encrypted.toString('hex')}`

      settings.setSync('cloudup.user', document.getElementById('cloudup-user').value)
      settings.setSync('cloudup.passwd', encrypted)
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