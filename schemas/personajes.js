//Importar zod para validacion de datos
const z = require('zod')

//Validacion de datos con zod en tiempo de ejecución
const esquemaPersonaje = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un texto',
        required_error: 'El nombre del personaje es obligatorio'
    }),
    birthday: z.string({
        invalid_type_error: 'La fecha de nacimiento debe ser una fecha valida, ejemplo: 01 de enero',
        required_error: 'La fecha de nacimiento es obligatoria'
    }),
    age: z.number().int().min(1).max(99),
    height: z.number().int().min(100).max(250),
    eye_color: z.string({
        invalid_type_error: 'El color de ojos debe ser un texto',
        required_error: 'El color de ojos del personaje es obligatorio'
    }),
    hair_color: z.string({
        invalid_type_error: 'El color de cabello debe ser un texto',
        required_error: 'El color de cabello del personaje es obligatorio'
    }),
    occupation: z.enum(['estudiante', 'actor', 'actriz', 'empleado', 'científico'], {
        invalid_type_error: 'La ocupación debe ser un texto válido: estudiante, actor, actriz, empleado, científico',
        required_error: 'La ocupación del personaje es obligatoria',
    })
})

function validacionPersonaje(object) {
    return esquemaPersonaje.safeParse(object)
}

module.exports = validacionPersonaje