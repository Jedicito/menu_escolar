const { Pool } = require('pg');

const pool = new Pool ({
    host: process.env.PG_HOST,
    database: "menu_escolar",
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASS
});

const registrarUsuario = (nombre, correo, clave) => {
    try {
        const config = {
            text: "Insert into escuelas (nombre, correo, clave) values ($1, $2, $3) returning *;",
            values: [nombre, correo, clave]
        };
        const resp = pool.query(config);
        return resp
    } catch (error) {
        console.log("Error registrarUsuario: ", error);
        return error;
    };
};

module.exports = { registrarUsuario }