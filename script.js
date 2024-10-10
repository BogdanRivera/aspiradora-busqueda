document.addEventListener('DOMContentLoaded', () => {
    const cuadriculaContainer = document.getElementById('tablero');

    // Crear la cuadrícula de 12x12
    for (let i = 0; i < 12 * 12; i++) {
        const celda = document.createElement('div');
        celda.classList.add('elemento-celda');
        cuadriculaContainer.appendChild(celda);
    }

    // Para la aspiradora
    const celdas = document.querySelectorAll('.elemento-celda');
    console.log(celdas.length); //Imprime el total de las celdas
    const posicionAspiradora = 6 * 12 + 6;  // posición en el centro

    const imgAspiradora = document.createElement('img');
    imgAspiradora.src = "aspiradora.png";  
    celdas[posicionAspiradora].appendChild(imgAspiradora);
    celdas[posicionAspiradora].classList.add('aspiradora');

    // Botones
    const generaBasuraBtn = document.getElementById('generar-basura');
    const iniciaAspiradora = document.getElementById('inicia-aspiradora');


    function generarBasuraAleatoria() {
        // Limpiar basura anterior
        celdas.forEach(celda => {
            //No se elimina la aspiradora
            if (!celda.classList.contains('aspiradora')) {
                celda.classList.remove('basura');
                const basuraImg = celda.querySelector('img');
                if (basuraImg && basuraImg.src.includes('basura.png')) {
                    basuraImg.remove();
                }
            }
        });

        const cantidadBasura = Math.floor(Math.random() * 15) + 3; // entre 3 y 18
        let posicionesBasura = new Set(); // Para evitar basuras sobrepuestas

        while (posicionesBasura.size < cantidadBasura) {
            let posicionAleatoria;

            do {
                posicionAleatoria = Math.floor(Math.random() * celdas.length);
            } while (posicionAleatoria === posicionAspiradora || posicionesBasura.has(posicionAleatoria));

            posicionesBasura.add(posicionAleatoria);

            const imgBasura = document.createElement('img');
            imgBasura.src = "basura.png";  
            celdas[posicionAleatoria].appendChild(imgBasura);
            celdas[posicionAleatoria].classList.add('basura');
        }
    }

    generaBasuraBtn.addEventListener('click', generarBasuraAleatoria);
});
