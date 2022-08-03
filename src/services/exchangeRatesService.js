const IExchangeService = require('./interfaceExchangeService')
const { get } = require('axios')
const logger = require('../log/logger')

class ExchangeRatesService extends IExchangeService {

    async exchange(source, target) {
        try {
            const config = {
                headers: {
                    apikey: 'HJ0JAiAqmPlcCwkWRVdeKNFCG54eTirB'
                }
            }
            const url = `https://api.apilayer.com/exchangerates_data/latest?symbols=${target}&base=${source}`
            const response = await get(url, config)
            return response.data
        } catch (error) {
            logger.error(`Error in request exchange api. Error: ${error}`)
            throw error
        }
    }

}

module.exports = ExchangeRatesService
