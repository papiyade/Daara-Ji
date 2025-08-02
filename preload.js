const { contextBridge, ipcRenderer } = require('electron');

// Exposer les APIs protégées au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Base de données
  query: (query, params) => ipcRenderer.invoke('database-query', query, params),
  
  // Pensionnaires
  getPensionnaires: () => ipcRenderer.invoke('get-pensionnaires'),
  addPensionnaire: (pensionnaire) => ipcRenderer.invoke('add-pensionnaire', pensionnaire),
  updatePensionnaire: (id, pensionnaire) => ipcRenderer.invoke('update-pensionnaire', id, pensionnaire),
  deletePensionnaire: (id) => ipcRenderer.invoke('delete-pensionnaire', id),
  
  // Présences
  getPresences: (date) => ipcRenderer.invoke('get-presences', date),
  savePresence: (presence) => ipcRenderer.invoke('save-presence', presence),
  
  // Commissions
  getCommissions: () => ipcRenderer.invoke('get-commissions'),
  
  // Dashboard
  getDashboardStats: () => ipcRenderer.invoke('get-dashboard-stats'),
  
  // Alertes
  getAlerts: () => ipcRenderer.invoke('get-alerts'),
  
  // Dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options)
});

