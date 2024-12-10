import mysql, { createConnection } from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database:'personajesdb'
}

const connection = await mysql.createConnection(config)



export class personajeModel {
    static async getAll({ occupation }) {
        const [ personajes, tablaInfo ] = await connection.query(
            'SELECT * FROM personaje;'
        )
        console.log(tablaInfo)
        return personajes
    }

    static async getById({ id }) {
        
    }

    static async create({ input }) {
        
    }

    static async delete({ id }) {
        
    }

    static async update({ id, input }) {
        
    }
}