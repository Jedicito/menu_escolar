const express = require('express');
const app = express();
require('dotenv').config();

app.listen(3000, () => console.log("Servidor levantado en htttp://localhost:3000"));

app.use(express.json());
app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist`));

app.get("/", (req, res) => {
    res.json();
});

app.get("/login", async (req, res) => {
    res.sendFile(`${__dirname}/views/login.html`);
});