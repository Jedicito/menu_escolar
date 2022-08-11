const express = require('express');
const app = express();
require('dotenv').config();

app.listen(3000, () => console.log("Servidor levantado en htttp://localhost:3000"));

app.use(express.json());

app.get("/", (req, res) => {

});