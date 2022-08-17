const express = require('express');
const app = express();
require('dotenv').config(); // Para que funcione el archivo .env, que tiene la clave del pgsql
const cookieParser = require('cookie-parser'); // Para que lea las cookies. Necesita un app.use()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); /// Única y exclusivamente para encriptar la password
const { registrarUsuario, verificarUsuario,  buscarPedidosxUsuario } = require('./consultas.js');

app.listen(3000, () => console.log("Servidor levantado en http://localhost:3000"));

app.use(express.json());
app.use(cookieParser());
app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use("/js", express.static(`${__dirname}/views/js`));

app.get("/", (req, res) => {
    const token = req.cookies['menu_escolar_autentifica'];
    //console.log("token: ", token);
    let autenticado = false;
    let datos;
    if (typeof token != "undefined") {
        jwt.verify(token, process.env.JWT_LLAVE, (error, data) => {
            if (error) {
                console.log("jwt no autenticado");
                res.clearCookie('menu_escolar_autentifica');
            } else {
                //console.log("verify: ", data);
                autenticado = true
                datos = data;
                //console.log("nombre: ", datos.nombre);
            }
        })
    }

    //console.log("Autenticado: ", autenticado);
    if (!autenticado) {
        res.sendFile(`${__dirname}/views/login.html`);
    } else {
        res.sendFile(`${__dirname}/views/listado.html`);
    }
});

app.get("/login", async (req, res) => {
    res.sendFile(`${__dirname}/views/login.html`);
});

app.post("/logear", async (req, res) => {
    const { correo, clave } = req.body;
    //console.log("/logear req.body: ", req.body);
    
    let usuario_verificado = false;
    let nombre;

    try {
        const usuario = await verificarUsuario(correo);
        //console.log(usuario);
        id = usuario.rows[0].id;
        nombre = usuario.rows[0].nombre;
        if (usuario.rows.length > 0) {
            const clave_verificada = bcrypt.compareSync(clave, usuario.rows[0].clave)
            if (clave_verificada) {
                usuario_verificado = true
            } else {
                res.status(401).json("Contraseña incorrecta");
            }
        } else {
            res.status(418).json({'error': 'Correo no existe'});
        }
    } catch (error) {
        res.status(500).send(error);
    }

    if (usuario_verificado) {
       
        const token = jwt.sign({id, nombre, correo}, process.env.JWT_LLAVE);

        const valores_cookie = {
            token,
        };

        const opciones_cookie = {
            secure: false,
            httpOnly: true
        };

        res.cookie("menu_escolar_autentifica", 
                    token,
                    opciones_cookie          
        )

        res.json({codigo: 'Exito'});
    }

});


app.post("/registrar", async(req, res) => {
    //console.log("/registrar req.body: ", req.body);
    const { nombre, correo, clave } = req.body;
    const claveHash = bcrypt.hashSync(clave, 8);
    
    try {
        const resp = await registrarUsuario(nombre, correo, claveHash);
    } catch (error) {
        console.log("Error en /registrar: ", error);
        res.status(500).send(error);
    }
    
});

app.get("/listarpedidos", async (req, res) => {
    
    const autenticacion = await autenticacion_cookie(req);
    console.log(autenticacion);
    autenticado = autenticacion.autenticado;

    //console.log("Autenticado: ", autenticado);
    if (!autenticado) {
        console.log("/listarpedidos No Autenticado");
        //res.sendFile(`${__dirname}/views/login.html`);
        res.send("no autenticado");
    } else {
        console.log("/listarpedidos Autenticado");
        //res.sendFile(`${__dirname}/views/listado.html`);
        res.json(autenticacion);
    };
});

const autenticacion_cookie = (req) => {
    const token = req.cookies['menu_escolar_autentifica'];
    //console.log("token: ", token);
    let autenticado = false;
    let datos;
    if (typeof token != "undefined") {
        jwt.verify(token, process.env.JWT_LLAVE, (error, data) => {
            if (error) {
                console.log("jwt no autenticado");
                res.clearCookie('menu_escolar_autentifica');
            } else {
                //console.log("verify: ", data);
                autenticado = true
                datos = data;
                //console.log("nombre: ", datos.nombre);
            };
        });
    };

    retorno_json = {
        autenticado,
        nombre: datos.nombre,
        correo: datos.correo
    };

    return retorno_json;
}