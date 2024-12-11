//Importar router de express
import { Router } from 'express'
//Importar el controlador
import { personajeController } from '../controllers/personajes.js'

export const createPersonajeRoute = ({ PersonajeModel }) => {
    const personajesRouter = Router()
    
    const PersonajeController = new personajeController({ PersonajeModel })

    personajesRouter.get('/', PersonajeController.getAll)

    personajesRouter.post('/', PersonajeController.create)

    personajesRouter.get('/:id', PersonajeController.getById)

    personajesRouter.delete('/:id', PersonajeController.delete)

    personajesRouter.patch('/:id', PersonajeController.update)

    return personajesRouter
}