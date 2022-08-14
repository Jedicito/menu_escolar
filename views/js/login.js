const login_correo = document.getElementById("login_correo");
const login_clave = document.getElementById("login_clave");
const login_enviar = document.getElementById("login_enviar");
const registro_nombre = document.getElementById("registro_nombre");
const registro_correo = document.getElementById("registro_correo");
const registro_clave = document.getElementById("registro_clave");
const registro_clave2 = document.getElementById("registro_clave2");
const registro_enviar = document.getElementById("registro_enviar");

registro_enviar.addEventListener('click', async(e) => {
    e.preventDefault();

    const nombre = registro_nombre.value;
    const correo = registro_correo.value;
    const clave = registro_clave.value;

    const registro = await registrarUsuario(nombre, correo, clave);

})