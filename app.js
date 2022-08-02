//Verificación de contenido en el LS
let personas = JSON.parse(localStorage.getItem('personas')) ?? [];
let personasEliminadas = JSON.parse(localStorage.getItem('eliminados')) ?? [];

//Obj personasEditar premitirá guardar el id del objeto a editar
let personasEditar = {};

//Editando será la bandera que permitirá saber si estoy editando o registrando un objeto
let editando = false;

//Hacemos la iteración de la tabla y las cards si hay algo en el LS
listar();
listarCards();

/**
 * Función que permite registrar una persona
 * @param {string} nombre 
 * @param {string} cedula 
 * @param {string} fechanacimiento 
 */
function registrar(nombre, cedula, fechanacimiento) {
    //Creamos un objeto cliente con un id dinámico para evitar errores en tiempo de ejecución
    const objetoCliente = {
        id: Date.now().toString(36)+Math.random().toString(36).substring(2),
        nombre,
        cedula,
        fechanacimiento
    };

    //Insertamos la persona registrada en el arreglo
    personas.push(objetoCliente);
}

/**
 * Función que permite calcular la edad con base en el año ingresado por el usuario
 * Una vez calculada, añadimos la propiedad edad en cada objetoCliente que exista en el arreglo
 * Retornamos el arreglo de personas actualizado
 * @returns personas
 */
function calcularEdad() {
    //Recorremos el arr de personas y en cada objeto almacenado, añadimos la prop. edad calculada
    for (let i = 0; i < personas.length; i++) {
        /**
         * El formato de la fecha con datepicker es "aaaa-mm-dd", con split separando los elementos por guiones "-" 
         * Devolvemos un arr ["aaaa", "mm", "dd"], finalmente extraemos aaaa convertido en entero
         */
        personas[i].edad = new Date().getFullYear() - Number(personas[i].fechanacimiento.split("-", 1));
    }

    //Actualizamos el LS de personas
    actualizarLsPersonas(personas);

    return personas;
}

/**
 * Función para actualizar el LS con key "personas"
 * @param {arr} persona 
 */
function actualizarLsPersonas(persona) {
    localStorage.setItem('personas', JSON.stringify(persona));
}

/**
 * Función para actualizar el LS con key "eliminados"
 * @param {arr} persona (personasEliminadas) 
 */
function actualizarLsEliminados(persona) {
    localStorage.setItem('eliminados', JSON.stringify(persona));
}

/**
 * Función que permite editar a un objetoPersona según su id
 * @param {string} id 
 */
function editar(id) {
    //Buscamos el objetoPersona a editar
    const personaEditar = personas.find((persona) => {
        return persona.id === id;
    });

    //Activamos la bandera para saber si estamos editando o registrando
    editando = true;

    //Retornamos al formulario los valores del objetoPersona encontrado por el find
    document.querySelector("#nombre").value = personaEditar.nombre;
    document.querySelector("#cedula").value = personaEditar.cedula;
    document.querySelector("#nacimiento").value = personaEditar.fechanacimiento;

    //Guardamos el id en el objeto personasEditar para no perder la referencia
    personasEditar.id = id;

    //Cambiamos el texto del botón del formulario de Guardar a Editar
    document.querySelector('button[type="submit"]').textContent = "Editar";
}

/**
 * Función que permite eliminar un objetoPersona del arreglo según su id
 * @param {string} id 
 */
function eliminar(id) {
    //Buscamos el objetoPersona a eliminar según su id
    const personaEliminada = personas.find((persona) => {
        return persona.id === id;
    });

    //Filtramos los elementos que no coincidan con el id a eliminar
    const personasActualizado = personas.filter((persona) => {
        return persona.id !== id;
    });

    //Pedimos confirmación al usuario de la acción a realizar
    const confirmar = confirm("¿Está seguro que desea eliminar la entrada?");

    //Si hay acción de confirmación, eliminamos el objeto seleccionado
    if (confirmar) {
        //Añadimos el objetoPersona eliminado al arreglo de eliminados
        personasEliminadas.push(personaEliminada);
        //Actualizamos el LS de las personas eliminadas
        actualizarLsEliminados(personasEliminadas);

        //Actualizamos el arreglo de personas con los elementos que no han sido eliminados
        personas = personasActualizado;
        //Actualizamos el LS de las personas registradas
        actualizarLsPersonas(personas);

        //Refrescamos el DOM para que actualice la tabla y las cards
        listar();
        listarCards();
    }
}

