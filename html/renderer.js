
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

            console.log("lista productos normal:", contanierProductos.length);




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



        //aaaasdasdasd
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
        } else {

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

                if (dineroIntroducido == 0) {
                    console.log("por favor mete una cantidad mayor a 0")

                } else if (dineroIntroducido < lista_productos[i].precio && dineroIntroducido > 0) {
                    console.log("mete mas dinero");

                } else if (dineroIntroducido > lista_productos[i].precio) {
                    cambio = dineroIntroducido - lista_productos[i].precio;
                    console.log("hfhfhffh");
                    $('.cuadromensaje').html("Cambio " + cambio + "€");
                    console.log(cambio);

                }



            }
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
                        <img src="../imagenes/editar.svg" alt="">
                        <img src="../imagenes/basura.svg" alt="">
                    </div>


                 </div>`

                contenedorProductos.append(targetaProductos);

            }

            console.log(contenedorProductos.length);




        } catch (error) {
            console.error('Error:', error);

        }

    }

    cargarProductosAdmin();



});









