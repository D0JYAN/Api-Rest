//Importar express
const express = require('express')
//Crear una instancia de express
const app = express()
//Importar y utilizar el json con los datos de personajes
const personajes = require('./personajes.json')
//Importar la libreria de crypto
const crypto = require('node:crypto')
//Importar el esquema de validacion de datos
const validacionPersonaje = require('./schemas/personajes')
//Middlewares
app.disable('x-powered-by')//Desactivar el header x-powered-by: Express
app.use(express.json())//Acceder a la informacon enviada por el usuario

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
//Puerto y levantamiento del mismo
const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto http://localhost:${PORT}`)
})