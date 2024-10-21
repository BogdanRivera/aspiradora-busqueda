document.addEventListener('DOMContentLoaded', () => {
    const cuadriculaContainer = document.getElementById('tablero');
    const n_filas_columnas = 10;

    let basuraRecogida = 0;
    let tiempoInicio; 
    let tiempoActual; 
    let intervaloTiempo; 

    function iniciarTemporizador() {
        tiempoInicio = Date.now();  // Obtener el tiempo de inicio
        intervaloTiempo = setInterval(() => {
            tiempoActual = Math.floor((Date.now() - tiempoInicio) / 1000);  // Tiempo transcurrido en segundos
            document.getElementById('temporizador').textContent = `Tiempo: ${tiempoActual} segundos`;
        }, 1000);  // Actualizar cada segundo
    }

    function detenerTemporizador() {
        clearInterval(intervaloTiempo);  // Detener el intervalo
    }
    



    // Botones y parrafos
    const generaBasuraBtn = document.getElementById('generar-basura');
    const iniciaAspiradoraBtn = document.getElementById('inicia-aspiradora');
    const reiniciaAspiradoraBtn = document.getElementById('reinicia-aspiradora'); 
    const seleccionarAlgoritmoBtn = document.getElementById('seleccion-algoritmo');
    const algoritmoSelect = document.querySelector('.form-control');
    const parrafoGeneracionBasura = document.getElementById('algoritmoSeleccionado');
    


    let algoritmoElegido = 'algoritmo1'; 
    seleccionarAlgoritmoBtn.addEventListener('click', ()=>{
        algoritmoElegido = algoritmoSelect.value;
        switch(algoritmoElegido){
            case 'algoritmo1':
                parrafoGeneracionBasura.textContent = "Algoritmo seleccionado: Random"; 
                break;
            case 'algoritmo2':
                parrafoGeneracionBasura.textContent = "Algoritmo seleccionado: Búsqueda en anchura"; 
                break;
        }
    })

    



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

    function movRandom(){
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
                    // Actualiza el contador
                    basuraRecogida++;
                    document.getElementById('contadorBasura').textContent = `Basura recogida: ${basuraRecogida}`;
                }
            }

            // Mover la aspiradora a la nueva posición
            celdas[posicionAspiradora].classList.add('aspiradora');
            celdas[posicionAspiradora].appendChild(imgAspiradora);

            // Comprobar si queda basura
            if (!document.querySelector('.basura')) {
                alert('¡Ya no hay basura!');
                clearInterval(movimientoInterval);
                detenerTemporizador();  // Detener el temporizador
                generaBasuraBtn.disabled = false;
                seleccionarAlgoritmoBtn.disabled = false; 
            }
        }
    }

    function movBFS() {
        let queue = [[posicionAspiradora]];  // Cola con los caminos posibles
        let visitados = new Set([posicionAspiradora]);  // Celdas visitadas
        const direcciones = [-1, 1, -n_filas_columnas, n_filas_columnas];  // Izquierda, derecha, arriba, abajo
    

        while (queue.length > 0) {
            let path = queue.shift();  
            let actualPosicion = path[path.length - 1];  
    
            
            if (celdas[actualPosicion].classList.contains('basura')) {
                moverAspiradoraPasoAPaso(path);
                return;  
            }
    
            for (let dir of direcciones) {
                let nuevaPosicion = actualPosicion + dir;
    

                if (nuevaPosicion >= 0 && nuevaPosicion < celdas.length &&
                    !(dir === -1 && actualPosicion % n_filas_columnas === 0) &&  
                    !(dir === 1 && (actualPosicion + 1) % n_filas_columnas === 0) &&  
                    !visitados.has(nuevaPosicion)) {
    
                    visitados.add(nuevaPosicion);  
                    queue.push([...path, nuevaPosicion]);
                }
            }
        }
    }
    

    function moverAspiradoraPasoAPaso(path, index = 0) {
        if (index >= path.length) {
            if (!document.querySelector('.basura')) {
                alert('¡Ya no hay basura!');
                detenerTemporizador();  
                generaBasuraBtn.disabled = false;
                seleccionarAlgoritmoBtn.disabled = false;
                clearInterval(movimientoInterval);  
            }
            return;  
        }
    
        if (index > 0) {
            celdas[path[index - 1]].querySelector('img').remove();  
            celdas[path[index - 1]].classList.remove('aspiradora');
        }
    
        posicionAspiradora = path[index];  
        celdas[posicionAspiradora].appendChild(imgAspiradora);  
        celdas[posicionAspiradora].classList.add('aspiradora');
    
        
        if (celdas[posicionAspiradora].classList.contains('basura')) {
            celdas[posicionAspiradora].classList.remove('basura');
            const basuraImg = celdas[posicionAspiradora].querySelector('img');
            if (basuraImg) {
                basuraImg.remove();  
    
                
                basuraRecogida++;
                document.getElementById('contadorBasura').textContent = `Basura recogida: ${basuraRecogida}`;
            }
        }
    
        setTimeout(() => moverAspiradoraPasoAPaso(path, index + 1), 500);  // Delay de 500ms entre cada movimiento
    }
    
    

    function moverAspiradora() {
        generaBasuraBtn.disabled = true; 
        seleccionarAlgoritmoBtn.disabled = true; 
        switch (algoritmoElegido) {
            case 'algoritmo1':
                movRandom(); 
                console.log("Movimiento aleatorio corriendo");
                break;
            case 'algoritmo2':
                movBFS(); 
                console.log("Búsqueda en anchura corriendo");
                break;
            default:
                console.error('Algoritmo no implementado');
        }
    }
    


    generaBasuraBtn.addEventListener('click', generarBasuraAleatoria);

    // Iniciar el movimiento de la aspiradora
    let movimientoInterval;
    iniciaAspiradoraBtn.addEventListener('click', () => {
        if (movimientoInterval) clearInterval(movimientoInterval); // Evita multiples intervalos
        movimientoInterval = setInterval(moverAspiradora, 500); // Mover la aspiradora cada 500 ms
        iniciarTemporizador();  // Iniciar el temporizador
    });


    // Función para reiniciar el tablero
    function reiniciarTablero() {

        detenerTemporizador();  // Detener el temporizador en caso de que siga corriendo
        document.getElementById('temporizador').textContent = 'Tiempo: 0 segundos';  // Reiniciar la pantalla del temporizador

        // Detener el intervalo del movimiento
        clearInterval(movimientoInterval);
        seleccionarAlgoritmoBtn.disabled = false; 
        // Actualiza el contador
        basuraRecogida = 0;
        document.getElementById('contadorBasura').textContent = `Basura recogida: ${basuraRecogida}`;
    // Limpiar cualquier basura y restablecer el tablero
    celdas.forEach(celda => {
        celda.classList.remove('basura', 'aspiradora');
        const img = celda.querySelector('img');
        if (img) img.remove();
    });

    // Colocar la aspiradora nuevamente en el centro
    posicionAspiradora = 6 * n_filas_columnas + 6;  // Volver a la posición central
    const imgAspiradoraNueva = document.createElement('img');
    imgAspiradoraNueva.src = "./img/aspiradora.png";
    celdas[posicionAspiradora].appendChild(imgAspiradoraNueva);
    celdas[posicionAspiradora].classList.add('aspiradora');

    // Habilitar el botón de generar basura
    generaBasuraBtn.disabled = false;
}

    // Asignar la función al botón de reiniciar
    reiniciaAspiradoraBtn.addEventListener('click', reiniciarTablero);
});