/**
 * Función que genera el cuerpo de la tabla y lo añade en el DOM
 */
function listar() {
    let cuerpoTabla = ``;

    //Recorremos el arreglo personas y se generan tantas entradas como objetosPersona existan en el arreglo
    for (let i = 0; i < personas.length; i++) {
        cuerpoTabla += `
        <tr>
            <td>${personas[i].nombre}</td>
            <td>${personas[i].cedula}</td>
            <td>${personas[i].fechanacimiento}</td>
            <td>${personas[i].edad}</td>
            <td>
                <button type="button" onclick="editar('${personas[i].id}')">Editar</button>
                <button type="button" onclick="eliminar('${personas[i].id}')">Eliminar</button>
            </td>
        </tr>
        `;
    }

    //Insertamos el cuerpo de la tabla con los datos encontrados en el DOM con id=tabla
    document.getElementById("tabla").innerHTML = cuerpoTabla;
}

/**
 * Función que genera las cards para listar los elementos eliminados
 */
function listarCards() {
    let card = ``;

    //Recorremos el arreglo de personasEliminadas y se generarán tantas cards como objetosEliminados existan
    for (let i = 0; i < personasEliminadas.length; i++) {
        card += `
        <div class="card">
            <div class="container">
                <h4><b>Nombre: ${personasEliminadas[i].nombre}</b></h4>
                <p>Cedula: ${personasEliminadas[i].cedula}</p>
                <p>Edad: ${personasEliminadas[i].edad}</p>
            </div>
        </div>
        `;
    }

    //Insertamos en el div con id=carta las cards generadas
    document.getElementById("carta").innerHTML = card;
}

/**
 * Añadimos el evento submit al formulario
 */
document.getElementById("formulario").addEventListener('submit', function (e) {
    //Evitamos la recarga del formulario
    e.preventDefault();

    //Obtenemos los valores que estén dentro de los campos del formulario
    const nombre = document.querySelector("#nombre").value;
    const cedula = document.querySelector("#cedula").value;
    const fechanacimiento = document.querySelector("#nacimiento").value;

    //Validamos que los campos no estén vacíos
    if ([nombre, cedula, fechanacimiento].includes("")) {
        alert("Todos los campos son obligatorios");
        return;
    }

    //Si la bandera editando es true, editamos un objeto presente en el arreglo
    if (editando) {
        personas.map((persona) => {
            if (persona.id === personasEditar.id) {
                persona.nombre = nombre;
                persona.cedula = cedula;
                persona.fechanacimiento = fechanacimiento;

                return persona;
            }
        });

        calcularEdad();
        listar();
        editando = false; //Una vez editado el elemento, apagamos la bandera
        document.getElementById("formulario").reset(); //Reiniciamos el form para que se limpien los campos
        document.querySelector('button[type="submit"]').textContent = "Guardar"; //Cambiamos el texto del botón del formulario de Editar a Guardar
        alert("Actualizado");
    } else { //Si editando es false, estamos registrando a una nueva persona, igualmente se valida que cédula no esté ya registrada
        if (!personas.some((persona) => persona.cedula === cedula)) {
            registrar(nombre, cedula, fechanacimiento);
            calcularEdad();
            listar();
            document.getElementById("formulario").reset(); //Reiniciamos el form para que se limpien los campos
            alert("Registrado con éxito");
        } else {
            alert("Persona ya existe"); //Si la cédula ya está registrada, no se guardará
        }
    }

});


