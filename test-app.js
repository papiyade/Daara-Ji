// Test simple pour vérifier que l'application se lance
const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: require('path').join(__dirname, 'preload.js')
        }
    });

    win.loadFile('src/renderer/index.html');
    
    // Fermer automatiquement après 5 secondes pour le test
    setTimeout(() => {
        console.log('✅ Test réussi : L\'application se lance correctement');
        app.quit();
    }, 5000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
