const { OPEN_READWRITE, OPEN_CREATE, OPEN_FULLMUTEX } = require('sqlite3')
const Sequelize = require('sequelize');

class SQLite {

    constructor(connection, schema) {
        this._connection = connection
        this._schema = schema
    }

    static connect(database, username, password, storage, dialect) {
        const connection = new Sequelize(database, username, password, {
            dialect: dialect,
            storage: storage,
            dialectOptions: {
                mode: OPEN_READWRITE | OPEN_CREATE | OPEN_FULLMUTEX
            },
            logging: false
        })
        return connection
    }

    static async defineModel(connection, schema) {
        const model = connection.define(schema.name, schema.schema, schema.options);
        await model.sync();
        return model
    }

    async isConnected() {
        try {
            await this._connection.authenticate()
            return true;
        } catch (error) {
            console.error('Connect SQLite fail!', error)
            return false;
        }
    }

    async create(item) {
        const { dataValues } = await this._schema.create(item)
        return dataValues
    }

    async retrieve(query = {}) {
        return this._schema.findAll({ where: query, raw: true })
    }

    async update(item) {
        return this._schema.update(item, { where: { id: item.id } })
    }

    async delete(id) {
        const query = id ? { id } : {}
        return this._schema.destroy({ where: query })
    }

}

module.exports = SQLite
