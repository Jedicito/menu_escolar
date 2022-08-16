const express = require('express');
const app = express();
require('dotenv').config(); // Para que funcione el archivo .env, que tiene la clave del pgsql
const cookieParser = require('cookie-parser'); // Para que lea las cookies. Necesita un app.use()
const { v4:uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registrarUsuario, verificarUsuario } = require('./consultas.js');

app.listen(3000, () => console.log("Servidor levantado en http://localhost:3000"));

app.use(express.json());
app.use(cookieParser());
app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use("/js", express.static(`${__dirname}/views/js`));

app.get("/", (req, res) => {
    const autenticacion = req.cookies['menu_escolar_autentifica'];

    if (typeof autenticacion !== "undefined") {
        res.send("autenticado");
    } else {
        res.sendFile(`${__dirname}/views/login.html`);
    }
});

app.get("/login", async (req, res) => {
    res.sendFile(`${__dirname}/views/login.html`);
});

app.post("/logear", async (req, res) => {
    const { correo, clave } = req.body;
    console.log("/logear req.body: ", req.body);
    

    let usuario_verificado = false;
    let nombre;

    try {
        const usuario = await verificarUsuario(correo);
        //console.log(usuario);
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
       
        const token = jwt.sign({nombre, correo}, process.env.JWT_LLAVE);

        const valores_cookie = {
            token,
        };

        const opciones_cookie = {
            secure: false,
            httpOnly: true
        };

        res.cookie("menu_escolar_autentifica", 
                    valores_cookie,
                    opciones_cookie          
        )

        res.json({codigo: 'Exito'});
    }


});


app.post("/registrar", async(req, res) => {
    console.log("/registrar req.body: ", req.body);
    const { nombre, correo, clave } = req.body;
    const claveHash = bcrypt.hashSync(clave, 8);
    
    try {
        const resp = await registrarUsuario(nombre, correo, claveHash);
    } catch (error) {
        console.log("Error en /registrar: ", error);
        res.status(500).send(error);
    }

    
});