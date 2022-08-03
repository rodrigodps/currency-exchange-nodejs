const BaseRoute = require('./baseRoute')
const Joi = require('joi')
const Boom = require('@hapi/boom')
const logger = require('../log/logger')

const failAction = (request, headers, error) => {
    throw error
}

class CurrencyRoutes extends BaseRoute {

    constructor(service) {
        super()
        this._service = service
    }

    convert() {
        return {
            path: '/convert',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Currency convert',
                validate: {
                    failAction,
                    query: {
                        userId: Joi.number().integer().required(),
                        amount: Joi.number().required(),
                        source: Joi.string().min(3).max(3).valid('EUR', 'USD', 'BRL', 'JPY').required(),
                        target: Joi.string().min(3).max(3).valid('EUR', 'USD', 'BRL', 'JPY').required()
                    },
                    options: {
                        abortEarly: false
                    }
                }
            },
            handler: async (request, header) => {
                try {
                    const { userId, amount, source, target } = request.query
                    return this._service.convert(userId, source, target, amount)
                } catch (error) {
                    logger.error(`Fail in convert. Error: ${error}`)
                    return Boom.internal()
                }
            }
        }
    }

}

module.exports = CurrencyRoutes
