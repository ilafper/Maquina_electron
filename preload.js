const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload.js se está ejecutando...');

// Verifica que ipcRenderer esté disponible
if (!ipcRenderer) {
  console.error('ipcRenderer no está disponible');
} else {
  console.log('ipcRenderer disponible');
}

try {
  // Exponer API de forma segura
  contextBridge.exposeInMainWorld('electronAPI', {
    getProductos: () => {
      //console.log('🔄 Preload: Llamando a getProductos...');
      return ipcRenderer.invoke('productos:getAll');
    },
    createProducto: (productoData) => {
      //console.log('🔄 Preload: Llamando a createProducto...', productoData);
      return ipcRenderer.invoke('productos:create', productoData);
    },
    updateProducto: (id, updateData) => {
      //console.log('🔄 Preload: Llamando a updateProducto...', id);
      return ipcRenderer.invoke('productos:update', id, updateData);
    },
    deleteProducto: (id) => {
      //console.log('🔄 Preload: Llamando a deleteProducto...', id);
      return ipcRenderer.invoke('productos:delete', id);
    }
  });

  console.log('✅ electronAPI expuesta correctamente al mundo del renderer');
  console.log('🔍 electronAPI methods:', Object.keys({
    getProductos: () => {},
    createProducto: () => {},
    updateProducto: () => {},
    deleteProducto: () => {}
  }));

} catch (error) {
  console.error('Error en preload.js:', error);
}