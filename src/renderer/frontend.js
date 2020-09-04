import { setIpc, openDirectory } from './ipcRendererEvents'
import { addImagesEvent, searchImagesEvent, selectEvent } from './images-ui'

window.addEventListener('load', () => {
  setIpc()
  addImagesEvent()
  searchImagesEvent()
  selectEvent()
  buttonEvent('open-directory', openDirectory)
})

function buttonEvent(id, func) {
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click', func)
}