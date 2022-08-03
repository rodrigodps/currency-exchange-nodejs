const { INTEGER, STRING, FLOAT, DATE } = require('sequelize');

const TransactionSchema = {
    name: 'transaction',
    schema: {
        id: {
            type: INTEGER,
            require: true,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: STRING,
            require: true
        },
        sourceCurrency: {
            type: STRING,
            require: true
        },
        sourceAmount: {
            type: FLOAT,
            require: true
        },
        targetCurrency: {
            type: STRING,
            require: true
        },
        targetAmount: {
            type: FLOAT,
            require: true
        },
        rate: {
            type: FLOAT,
            require: true
        },
        date: {
            type: DATE,
            require: true
        }
    },
    options: {
        tableName: 'TB_TRANSACTION',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = TransactionSchema
