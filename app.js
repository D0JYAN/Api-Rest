//Importar express
import express, { json } from 'express'
//Crear una instancia de express
const app = express()
//Importar el router de personajes
import { personajesRouter } from './routes/personajes.js'
//Importar el middleware que maneja las politicas de CORS
import { corsMiddleware } from './middlewares/cors.js'
//Middlewares
app.disable('x-powered-by')//Desactivar el header x-powered-by: Express
app.use(json())//Acceder a la informacon enviada por el usuario
app.use(corsMiddleware())//Solucionar problemas con CORS

app.use('/personajes', personajesRouter)//Se cargan todas las rutas de personajes

//Puerto y levantamiento del servidor

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto http://localhost:${PORT}`)
})