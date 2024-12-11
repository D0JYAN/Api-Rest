//Importar el esquema de validacion de datos
import { validacionPersonaje, validacionParcialPersonaje } from '../schemas/personajes.js'

export class personajeController {
    constructor({ PersonajeModel }) {
        this.PersonajeModel = PersonajeModel
    }
    getAll = async (req, res) => {
        const { occupation } = req.query
        const personajes = await this.PersonajeModel.getAll({ occupation })

        res.json(personajes)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const personaje = await this.PersonajeModel.getById({ id })
        if (personaje) {
            res.json(personaje)
        } else {
            res.status(404).json({ error: 'Personaje no encontrado' })
        }
    }

    create = async (req, res) => {
        const resultado = validacionPersonaje(req.body)
        if (resultado.error) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) })
        }
        const nuevoPersonaje = await this.PersonajeModel.create({ input: resultado.data })
        res.status(201).json(nuevoPersonaje)//El 201 es el correcto para indicar que se ha creado un nnuevo recurso
    }

    delete = async (req, res) => {
        const { id } = req.params
        const resultado = await this.PersonajeModel.delete({ id })

        if (resultado == false) {
            return res.status(404).json({ message: 'Personaje no encontrado' })
        }
        return res.json({ message: 'Personaje eliminado' })
    }

    update = async (req, res) => {
        const resultado = validacionParcialPersonaje(req.body)
        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) })
        }
        const { id } = req.params

        const actualizarPersonaje = await this.PersonajeModel.update({ id, input: resultado.data })

        return res.json(actualizarPersonaje)
    }
}