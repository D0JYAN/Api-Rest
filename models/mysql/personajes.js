import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'personajesdb'
}

const connection = await mysql.createConnection(config)

export class personajeModel {
    static async getAll({ occupation }) {
        if (occupation) {
            const toLowerCase = occupation.toLowerCase()

            const [occupationRow] = await connection.query('SELECT id, name FROM occupation WHERE LOWER(name) = ?;', [toLowerCase])

            if (occupationRow.length === 0) return ["No existen personajes para esta ocupación"]

            const [{ id }] = occupationRow

            const [personajes] = await connection.query(
            `SELECT 
                p.id, 
                p.name, 
                p.birthday, 
                p.age, 
                p.height, 
                p.eye_color, 
                p.hair_color, 
                p.image_url, 
                o.name AS occupation
            FROM personaje p
            JOIN personaje_occupation po ON p.id = po.personaje_id
            JOIN occupation o ON po.occupation_id = o.id
            WHERE po.occupation_id = ?;`, [id]
            );

            return personajes
        }

        const [personajes, tablaInfo] = await connection.query(
            'SELECT * FROM personaje;'
        )
        console.log(tablaInfo)
        return personajes
    }

    static async getById({ id }) {
        const [personajes] = await connection.query(
            'SELECT * FROM personaje WHERE id=?;', [id]
        )

        if (personajes.length === 0) return null

        return personajes[0]
    }

    static async create({ input }) {
        const {
            occupation: occupationInput,
            name,
            birthday,
            age,
            height,
            eye_color,
            hair_color,
            image_url
        } = input

        const id = crypto.randomUUID()

        try {
            await connection.query(
                'INSERT INTO personaje (id, name, birthday, age, height, eye_color, hair_color, image_url) VALUES (?,?,?,?,?,?,?,?);',
                [id, name, birthday, age, height, eye_color, hair_color, image_url]
            )
        } catch (error) {
            throw new Error("Error al crear un nuevo personaje");
        }

        const personajes = await connection.query('SELECT * FROM personaje WHERE id = ?;', [id])

        return personajes[0]
    }

    static async delete({ id }) {


    }

    static async update({ id, input }) {

    }
}