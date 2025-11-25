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
      preload: path.join(__dirname, 'preload.js')
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


const apiService = require('./app/services/apiService');

// IPC Handlers
ipcMain.handle('productos:getAll', async () => {
  console.log('todos los productos');
  //console.log(apiService.getProductos);
  return await apiService.getProductos();
});

ipcMain.handle('productos:create', async (event, productoData) => {
  //console.log('crear', productoData);
  return await apiService.createProducto(productoData);
});

ipcMain.handle('productos:update', async (event, id, updateData) => {
  //console.log('IPC: Actualizando producto...', id);
  return await apiService.updateProducto(id, updateData);
});

ipcMain.handle('productos:delete', async (event, id) => {
  //console.log('IPC: Eliminando producto...', id);
  return await apiService.deleteProducto(id);
});

app.whenReady().then(() => {
  //console.log('🚀 App lista - creando ventana...');
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

console.log('Main.js cargado correctamente');