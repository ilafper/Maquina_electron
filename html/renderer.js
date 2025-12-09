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

        console.log('Datos del producto:', productoData);

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


$(function () {

    let dineroIntroducido = 0;

    let cambio;
    
    $('.delete').on('click', function () {
        $('.cuadromensaje').html('');

    });

    //input de meter dinero

    $('.dineroMeter').on('click', function () {
        // valor
        const valorDinero = $(this).data('value');
        console.log(valorDinero);
        
        $('.dineroIntroducido').val('');
        console.log(valorDinero);
        
        if (!valorDinero) {
            console.log("Introduce un valor");
            return;
        }
        //aaaasdasdasd
        let dinero_numero = parseFloat(valorDinero);
        dinero_numero = parseFloat(dinero_numero.toFixed(3));
        
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
        //acuerdate del 0 ese 

        dineroIntroducido.toFixed(2);
        console.log('Dinero Metido:', dineroIntroducido);
        console.log("sdfsdfsd", dineroIntroducido);
        

        
        $('.cuadromensaje').html(dineroIntroducido + " €" );

    });

    //bootn producto maquina
    $('.teclaMaquina').on('click', function () {
        const valorTecla = $(this).data('value');
        console.log(valorTecla);
        $('.cuadromensaje').html($('.cuadromensaje').html() + valorTecla);
    });

    $('.acept').on('click', function () {
        const valorBuscar = $('.cuadromensaje').html().trim();
        if (valorBuscar == '') {
            console.log("introduce algo a buscar");
            return;
        }else{
            
        }
        
        console.log('Buscando:', valorBuscar);

        console.log(lista_productos);

        
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














