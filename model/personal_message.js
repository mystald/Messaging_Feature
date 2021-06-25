const { DataTypes } = require('sequelize');
const personal_messagemodel = {
    messageid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'message',
            key: 'messageid'
        }
    },
    receiverid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'userid'
        }
    }
}

module.exports = personal_messagemodel