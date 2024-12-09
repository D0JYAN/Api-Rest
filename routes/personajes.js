//Importar la libreria de crypto
import { randomUUID } from 'node:crypto'

//Importar router de express
import { Router } from 'express'
export const personajesRouter = Router()

//Importar el esquema de validacion de datos
import { validacionPersonaje, validacionParcialPersonaje } from '../schemas/personajes.js'

import { readJSON } from '../utils/readFilePersonajes.js'
import { personajeModel } from '../models/personaje.js'
//Importar y utilizar el json con los datos de personajes en ESModules
//Crear un require
const personajes = readJSON('../personajes.json')


personajesRouter.get('/', async (req, res) => {
    const { occupation } = req.query
    const personajes = await personajeModel.getAll({ occupation })
    res.json(personajes)
})

personajesRouter.get('/:id', async (req, res) => {
    const {id} = req.params
    const personaje = await personajeModel.getById({ id })
    if (personaje) {
        res.json(personaje)
    } else {
        res.status(404).json({error: 'Personaje no encontrado'})
    }
})

personajesRouter.post('/', async (req, res) => {
    const resultado = validacionPersonaje(req.body)
    if (resultado.error) {
        return res.status(400).json({error: JSON.parse(resultado.error.message)})
    }
    const nuevoPersonaje = await personajeModel.create({ input: resultado.data })
    res.status(201).json(nuevoPersonaje)//El 201 es el correcto para indicar que se ha creado un nnuevo recurso
})

personajesRouter.delete('/:id', async (req, res) => {
    const {id} = req.params
    const resultado = await personajeModel.delete({ id })

    if (resultado== false) {
        return res.status(404).json({message: 'Personaje no encontrado'})
    }
    return res.json({ message: 'Personaje eliminado' })
})

personajesRouter.patch('/:id', async (req, res) => {
    const resultado = validacionParcialPersonaje(req.body)
    if(!resultado.success) {
        return res.status(400).json({error: JSON.parse(resultado.error.message)})
    }
    const {id} = req.params

    const actualizarPersonaje = await personajeModel.update({ id, input: resultado.data})
    
    return res.json(actualizarPersonaje)
})