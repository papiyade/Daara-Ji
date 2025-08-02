const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Garder une référence globale de l'objet window
let mainWindow;

function createWindow() {
    // Créer la fenêtre du navigateur
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon: path.join(__dirname, '../../assets/icon.png'),
        show: false, // Ne pas afficher immédiatement
        titleBarStyle: 'default'
    });

    // Charger l'index.html de l'application
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Afficher la fenêtre quand elle est prête
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Ouvrir les DevTools en mode développement
        if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Émis quand la fenêtre est fermée
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Gérer les liens externes
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });
}

// Cette méthode sera appelée quand Electron aura fini de s'initialiser
app.whenReady().then(() => {
    createWindow();
    createMenu();

    app.on('activate', () => {
        // Sur macOS, il est courant de recréer une fenêtre quand l'icône du dock est cliquée
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
    // Sur macOS, il est courant que les applications restent actives jusqu'à ce que l'utilisateur quitte explicitement
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Créer le menu de l'application
function createMenu() {
    const template = [
        {
            label: 'Fichier',
            submenu: [
                {
                    label: 'Nouveau Pensionnaire',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'new-pensionnaire');
                    }
                },
                {
                    label: 'Exporter les données',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'export-data');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Quitter',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Édition',
            submenu: [
                { role: 'undo', label: 'Annuler' },
                { role: 'redo', label: 'Rétablir' },
                { type: 'separator' },
                { role: 'cut', label: 'Couper' },
                { role: 'copy', label: 'Copier' },
                { role: 'paste', label: 'Coller' },
                { role: 'selectall', label: 'Tout sélectionner' }
            ]
        },
        {
            label: 'Navigation',
            submenu: [
                {
                    label: 'Dashboard',
                    accelerator: 'CmdOrCtrl+1',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate-dashboard');
                    }
                },
                {
                    label: 'Pensionnaires',
                    accelerator: 'CmdOrCtrl+2',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate-pensionnaires');
                    }
                },
                {
                    label: 'Présences',
                    accelerator: 'CmdOrCtrl+3',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate-presences');
                    }
                },
                {
                    label: 'Commissions',
                    accelerator: 'CmdOrCtrl+4',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate-commissions');
                    }
                },
                {
                    label: 'Alertes',
                    accelerator: 'CmdOrCtrl+5',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate-alertes');
                    }
                },
                {
                    label: 'Rapports',
                    accelerator: 'CmdOrCtrl+6',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate-rapports');
                    }
                }
            ]
        },
        {
            label: 'Affichage',
            submenu: [
                { role: 'reload', label: 'Actualiser' },
                { role: 'forceReload', label: 'Actualiser (forcé)' },
                { role: 'toggleDevTools', label: 'Outils de développement' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom normal' },
                { role: 'zoomIn', label: 'Zoom avant' },
                { role: 'zoomOut', label: 'Zoom arrière' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Plein écran' }
            ]
        },
        {
            label: 'Fenêtre',
            submenu: [
                { role: 'minimize', label: 'Réduire' },
                { role: 'close', label: 'Fermer' }
            ]
        },
        {
            label: 'Aide',
            submenu: [
                {
                    label: 'À propos',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'À propos',
                            message: 'Daara Re-Creation Manager',
                            detail: 'Version 1.0.0\\n\\nApplication de gestion complète du Daara Re-Creation\\n(02-23 Août 2025)\\n\\nDéveloppé avec Electron.js'
                        });
                    }
                },
                {
                    label: 'Guide d\'utilisation',
                    click: () => {
                        // Ouvrir le guide d'utilisation
                        mainWindow.webContents.send('menu-action', 'show-help');
                    }
                }
            ]
        }
    ];

    // Ajustements pour macOS
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about', label: 'À propos de ' + app.getName() },
                { type: 'separator' },
                { role: 'services', label: 'Services' },
                { type: 'separator' },
                { role: 'hide', label: 'Masquer ' + app.getName() },
                { role: 'hideothers', label: 'Masquer les autres' },
                { role: 'unhide', label: 'Tout afficher' },
                { type: 'separator' },
                { role: 'quit', label: 'Quitter ' + app.getName() }
            ]
        });

        // Fenêtre menu pour macOS
        template[5].submenu = [
            { role: 'close', label: 'Fermer la fenêtre' },
            { role: 'minimize', label: 'Réduire' },
            { role: 'zoom', label: 'Zoom' },
            { type: 'separator' },
            { role: 'front', label: 'Tout ramener au premier plan' }
        ];
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Gestionnaires IPC pour la communication avec le renderer
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
    return app.getAppPath();
});

ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
});

ipcMain.handle('write-file', async (event, filePath, data) => {
    try {
        fs.writeFileSync(filePath, data);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('read-file', async (event, filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
    console.error('Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesse rejetée non gérée:', reason);
});

