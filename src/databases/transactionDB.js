const SQLite = require('./sqlite')
const TransactionSchema = require('./schemas/transactionSchema')

class TransactionDB {

    constructor() {
        this._connection = null
        this._database = null
    }

    async create(item) {
        return await this._database.create(item)
    }

    async findByUserId(userId) {
        return await this._database.retrieve({ userId })
    }

    async update(item) {
        return await this._database.update(item)
    }

    async delete(id) {
        return await this._database.delete(id)
    }

    async connect() {
        this._connection = SQLite.connect(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_STORAGE, process.env.DB_DIALECT)
        const model = await SQLite.defineModel(this._connection, TransactionSchema)
        this._database = new SQLite(this._connection, model)
    }

    async isConnected() {
        return await this._database.isConnected()
    }

    disconnect() {
        this._connection.disconnect()
    }

}

module.exports = TransactionDB
