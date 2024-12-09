//Importar express
const express = require('express')
//Crear una instancia de express
const app = express()
//Importar y utilizar el json con los datos de personajes
const personajes = require('./personajes.json')
//Importar la libreria de crypto
const crypto = require('node:crypto')
//Importar CORS
const cors = require('cors')
//Importar el esquema de validacion de datos
const validacionPersonaje = require('./schemas/personajes')
const validacionParcialPersonaje = require('./schemas/personajes')
//Middlewares
app.disable('x-powered-by')//Desactivar el header x-powered-by: Express
app.use(express.json())//Acceder a la informacon enviada por el usuario
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

//Todos los recurso que sean personajes se recuperan con /personajes
app.get('/personajes', (req, res) => {
    const { occupation } = req.query
    if (occupation) {
        const filtrarPersonaje = personajes.filter(personaje =>
            typeof personaje.occupation === 'string' &&
            personaje.occupation.toLowerCase() === occupation.toLowerCase()
        )
        return res.json(filtrarPersonaje)
    }
    res.json(personajes)
})
//Todos los recursos por id
app.get('/personajes/:id', (req, res) => {
    const {id} = req.params
    const personaje = personajes.find(personaje => personaje.id == id)
    if (personaje) {
        res.json(personaje)
    } else {
        res.status(404).json({error: 'Personaje no encontrado'})
    }
})
//Crear un nuevo personaje
app.post('/personajes', (req, res) => {
    const resultado = validacionPersonaje(req.body)
    if (resultado.error) {
        return res.status(400).json({error: JSON.parse(resultado.error.message)})
    }
    const nuevoPersonaje = {
        id: crypto.randomUUID(),//Universal Unique ID
        ...resultado.data//Solo se usa este metodo si todo ya fue validado
    }
    //Esto no es res por que se guarda el estado de al app en memoria
    personajes.push(nuevoPersonaje)
    res.status(201).json(nuevoPersonaje)//El 201 es el correcto para indicar que se ha creado un nnuevo recurso
})
//Actualizar un personaje
app.patch('/personajes/:id', (req, res) => {
    const resultado = validacionParcialPersonaje(req.body)
    if(!resultado.success) {
        return res.status(400).json({error: JSON.parse(resultado.error.message)})
    }
    const {id} = req.params

    const personajeIndex = personajes.findIndex(personaje => personaje.id == id)

    if (personajeIndex == -1) {
        return res.status(404).json({message: 'Personaje no encontrado'})
    }

    const actualizarPersonaje = {
        ...personajes[personajeIndex],
        ...resultado.data
    }

    personajes[personajeIndex] = actualizarPersonaje

    return res.json(actualizarPersonaje)
})
//Borrar un personaje
app.delete('/personajes/:id', (req, res) => {
    const {id} = req.params
    const personajeIndex = personajes.findIndex(personaje => personaje.id == id)

    if (personajeIndex == -1) {
        return res.status(404).json({message: 'Personaje no encontrado'})
    }

    personajes.splice(personajeIndex, 1)

    return res.json({ message: 'Personaje eliminado' })
})
//Puerto y levantamiento del mismo
const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto http://localhost:${PORT}`)
})