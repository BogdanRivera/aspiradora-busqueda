document.addEventListener('DOMContentLoaded', () => {
    const cuadriculaContainer = document.getElementById('tablero');
    const n_filas_columnas = 10;

    // Botones
    const generaBasuraBtn = document.getElementById('generar-basura');
    const iniciaAspiradoraBtn = document.getElementById('inicia-aspiradora');

    // Crear la cuadrícula 
    for (let i = 0; i < n_filas_columnas**2; i++) {
        const celda = document.createElement('div');
        celda.classList.add('elemento-celda');
        cuadriculaContainer.appendChild(celda);
    }

    // Para la aspiradora
    const celdas = document.querySelectorAll('.elemento-celda');
    let posicionAspiradora = 6 * n_filas_columnas + 6;  // posición en el centro

    // Se añade la imagen de la aspiradora
    const imgAspiradora = document.createElement('img');
    imgAspiradora.src = "./img/aspiradora.png";
    celdas[posicionAspiradora].appendChild(imgAspiradora);
    celdas[posicionAspiradora].classList.add('aspiradora');


    // Función para generar basura en posiciones aleatorias
    function generarBasuraAleatoria() {
        celdas.forEach(celda => {
            if (!celda.classList.contains('aspiradora')) {
                celda.classList.remove('basura');
                const basuraImg = celda.querySelector('img');
                if (basuraImg && basuraImg.src.includes('basura.png')) {
                    basuraImg.remove();
                }
            }
        });

        const cantidadBasura = Math.floor(Math.random() * 11) + 5; // entre 5 y 15
        let posicionesBasura = new Set();

        while (posicionesBasura.size < cantidadBasura) {
            let posicionAleatoria;

            do {
                posicionAleatoria = Math.floor(Math.random() * celdas.length);
            } while (posicionAleatoria === posicionAspiradora || posicionesBasura.has(posicionAleatoria));

            posicionesBasura.add(posicionAleatoria);

            const imgBasura = document.createElement('img');
            imgBasura.src = "./img/basura.png";
            celdas[posicionAleatoria].appendChild(imgBasura);
            celdas[posicionAleatoria].classList.add('basura');
        }
    }

    // Función para mover la aspiradora
    function moverAspiradora() {
        generaBasuraBtn.disabled = true; 
        const direcciones = [-1, 1, -n_filas_columnas, n_filas_columnas]; // izquierda, derecha, arriba, abajo
        let direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
        let nuevaPosicion = posicionAspiradora + direccion;


        if (nuevaPosicion >= 0 && nuevaPosicion < celdas.length &&
            !(direccion === -1 && posicionAspiradora % n_filas_columnas === 0) && // Limites del borde a la izquierda
            !(direccion === 1 && (posicionAspiradora + 1) % n_filas_columnas === 0)) { // Limites del borde a la derecha

            // Elimina la imagen de la posición actual de la aspiradora
            celdas[posicionAspiradora].querySelector('img').remove();
            celdas[posicionAspiradora].classList.remove('aspiradora');

            // Actualizar la posición de la aspiradora
            posicionAspiradora = nuevaPosicion;

            // Recolección de basura
            if (celdas[posicionAspiradora].classList.contains('basura')) {
                celdas[posicionAspiradora].classList.remove('basura');
                const basuraImg = celdas[posicionAspiradora].querySelector('img');
                if (basuraImg) {
                    basuraImg.remove(); // Elimina la imagen de basura
                }
            }

            // Mover la aspiradora a la nueva posición
            celdas[posicionAspiradora].classList.add('aspiradora');
            celdas[posicionAspiradora].appendChild(imgAspiradora);

            // Comprobar si queda basura
            if (!document.querySelector('.basura')) {
                alert('¡Ya no hay basura!');
                clearInterval(movimientoInterval);
                generaBasuraBtn.disabled = false;
            }
        }
    }


    generaBasuraBtn.addEventListener('click', generarBasuraAleatoria);

    // Iniciar el movimiento de la aspiradora
    let movimientoInterval;
    iniciaAspiradoraBtn.addEventListener('click', () => {
        if (movimientoInterval) clearInterval(movimientoInterval); // Evita multiples intervalos
        movimientoInterval = setInterval(moverAspiradora, 500); // Mover la aspiradora cada 500 ms
    });
});
