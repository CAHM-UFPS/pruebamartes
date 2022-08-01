let personas = JSON.parse(localStorage.getItem('personas')) ?? [];
let personasEditar = {};
let personasEliminadas = JSON.parse(localStorage.getItem('eliminados')) ?? [];
listar();
listarCards();

let i = 0;

function registrar(nombre, cedula, fechanacimiento) {
    const objetoCliente = {
        id: i++,
        nombre,
        cedula,
        fechanacimiento
    };

    personas.push(objetoCliente);
}

function calcularEdad() {
    for (let i = 0; i < personas.length; i++) {
        personas[i].edad = new Date().getFullYear() - Number(personas[i].fechanacimiento.split("-", 1));
    }

    actualizarLsPersonas(personas);

    return personas;
}

function actualizarLsPersonas(persona) {
    localStorage.setItem('personas', JSON.stringify(persona));
}

function actualizarLsEliminados(persona){
    localStorage.setItem('eliminados', JSON.stringify(persona));
}

function editar(id){
    const personaEditar=personas.find((persona)=>{
        return persona.id===id;
    });
    
    document.querySelector("#nombre").value=personaEditar.nombre;
    document.querySelector("#cedula").value=personaEditar.cedula;
    document.querySelector("#nacimiento").value=personaEditar.fechanacimiento;
}

function eliminar(id) {
    const personaEliminada = personas.find((persona) => {
        return persona.id === id;
    });

    personasEliminadas.push(personaEliminada);
    actualizarLsEliminados(personasEliminadas);

    const personasActualizado = personas.filter((persona) => {
        return persona.id !== id;
    });

    const confirmar = confirm("¿Está seguro que desea eliminar la entrada?");

    if (confirmar) {
        personas = personasActualizado;
        actualizarLsPersonas(personas);
        listar();
        listarCards();
    }
}

function listar() {
    let cuerpoTabla = ``;

    for (let i = 0; i < personas.length; i++) {
        cuerpoTabla += `
        <tr>
            <td>${personas[i].nombre}</td>
            <td>${personas[i].cedula}</td>
            <td>${personas[i].fechanacimiento}</td>
            <td>${personas[i].edad}</td>
            <td>
                <button type="button" onclick="editar(${personas[i].id})">Editar</button>
                <button type="button" onclick="eliminar(${personas[i].id})">Eliminar</button>
            </td>
        </tr>
        `;
    }

    document.getElementById("tabla").innerHTML = cuerpoTabla;
}

function listarCards() {
    let card = ``;

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

    document.getElementById("carta").innerHTML = card;
}

document.getElementById("formulario").addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.querySelector("#nombre").value;
    const cedula = document.querySelector("#cedula").value;
    const fechanacimiento = document.querySelector("#nacimiento").value;

    if ([nombre, cedula, fechanacimiento].includes("")) {
        alert("Todos los campos son obligatorios");
        return;
    }

    if (!personas.some((persona) => persona.cedula === cedula)) {
        registrar(nombre, cedula, fechanacimiento);
        calcularEdad();
        listar();
        alert("Registrado con éxito");
    } else {
        alert("Persona ya existe");
    }
});

