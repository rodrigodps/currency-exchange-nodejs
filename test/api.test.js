const assert = require('assert')
const api = require('../src/api')

const MockExchangeService = require('../src/services/mockExchangeService')

const MOCK_SOURCE = {
    userId: 123,
    sourceCurrency: 'BRL',
    sourceAmount: 5.0,
    targetCurrency: 'USD'
}

let app
let exchangeService
describe('API Tests', function () {

    this.beforeAll(async () => {
        app = await api
        exchangeService = new MockExchangeService()
    })

    this.afterAll(async () => {
        await app.stop()
    })

    it('Convert test', async () => {
        const { rates } = await exchangeService.exchange(MOCK_SOURCE.sourceCurrency, MOCK_SOURCE.targetCurrency)
        const rateMock = rates[MOCK_SOURCE.targetCurrency]
        const expected = {
            ...MOCK_SOURCE,
            rate: rateMock,
            targetAmount: rateMock * MOCK_SOURCE.sourceAmount
        }

        const result = await app.inject({
            method: 'GET',
            url: `/convert?userId=${MOCK_SOURCE.userId}&source=${MOCK_SOURCE.sourceCurrency}&target=${MOCK_SOURCE.targetCurrency}&amount=${MOCK_SOURCE.sourceAmount}`
        })

        const status = result.statusCode
        assert.equal(status, 200)
        const { userId, sourceCurrency, sourceAmount, targetCurrency, targetAmount, rate } = JSON.parse(result.payload)
        assert.deepEqual({ userId, sourceCurrency, sourceAmount, targetCurrency, targetAmount, rate }, expected)
    })

    it('Convert test - no query', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/convert'
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

    it('Convert test - no userId', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/convert?source=${MOCK_SOURCE.sourceCurrency}&target=${MOCK_SOURCE.targetCurrency}&amount=${MOCK_SOURCE.sourceAmount}`
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

    it('Convert test - invalid userId', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/convert?userId=abc&source=${MOCK_SOURCE.sourceCurrency}&target=${MOCK_SOURCE.targetCurrency}&amount=${MOCK_SOURCE.sourceAmount}`
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

    it('Convert test - no source', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/convert?userId=${MOCK_SOURCE.userId}&target=${MOCK_SOURCE.targetCurrency}&amount=${MOCK_SOURCE.sourceAmount}`
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

    it('Convert test - invalid source', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/convert?userId=${MOCK_SOURCE.userId}&source=ABC&target=${MOCK_SOURCE.targetCurrency}&amount=${MOCK_SOURCE.sourceAmount}`
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

    it('Convert test - no target', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/convert?userId=${MOCK_SOURCE.userId}&source=${MOCK_SOURCE.sourceCurrency}&amount=${MOCK_SOURCE.sourceAmount}`
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

    it('Convert test - invalid target', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/convert?userId=${MOCK_SOURCE.userId}&source=${MOCK_SOURCE.sourceCurrency}&target=ABC&amount=${MOCK_SOURCE.sourceAmount}`
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

    it('Convert test - no amount', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/convert?userId=${MOCK_SOURCE.userId}&source=${MOCK_SOURCE.sourceCurrency}&target=${MOCK_SOURCE.targetCurrency}`
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

    it('Convert test - invalid amount', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/convert?userId=${MOCK_SOURCE.userId}&source=${MOCK_SOURCE.sourceCurrency}&target=${MOCK_SOURCE.targetCurrency}&amount=abc`
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

    it('Transactions test', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/transactions?userId=${MOCK_SOURCE.userId}`
        })

        const status = result.statusCode
        assert.equal(status, 200)
        const payload = JSON.parse(result.payload)
        assert.ok(Array.isArray(payload))
    })

    it('Transactions test - no userId', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/transactions`
        })

        const status = result.statusCode
        assert.equal(status, 400)
    })

})
