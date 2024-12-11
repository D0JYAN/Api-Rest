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
            //Crear el personaje
            await connection.query(
                'INSERT INTO personaje (id, name, birthday, age, height, eye_color, hair_color, image_url) VALUES (?,?,?,?,?,?,?,?);',
                [id, name, birthday, age, height, eye_color, hair_color, image_url]
            );
            //Verificar si la ocupación existe
            let [occupation] = await connection.query(
                'SELECT id FROM occupation WHERE name = ?;',
                [occupationInput]
            );
            let occupationId;
            if (occupation.length === 0) {
                //Si no existe, insertar la ocupación
                const resultado = await connection.query(
                    'INSERT INTO occupation (name) VALUES (?);',
                    [occupationInput]
                );
                occupationId = resultado[0].insertId //Obtener el ID de la ocupación recién creada
            } else {
                occupationId = occupation[0].id //Obtener el ID de la ocupación existente
            }
            //Crear la relación en la tabla personaje_occupation
            await connection.query(
                'INSERT INTO personaje_occupation (personaje_id, occupation_id) VALUES (?,?);',
                [id, occupationId]
            );
            //Retornar el personaje creado con su ocupación
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
                WHERE p.id = ?;`,
                [id]
            )
            return personajes[0]
        } catch (error) {
            throw new Error("Error al crear un nuevo personaje con ocupación");
        }
    }

    static async delete({ id }) {
        try {
            //Eliminar la relación del personaje con la ocupación (si existe)
            await connection.query('DELETE FROM personaje_occupation WHERE personaje_id = ?', [id]);
            //Eliminar el personaje de la tabla `personaje`
            const result = await connection.query('DELETE FROM personaje WHERE id = ?', [id]);
            //Si no se afectaron filas, el personaje no se encontró
            if (result.affectedRows === 0) {
                return null;  // No se encontró el personaje
            }
            //Devolver la lista de personajes restantes
            const [personajes] = await connection.query('SELECT * FROM personaje;');
            return personajes;
        } catch (error) {
            throw new Error("Error al eliminar el personaje");
        }
    }

    static async update({ id, input }) {
        const {
            occupation: occupationInput,
            name,
            birthday,
            age,
            height,
            eye_color,
            hair_color,
            image_url
        } = input;

        const updateFields = [];
        const updateValues = [];

        // Verificar qué campos están presentes en la solicitud y agregar esos valores
        if (name) {
            updateFields.push("name = ?");
            updateValues.push(name);
        }
        if (birthday) {
            updateFields.push("birthday = ?");
            updateValues.push(birthday);
        }
        if (age) {
            updateFields.push("age = ?");
            updateValues.push(age);
        }
        if (height) {
            updateFields.push("height = ?");
            updateValues.push(height);
        }
        if (eye_color) {
            updateFields.push("eye_color = ?");
            updateValues.push(eye_color);
        }
        if (hair_color) {
            updateFields.push("hair_color = ?");
            updateValues.push(hair_color);
        }
        if (image_url) {
            updateFields.push("image_url = ?");
            updateValues.push(image_url);
        }

        // Si se incluye una ocupación, procesarla también
        if (occupationInput) {
            // Verificar si la ocupación ya existe
            let [occupation] = await connection.query(
                'SELECT id FROM occupation WHERE name = ?;',
                [occupationInput]
            );

            let occupationId;
            if (occupation.length === 0) {
                // Si no existe, insertar la ocupación
                const result = await connection.query(
                    'INSERT INTO occupation (name) VALUES (?);',
                    [occupationInput]
                );
                occupationId = result[0].insertId; // Obtener el ID de la ocupación recién creada
            } else {
                occupationId = occupation[0].id; // Obtener el ID de la ocupación existente
            }

            // 3. Actualizar la relación en la tabla personaje_occupation
            await connection.query(
                'DELETE FROM personaje_occupation WHERE personaje_id = ?;',
                [id] // Eliminar la relación anterior
            );

            await connection.query(
                'INSERT INTO personaje_occupation (personaje_id, occupation_id) VALUES (?,?);',
                [id, occupationId] // Insertar la nueva relación
            );
        }

        // Si no hay campos para actualizar, retornamos un error
        if (updateFields.length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        // Construir la consulta de actualización
        const query = `
            UPDATE personaje 
            SET ${updateFields.join(", ")} 
            WHERE id = ?;
        `;
        updateValues.push(id); // Agregar el ID al final de los valores

        // Ejecutar la consulta
        await connection.query(query, updateValues);

        // Obtener el personaje actualizado
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
            WHERE p.id = ?;`,
            [id]
        );

        return personajes[0];
    }
}