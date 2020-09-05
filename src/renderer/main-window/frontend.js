import { setIpc, openDirectory, saveFile, openPreferences, uploadImage, pasteImage } from './main-window/ipcRendererEvents'
import { addImagesEvent, searchImagesEvent, selectEvent, print } from './main-window/images-ui'

window.addEventListener('load', () => {
  setIpc()
  addImagesEvent()
  searchImagesEvent()
  selectEvent()
  buttonEvent('open-directory', openDirectory)
  buttonEvent('open-preferences', openPreferences)
  buttonEvent('save-button', saveFile)
  buttonEvent('print-button', print)
  buttonEvent('upload-button', uploadImage)
  buttonEvent('paste-button', pasteImage)
})

function buttonEvent(id, func) {
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click', func)
}