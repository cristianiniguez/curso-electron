import { setIpc, openDirectory, saveFile, openPreferences } from './main-window/ipcRendererEvents'
import { addImagesEvent, searchImagesEvent, selectEvent } from './main-window/images-ui'

window.addEventListener('load', () => {
  setIpc()
  addImagesEvent()
  searchImagesEvent()
  selectEvent()
  buttonEvent('open-directory', openDirectory)
  buttonEvent('open-preferences', openPreferences)
  buttonEvent('save-button', saveFile)
})

function buttonEvent(id, func) {
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click', func)
}