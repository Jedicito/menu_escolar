const login_correo = document.getElementById("login_correo");
const login_clave = document.getElementById("login_clave");
const login_enviar = document.getElementById("login_enviar");
const registro_nombre = document.getElementById("registro_nombre");
const registro_correo = document.getElementById("registro_correo");
const registro_clave = document.getElementById("registro_clave");
const registro_clave2 = document.getElementById("registro_clave2");
const registro_enviar = document.getElementById("registro_enviar");
const registro_validador = document.getElementById("registro_validador");

registro_enviar.addEventListener('click', async(e) => {
    e.preventDefault();
    registro_validador.innerHTML = "";

    const nombre = registro_nombre.value;
    const correo = registro_correo.value;
    const clave = registro_clave.value;
    const clave2 = registro_clave2.value;

    let correcto = true
    if (nombre == "") {
        correcto = false
        registro_validador.innerText = "Falta el Nombre"
    };

    if (correo == "") {
        correcto = false;
        registro_validador.innerText = "Falta el Correo"
    };

    if (clave == "") {
        correcto = false;
        registro_validador.innerText = "Falta una Contraseña";
    }

    if(clave !== clave2) {
        correcto = false;
        registro_validador.innerText = "Contraseñas no coinciden";
    }

    if (correcto) {
        try {
            console.log("nombre: ", nombre);
            const registro = await registrarUsuario(nombre, correo, clave);    
        } catch (error) {
            console.log(error);
            registro_validador.innerText = "Ocurrió un error inesperado. Revise la consola";    
        }
    }

});

const  registrarUsuario = (nombre, correo, clave) => {
    console.log("registrarUsuario nombre: ", nombre)

    const fd = {
        nombre: nombre,
        correo: correo,
        clave: clave
    };

    try {
        const registro = fetch("/registrar", {
            method: "POST",
            body: JSON.stringify(fd),
            headers: {"Content-Type" : "Application/json" }
        })
        .then(res => res.json())
        .catch(error => console.log('Error en registro: ', error))
        .then(resp => resp);
    
        return registro;    
    } catch (error) {
        return error;
    }

}