const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('AudioVizDesktop', {
  isDesktop: true,
  getFilePath(file) {
    return file && typeof file.path === 'string' ? file.path : null;
  },
  async copyOriginal(filePath, fileName) {
    return ipcRenderer.invoke('audio-viz:copy-original', filePath, fileName);
  },
  async beginExport(fileName) {
    return ipcRenderer.invoke('audio-viz:begin-export', fileName);
  },
  async appendExportChunk(arrayBuffer) {
    return ipcRenderer.invoke('audio-viz:append-export', arrayBuffer);
  },
  async finishExport(options) {
    return ipcRenderer.invoke('audio-viz:finish-export', options || {});
  },
  async cancelExport() {
    return ipcRenderer.invoke('audio-viz:cancel-export');
  },
  async showFile(filePath) {
    return ipcRenderer.invoke('audio-viz:show-file', filePath);
  }
});
