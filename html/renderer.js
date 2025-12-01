let lista_productos = [];
class ProductoManager {
    constructor() {
        //console.log('Iniciando ProductoManager...');
        //console.log('window.electronAPI:', window.electronAPI);

        // VALIDACIÓN CRÍTICA
        if (!window.electronAPI) {
            //this.showCriticalError('Electron API no está disponible. El preload.js no se cargó correctamente.');
            return;
        }

        this.init();
    }

    async init() {
        //console.log('🚀 Inicializando aplicación...');
        this.setupEventListeners();
        await this.loadProductos();
    }

    async loadProductos() {
        //console.log('Cargando productos...');
        try {
            // Doble validación
            if (!window.electronAPI || !window.electronAPI.getProductos) {
                throw new Error('La API de Electron no está disponible');
            }

            const result = await window.electronAPI.getProductos();
            const productosList = document.getElementById('productosList');

            if (result.success) {
                console.log('Productos cargados:', result.data.length);
                this.displayProductos(result.data);
            } else {
                console.error('Error cargando productos:', result.error);
                productosList.innerHTML = `
                    <div class="error-message">
                        <p>Error: ${result.error}</p>
                        
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error en loadProductos:', error);
            this.showError(`Error de conexión: ${error.message}`);
        }
    }

    displayProductos(productos) {
        const productosList = document.getElementById('productosList');

        if (!productos || productos.length === 0) {
            productosList.innerHTML = '<p class="no-data">No hay productos registrados</p>';
            return;
        }
        lista_productos = productos;
        productosList.innerHTML = productos.map(producto => `
            <div class="producto" data-id="${producto._id}">
                <div class="imagen">
                     <img src="../src/${producto.src}" alt="">
                </div>
                <div class="producto-info">
                    <h3>${producto.nombreProducto}</h3>
                </div>
                <p class="valorr">${producto.valor}</p>
            </div>
        `).join('');
    }

    setupEventListeners() {
        const form = document.getElementById('productoForm');
        const refreshBtn = document.getElementById('refreshBtn');

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            console.log(' Event listener del formulario configurado');
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadProductos());
            console.log('Event listener del botón actualizar configurado');
        }
    }



    async handleSubmit(e) {

        e.preventDefault();

        console.log('Enviando formulario...');

        // Validar que la API esté disponible
        if (!window.electronAPI || !window.electronAPI.createProducto) {
            this.showError('La API de Electron no está disponible');
            return;
        }

        const productoData = {
            nombre: document.getElementById('nombre').value,
            precio: parseFloat(document.getElementById('precio').value),
            stock: parseInt(document.getElementById('stock').value),
            descripcion: document.getElementById('descripcion').value
        };

        console.log('📦 Datos del producto:', productoData);

        try {
            const result = await window.electronAPI.createProducto(productoData);

            if (result.success) {
                this.showMessage('Producto creado exitosamente', 'success');
                document.getElementById('productoForm').reset();
                await this.loadProductos();
            } else {
                this.showMessage(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            this.showMessage(`Error de conexión: ${error.message}`, 'error');
        }
    }

    async deleteProducto(productoId) {
        console.log('Eliminando producto:', productoId);

        if (!window.electronAPI || !window.electronAPI.deleteProducto) {
            this.showError('La API de Electron no está disponible');
            return;
        }

        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                const result = await window.electronAPI.deleteProducto(productoId);

                if (result.success) {
                    this.showMessage('Producto eliminado exitosamente', 'success');
                    await this.loadProductos();
                } else {
                    this.showMessage(`Error: ${result.error}`, 'error');
                }
            } catch (error) {
                this.showMessage(`Error de conexión: ${error.message}`, 'error');
            }
        }
    }

    showCriticalError(message) {
        console.error('Error crítico:', message);
        document.body.innerHTML = `
            <div style="padding: 20px; font-family: Arial, sans-serif; background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px;">
                <h1 style="color: #721c24;">❌ Error Crítico</h1>
                <p><strong>${message}</strong></p>
                <h3>Posibles causas:</h3>
                <ul>
                    <li>• El archivo preload.js no se está cargando</li>
                    <li>• contextIsolation no está habilitado</li>
                    <li>• nodeIntegration está habilitado (debe ser false)</li>
                    <li>• Hay un error en la configuración de Electron</li>
                </ul>
                <h3>Soluciones:</h3>
                <ul>
                    <li>• Verifica la consola de Electron (F12)</li>
                    <li>• Asegúrate de que preload.js esté en la raíz</li>
                    <li>• Recarga la aplicación (Ctrl+R)</li>
                    <li>• Revisa la configuración de webPreferences en main.js</li>
                </ul>
                <p><strong>Configuración requerida en main.js:</strong></p>
                <pre style="background: #f1f1f1; padding: 10px; border-radius: 3px;">
                webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
                }</pre>
            </div>
        `;
    }

    showError(message) {
        const productosList = document.getElementById('productosList');
        if (productosList) {
            productosList.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                </div>
            `;
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
        `;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}


//console.log('DOM cargado, verificando electronAPI...');
//console.log('window.electronAPI disponible:', !!window.electronAPI);
//console.log('Métodos disponibles:', window.electronAPI ? Object.keys(window.electronAPI) : 'NO DISPONIBLE');

if (window.electronAPI) {
    //console.log('Inicializando ProductoManager...');
    window.productoManager = new ProductoManager();
} else {
    console.error('NO se puede inicializar - electronAPI no disponible');
    document.body.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h1 style="color: red;">Error de Configuración</h1>
            <p>No se pudo conectar con Electron. Por favor revisa la consola (F12) para más detalles.</p>
            <button onclick="location.reload()" style="padding: 10px 20px; margin: 10px;">Recargar</button>
        </div>
    `;
}


//Funciones

$(function () {

    let dineroIntroducido = 0;
    let cambio;
    $('.delete').on('click', function () {

        $('.cuadromensaje').html('');
    });

    //input de meter dinero
    $('.dineroMeter').on('click', function () {
        // valor
        const valorDinero = $('.dineroIntroducido').val();
        $('.dineroIntroducido').val('');

        if (!valorDinero || valorDinero.trim() === '') {
            console.log("Introduce un valor");
            return;
        }

        let dinero_numero = parseInt(valorDinero);

        // CORREGIR: Sumar el NÚMERO, no el string
        dineroIntroducido += dinero_numero; 

        // Validar que sea un número válido
        if (isNaN(dinero_numero)) {
            console.log("Introduce un número válido");
            return;
        }

        if (dinero_numero <= 0) {
            console.log("Introduce una cantidad positiva");
            return;
        }

        console.log('ultimo introducido:', dinero_numero);
        console.log('Dinero Metido:', dineroIntroducido);


        $('.cuadromensaje').html(dineroIntroducido + " €" );
    });

    //bootn objeto maquina
    $('.teclaMaquina').on('click', function () {

        const valorTecla = $(this).data('value');
        console.log(valorTecla);

        $('.cuadromensaje').html($('.cuadromensaje').html() + valorTecla);

    });

    $('.acept').on('click', function () {
        const valorBuscar = $('.cuadromensaje').html().trim();
        console.log('Buscando:', valorBuscar);

        console.log(lista_productos);

        //console.log(typeof valorparseado);
        for (let i = 0; i < lista_productos.length; i++) {

            if (valorBuscar == lista_productos[i].valor) {
                console.log("encontrado");

                //console.log(lista_productos[i]);

                console.log(lista_productos[i].precio);
                $('.cuadromensaje').html(lista_productos[i].precio + " €");

                console.log("metiste: ", dineroIntroducido);
                console.log("precio Producto", lista_productos[i].precio);

                if (dineroIntroducido == 0 ) {
                    console.log("por favor mete una cantidad mayor a 0")

                }else if(dineroIntroducido < lista_productos[i].precio && dineroIntroducido > 0){
                    console.log("mete mas dinero");
                    
                }else if(dineroIntroducido > lista_productos[i].precio){
                    cambio = dineroIntroducido - lista_productos[i].precio;
                    console.log("hfhfhffh");
                    $('.cuadromensaje').html("Cambio "+ cambio + "€");
                    console.log(cambio);
                     
                }



            }
        }
    });



});














