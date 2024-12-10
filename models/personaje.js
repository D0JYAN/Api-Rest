//Importar la libreria de crypto
import { randomUUID } from 'node:crypto'

import { readJSON } from '../utils.js'
//Importar y utilizar el json con los datos de personajes en ESModules
//Crear un require
const personajes = readJSON('./personajes.json')

export class personajeModel {
    static async getAll({ occupation }) {
        if (occupation) {
            return personajes.filter(personaje =>
                typeof personaje.occupation === 'string' &&
                personaje.occupation.toLowerCase() === occupation.toLowerCase()
            )
        }
        return personajes
    }

    static async getById({ id }) {
        const personaje = personajes.find(personaje => personaje.id == id)
        return personaje
    }

    static async create({ input }) {
        const nuevoPersonaje = {
            id: randomUUID(),//Universal Unique ID
            ...input//Solo se usa este metodo si todo ya fue validado
        }
        personajes.push(nuevoPersonaje)

        return nuevoPersonaje
    }

    static async delete({ id }) {
        const personajeIndex = personajes.findIndex(personaje => personaje.id == id)
        if (personajeIndex == -1) return false
        personajes.splice(personajeIndex, 1)
        return true
    }

    static async update({ id, input }) {
        const personajeIndex = personajes.findIndex(personaje => personaje.id == id)
        if (personajeIndex == -1) return false
        personajes[personajeIndex] = {
            ...personajes[personajeIndex],
            ...input
        }
        return personajes[personajeIndex]
    }
}