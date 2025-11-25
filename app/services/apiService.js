const axios = require('axios');

const API_BASE_URL = 'http://api-maquina-electron.vercel.app/'; 

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Obtener todos los productos
  async getProductos() {
    try {
      const response = await this.api.get('/api/productos');
      console.log(response);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al obtener productos' 
      };
    }
  }

  // Crear producto
  async createProducto(productoData) {
    try {
      const response = await this.api.post('/api/crearproducto', productoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al crear producto' 
      };
    }
  }

  // Actualizar producto
  async updateProducto(id, updateData) {
    try {
      const response = await this.api.put(`/api/actuproducto/${id}`, updateData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al actualizar producto' 
      };
    }
  }

  // Eliminar producto
  async deleteProducto(id) {
    try {
      const response = await this.api.delete(`/api/delete/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al eliminar producto' 
      };
    }
  }
}

module.exports = new ApiService();