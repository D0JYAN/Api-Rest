import { personajeModel } from "../models/personaje.js"

//Importar el esquema de validacion de datos
import { validacionPersonaje, validacionParcialPersonaje } from '../schemas/personajes.js'

export class personajeController {
    static async getAll(req, res) {
        const { occupation } = req.query
        const personajes = await personajeModel.getAll({ occupation })

        res.json(personajes)
    }

    static async getById(req, res) {
        const { id } = req.params
        const personaje = await personajeModel.getById({ id })
        if (personaje) {
            res.json(personaje)
        } else {
            res.status(404).json({ error: 'Personaje no encontrado' })
        }
    }

    static async create(req, res) {
        const resultado = validacionPersonaje(req.body)
        if (resultado.error) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) })
        }
        const nuevoPersonaje = await personajeModel.create({ input: resultado.data })
        res.status(201).json(nuevoPersonaje)//El 201 es el correcto para indicar que se ha creado un nnuevo recurso
    }

    static async delete(req, res) {
        const { id } = req.params
        const resultado = await personajeModel.delete({ id })

        if (resultado == false) {
            return res.status(404).json({ message: 'Personaje no encontrado' })
        }
        return res.json({ message: 'Personaje eliminado' })
    }

    static async update(req, res) {
        const resultado = validacionParcialPersonaje(req.body)
        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) })
        }
        const { id } = req.params

        const actualizarPersonaje = await personajeModel.update({ id, input: resultado.data })

        return res.json(actualizarPersonaje)
    }
}