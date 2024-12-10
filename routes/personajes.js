//Importar router de express
import { Router } from 'express'

//Importar el controlador
import { personajeController } from '../controllers/personajes.js'

export const personajesRouter = Router()

personajesRouter.get('/', personajeController.getAll)

personajesRouter.post('/', personajeController.create)

personajesRouter.get('/:id', personajeController.getById)

personajesRouter.delete('/:id', personajeController.delete)

personajesRouter.patch('/:id', personajeController.update)