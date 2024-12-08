const express = require('express');
const app = express();

app.disable('x-powered-by');//Desactivar el header x-powered-by: Express

app.get('/', (req, res) => {
    res.send('Hola Mundo!');
})

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto http://localhost:${PORT}`);
})