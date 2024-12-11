//Importar el archivo de app para inicar el servidor con la bd de mysql
import { createApp } from "./app.js";

//Importar el modelo de personaje
import { personajeModel } from './models/mysql/personajes.js'

createApp({ PersonajeModel: personajeModel })