const { contextBridge, ipcRenderer } = require('electron')
//const { data } = require('jquery')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
contextBridge.exposeInMainWorld('electronAPI', {
  handlePrinterErr: (callback) => ipcRenderer.on('printer-err', callback),
  AddItem: (data) => ipcRenderer.send('add-row', data),
  handleSyncConfig: (config) => ipcRenderer.on('sync-config', config)
})