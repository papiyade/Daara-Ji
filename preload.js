const { contextBridge, ipcRenderer } = require('electron');

// Exposer les APIs protégées au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Utilitaires
  utils: {
    formatDate: (date) => {
      return new Date(date).toLocaleDateString('fr-FR');
    },
    formatDateTime: (date) => {
      return new Date(date).toLocaleString('fr-FR');
    }
  },

  // IPC pour communication avec le processus principal
  ipc: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, callback),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
  },
  
  // Dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // File operations
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
  exportExcel: (data, fileName) => ipcRenderer.invoke('export-excel', data, fileName),
  exportPDF: (htmlContent, fileName) => ipcRenderer.invoke('export-pdf', htmlContent, fileName)
});
