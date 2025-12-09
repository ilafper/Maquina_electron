const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, 
      contextIsolation: true,
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'html/index.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    //console.log('Ventana cargada correctamente');
  });

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  //console.log(App lista - creando ventana...');
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

console.log('Main.js cargado correctamente');