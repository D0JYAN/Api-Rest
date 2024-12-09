//Importar router de express
import { Router } from 'express'

//Importar el modelo de personajes
import { personajeModel } from '../models/personaje.js'

export const personajesRouter = Router()

personajesRouter.get('/', personajeModel.getAll)

personajesRouter.post('/', personajeModel.create)

personajesRouter.get('/:id', personajeModel.getById)

personajesRouter.delete('/:id', personajeModel.delete)

personajesRouter.patch('/:id', personajeModel.update)