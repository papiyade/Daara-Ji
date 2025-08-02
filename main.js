const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Database = require('./src/database/database');

// Garder une référence globale de l'objet window
let mainWindow;
let database;

function createWindow() {
  // Créer la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false
  });

  // Charger l'index.html de l'application
  mainWindow.loadFile('src/renderer/index.html');

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Ouvrir les DevTools en mode développement
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Émis quand la fenêtre est fermée
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Cette méthode sera appelée quand Electron aura fini de s'initialiser
app.whenReady().then(() => {
  // Initialiser la base de données
  database = new Database();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (database) {
      database.close();
    }
    app.quit();
  }
});

// IPC Handlers pour la communication avec le renderer
ipcMain.handle('database-query', async (event, query, params = []) => {
  try {
    return database.query(query, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
});

ipcMain.handle('get-pensionnaires', async () => {
  try {
    return database.getPensionnaires();
  } catch (error) {
    console.error('Error getting pensionnaires:', error);
    throw error;
  }
});

ipcMain.handle('add-pensionnaire', async (event, pensionnaire) => {
  try {
    return database.addPensionnaire(pensionnaire);
  } catch (error) {
    console.error('Error adding pensionnaire:', error);
    throw error;
  }
});

ipcMain.handle('update-pensionnaire', async (event, id, pensionnaire) => {
  try {
    return database.updatePensionnaire(id, pensionnaire);
  } catch (error) {
    console.error('Error updating pensionnaire:', error);
    throw error;
  }
});

ipcMain.handle('delete-pensionnaire', async (event, id) => {
  try {
    return database.deletePensionnaire(id);
  } catch (error) {
    console.error('Error deleting pensionnaire:', error);
    throw error;
  }
});

ipcMain.handle('get-presences', async (event, date) => {
  try {
    return database.getPresences(date);
  } catch (error) {
    console.error('Error getting presences:', error);
    throw error;
  }
});

ipcMain.handle('save-presence', async (event, presence) => {
  try {
    return database.savePresence(presence);
  } catch (error) {
    console.error('Error saving presence:', error);
    throw error;
  }
});

ipcMain.handle('get-commissions', async () => {
  try {
    return database.getCommissions();
  } catch (error) {
    console.error('Error getting commissions:', error);
    throw error;
  }
});

ipcMain.handle('get-dashboard-stats', async () => {
  try {
    return database.getDashboardStats();
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
});

ipcMain.handle('get-alerts', async () => {
  try {
    return database.getAlerts();
  } catch (error) {
    console.error('Error getting alerts:', error);
    throw error;
  }
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

