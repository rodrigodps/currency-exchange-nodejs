const logger = require("../log/logger")

class CurrencyService {

    constructor(exchangeService, db) {
        this._exchangeService = exchangeService
        this._db = db
    }

    async convert(userId, source, target, amount) {
        try {
            const ex = await this._exchangeService.exchange(source, target)
            const rate = ex.rates[target]
            const transaction = {
                userId: userId,
                sourceCurrency: source,
                sourceAmount: amount,
                targetCurrency: target,
                targetAmount: amount * rate,
                rate: rate,
                date: new Date()
            }
            const result = await this._db.create(transaction)
            return result
        } catch (error) {
            logger.error(`Fail in convert. Error: ${error}`)
            throw error
        }
    }

}

module.exports = CurrencyService
