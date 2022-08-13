const express = require('express');
const app = express();
require('dotenv').config();
const cp = require('cookie-parser');
const { v4:uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

app.listen(3000, () => console.log("Servidor levantado en htttp://localhost:3000"));

app.use(express.json());
app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist`));

app.get("/", (req, res) => {
    const autenticacion = req.cookies['menu_aut']
    if (condition) {
        
    } else {
        
    }

});

app.get("/login", async (req, res) => {
    res.sendFile(`${__dirname}/views/login.html`);
});