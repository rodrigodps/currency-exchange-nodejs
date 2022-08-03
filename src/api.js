const Hapi = require('@hapi/hapi')
const Joi = require('joi')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')
const HapiSwagger = require('hapi-swagger')

const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const logger = require('./log/logger')

const env = process.env.NODE_ENV || 'test'
ok(env === 'prod' || env === 'dev' || env === 'test', 'Invalid node env. Valid options are test, dev or prod')

const configPath = join(__dirname, '../config', `${env}.env`)
config({
    path: configPath
})


const CurrencyRoutes = require('./routes/currencyRoutes')
const TransactionDB = require('./databases/transactionDB')
const CurrencyService = require('./services/currencyService')

const TransactionRoutes = require('./routes/transactionRoutes')
const TransactionService = require('./services/transactionService')

const MockExchangeService = require('./services/mockExchangeService')
const ExchangeRatesService = require('./services/exchangeRatesService')

const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    logger.info('Starting Server')
    const transactionDB = new TransactionDB()
    try {
        await transactionDB.connect()
    } catch (error) {
        logger.error(`Error try connect to DB. Error: ${error}`)
    }

    const exchangeService = (env === 'test') ? new MockExchangeService() : new ExchangeRatesService()

    const swaggerOptions = {
        info: {
            title: 'API Currency Exchange',
            version: 'v' + process.env.VERSION
        }
    }
    await app.register([
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])
    app.validator(Joi);
    app.route([
        ...mapRoutes(new CurrencyRoutes(new CurrencyService(exchangeService, transactionDB)), CurrencyRoutes.methods()),
        ...mapRoutes(new TransactionRoutes(new TransactionService(transactionDB)), TransactionRoutes.methods())
    ])
    await app.start()
    logger.info(`Server is online on port`, app.info.port, `[Mode=${env}]`)
    return app
}

module.exports = main()
