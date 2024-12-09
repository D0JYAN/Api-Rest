//Importar CORS
import cors from 'cors'

//Array de origenes permitidos
const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://192.168.1.80:8080',
    'https://localhost:3000'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors(
    {
        origin: (origin, callback) => {
            //Rutas aceptadas
            
            if (acceptedOrigins.includes(origin)) {
                return callback(null, true)
            }
            if (!origin) {
                return callback(null, true)
            }
            return callback(new Error('Sin permisos de CORS'))
        }
    }
)