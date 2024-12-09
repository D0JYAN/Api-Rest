//Importar la libreria de crypto
import { randomUUID } from 'node:crypto'

//Importar router de express
import { Router } from 'express'
export const personajesRouter = Router()

//Importar el esquema de validacion de datos
import { validacionPersonaje, validacionParcialPersonaje } from '../schemas/personajes.js'

import { readJSON } from '../utils/readFilePersonajes.js'
//Importar y utilizar el json con los datos de personajes en ESModules
//Crear un require
const personajes = readJSON('../personajes.json')


personajesRouter.get('/', (req, res) => {
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

personajesRouter.get('/:id', (req, res) => {
    const {id} = req.params
    const personaje = personajes.find(personaje => personaje.id == id)
    if (personaje) {
        res.json(personaje)
    } else {
        res.status(404).json({error: 'Personaje no encontrado'})
    }
})

personajesRouter.post('/', (req, res) => {
    const resultado = validacionPersonaje(req.body)
    if (resultado.error) {
        return res.status(400).json({error: JSON.parse(resultado.error.message)})
    }
    const nuevoPersonaje = {
        id: randomUUID(),//Universal Unique ID
        ...resultado.data//Solo se usa este metodo si todo ya fue validado
    }
    //Esto no es res por que se guarda el estado de al app en memoria
    personajes.push(nuevoPersonaje)
    res.status(201).json(nuevoPersonaje)//El 201 es el correcto para indicar que se ha creado un nnuevo recurso
})

personajesRouter.delete('/:id', (req, res) => {
    const {id} = req.params
    const personajeIndex = personajes.findIndex(personaje => personaje.id == id)

    if (personajeIndex == -1) {
        return res.status(404).json({message: 'Personaje no encontrado'})
    }

    personajes.splice(personajeIndex, 1)

    return res.json({ message: 'Personaje eliminado' })
})

personajesRouter.patch('/:id', (req, res) => {
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