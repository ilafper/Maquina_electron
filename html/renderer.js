
let api_ur = 'https://api-maquina-electron.vercel.app/api';

$(function () {

    let dineroIntroducido = 0;
    let cambio;
    let lista_productos = [];

    $('.delete').on('click', function () {
        $('.cuadromensaje').html('');

    });
    async function cargaProductosNormales() {

        try {
            const response = await fetch(`${api_ur}/productos`, {
                method: 'GET',

                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log("soy tonto");

            let contanierProductos = $('.lista_products');
            contanierProductos.empty();

            const productos = await response.json();
            lista_productos=productos
            console.log(lista_productos);

            
            for (let cada_producto of productos) {

                let targetaProductos = `
                <div class="producto" data-id="${cada_producto._id}">
                    <div class="imagen">
                        <img src="../src/${cada_producto.src}" alt="">
                    </div>
                    <div class="producto-info">
                        <h3>${cada_producto.nombreProducto}</h3>
                    </div>
                    
                    <p class="valorr">${cada_producto.valor}</p>
                </div>`

                contanierProductos.append(targetaProductos);

            }

            //console.log("lista productos normal:", contanierProductos.length);




        } catch (error) {
            console.error('Error:', error);

        }

    }

    cargaProductosNormales();

    
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



        
        let dinero_numero = parseFloat(valorDinero);
        dinero_numero = parseFloat(dinero_numero.toFixed(3));
        dineroIntroducido.toFixed(3);
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

        //dineroIntroducido.toFixed(2);
        console.log('Dinero Metido:', dineroIntroducido.toFixed(2));
        
        $('.cuadromensaje').html(dineroIntroducido.toFixed(2) + " €");

    });

    //boton producto maquina
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
        }

        console.log('Buscando:', valorBuscar);
        console.log(lista_productos);
        
        let encontrado = false;

        for (let i = 0; i < lista_productos.length; i++) {
            if (valorBuscar == lista_productos[i].valor) {
                console.log("encontrado");
                $('.cuadromensaje').html(lista_productos[i].precio + " €");

                console.log("metiste: ", dineroIntroducido);
                console.log("precio Producto", lista_productos[i].precio);

                if (dineroIntroducido == 0) {
                    console.log("por favor mete una cantidad mayor a 0");
                } else if (dineroIntroducido < lista_productos[i].precio) {
                    console.log("mete mas dinero");
                    $('.cuadromensaje').html("mete mas dinero");
                } else if (dineroIntroducido >= lista_productos[i].precio) {
                    let cambio = dineroIntroducido - lista_productos[i].precio;
                    $('.cuadromensaje').html(cambio.toFixed(2) + "€");
                    console.log(cambio);

                    setTimeout(() => {
                        cambio = 0;
                        dineroIntroducido = 0;
                        $('.cuadromensaje').html('0 €');
                        console.log(cambio);
                    }, 3000);
                }

                encontrado = true;
                break;
            }
        }

        if (!encontrado) {
            $('.cuadromensaje').html('no encontrado');
            setTimeout(() => {
                        $('.cuadromensaje').html('');
                        
                    }, 2000);
        }
    });




    //Modo admin
    console.log("adasdasdasdasdasdasda", api_ur);

    async function cargarProductosAdmin() {

        try {

            const response = await fetch(`${api_ur}/productos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            //console.log("soy tonto");
            
            let contenedorProductos = $('.lista_admin');

            contenedorProductos.empty();
            const productos = await response.json();

            for (let cada_producto of productos) {

                let targetaProductos = `
                 <div class="productoAdmin" data-id="${cada_producto._id}">
                    <div class="imagenPrin">
                         <img src="../src/${cada_producto.src}" alt="">
                    </div>
                    
                    <div class="productoInformacion">
                        <h3>${cada_producto.nombreProducto}</h3>
                    </div>

                    <p class="valorr">${cada_producto.valor}</p>

                    <div class="botones">

                        <button data-id="${cada_producto._id}" class="editarBtn"><img src="../imagenes/editar.svg" alt=""></button>
                        <button data-id="${cada_producto._id}" class="basuraTrash"><img class="botonTrash" src="../imagenes/basura.svg" alt=""></button>

                    </div>


                 </div>`
                
                
                
                 contenedorProductos.append(targetaProductos);

            }

        } catch (error) {
            console.error('Error:', error);

        }

    }

    cargarProductosAdmin();

    $('.btnCancelar').on('click', function () {
       
        $('.modalCrear').css('display', 'none');
    });





    //mostrar modal de crear y eliminar
    $('.craerProducto').on('click', function () {
        console.log("sdfsdfs");
        
        $('.modalCrear').css('display', 'flex');
    });





    //crearProducto

    $('.crearProducto').on('click', function () {
        //console.log("sdfsdfs");
        
       let nuevoNombre= $('.nombreNuevo').val();

       let nuevoValor= $('.nuevoValor').val();

       let nuevoPrecio= $('.nuevoPrecio').val();

       let nuevoCantidad= $('.nuevacantidad').val();

       let imagenProduct="produc1.png";

       
        console.log(nuevoNombre,nuevoValor,nuevoPrecio,nuevoCantidad);
        
        if (nuevoNombre === '' || nuevoValor === '' || nuevoPrecio === '' || nuevoCantidad === '') {
            console.log("Por favor, rellena todos los campos");
            return;
        }

        let nuevoProducto= {
            nombreProducto:nuevoNombre,
            valor:nuevoValor,
            precio:nuevoPrecio,
            cantiad:nuevoCantidad,
            src:imagenProduct
        }
        
        console.log("A enviar:", nuevoProducto);
        

        fetch(`${api_ur}/crearproducto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProducto)
        })

        .then(response => response.json())
        .then(data => {
            console.log('Éxito:', data);
            $('.modalCrear').css('display', 'none');
            cargarProductosAdmin();
        })
        .catch(error => {
            console.error('Error:', error);
        });

    });



    /*borrar modal*/
    $(document).on('click', '.basuraTrash', function () {
        console.log("basura basura");
        let idEliminarProducto=$(this).data('id');
        console.log(idEliminarProducto);
        $('.modalEliminar').data('id', idEliminarProducto);
        $('.idProduct').html(idEliminarProducto)
        $('.modalEliminar').css('display', 'flex');
        
    });


    $(document).on('click', '.cancelarEliminar', function () {
        console.log("basura cancelar");
        $('.modalEliminar').css('display', 'none');
    });


    /*aceptar la eliminacion*/
    $(document).on('click', '.confirmarEliminar', function () {
        console.log("confirm confirm");
        
        let idEliminarProducto = $('.modalEliminar').data('id');
        
        console.log("id a eliminar:", idEliminarProducto);
        

        fetch(`${api_ur}/delete/${idEliminarProducto}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        .then(response => response.json())
        
        .then(data => {
            console.log('Éxito:', data);
            $('.modalEliminar').css('display', 'none');

            cargarProductosAdmin();
        })
        .catch(error => {
            console.error('Error:', error);
        });
       
    });









});









