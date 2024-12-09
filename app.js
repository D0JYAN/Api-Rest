//Importar express
import express, { json } from 'express'
//Crear una instancia de express
const app = express()
//Importar CORS
import cors from 'cors'
//Importar el router de personajes
import { personajesRouter } from './routes/personajes.js'
//Middlewares
app.disable('x-powered-by')//Desactivar el header x-powered-by: Express
app.use(json())//Acceder a la informacon enviada por el usuario
app.use(cors(
    {
        origin: (origin, callback) => {
            //Rutas aceptadas
            const ACCEPTED_ORIGINS = [
                'http://localhost:8080',
                'http://192.168.1.80:8080',
                'https://localhost:3000'
            ]
            if (ACCEPTED_ORIGINS.includes(origin)) {
                return callback(null, true)
            }
            if (!origin) {
                return callback(null, true)
            }
            return callback(new Error('Sin permisos de CORS'))
        }
    }
))//Solucionar problemas con CORS

app.use('/personajes', personajesRouter)//Se cargan todas las rutas de personajes

//Puerto y levantamiento del servidor

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto http://localhost:${PORT}`)
})