const dbConfig = require('../config/dbconfig')
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

let options

options = { freezeTableName: true, timestamps: false}
const usermodel = require('./user')
sequelize.define('user', usermodel, options)

options = { freezeTableName: true}
const messagemodel = require('./message')
sequelize.define('message', messagemodel, options)

options = { freezeTableName: true, timestamps: false}
const personal_messagemodel = require('./personal_message')
sequelize.define('personal_message', personal_messagemodel, options)

sequelize.models.message.hasOne(sequelize.models.personal_message, {foreignKey: 'messageid', targetKey: 'messageid'})
sequelize.models.personal_message.belongsTo(sequelize.models.message, {foreignKey: 'messageid', targetKey: 'messageid'})

module.exports = sequelize