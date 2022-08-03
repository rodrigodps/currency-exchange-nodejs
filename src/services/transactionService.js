const logger = require('../log/logger')

class TransactionService {

    constructor(db) {
        this._db = db
    }

    async list(userId) {
        try {
            const result = await this._db.findByUserId(userId)
            return result
        } catch (error) {
            logger.error(`Fail find transactions. Error: ${error}`)
            throw error
        }
    }

}

module.exports = TransactionService
