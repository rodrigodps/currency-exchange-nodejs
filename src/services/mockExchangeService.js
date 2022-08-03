const IExchangeService = require('./interfaceExchangeService')

class MockExchangeService extends IExchangeService {

    async exchange(source, target) {
        const d = new Date().getTime()
        return {
            success: true,
            timestamp: d,
            base: source,
            date: d,
            rates: JSON.parse(`{ "${target}": 5.0 }`)
        }
    }

}

module.exports = MockExchangeService
