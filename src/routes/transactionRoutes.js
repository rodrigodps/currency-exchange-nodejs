const BaseRoute = require('./baseRoute')
const Joi = require('joi')
const Boom = require('@hapi/boom')

const failAction = (request, headers, error) => {
    throw error
}

class TransactionRoutes extends BaseRoute {

    constructor(service) {
        super()
        this._service = service
    }

    list() {
        return {
            path: '/transactions',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'List transactions currency convert by user id',
                validate: {
                    failAction,
                    query: {
                        userId: Joi.number().integer().required()
                    },
                    options: {
                        abortEarly: false
                    }
                }
            },
            handler: async (request, header) => {
                try {
                    const { userId } = request.query
                    return await this._service.list(userId)
                } catch (error) {
                    logger.error(`Fail in list transactions. Error: ${error}`)
                    return Boom.internal()
                }
            }
        }
    }

}

module.exports = TransactionRoutes
