const { DataTypes } = require('sequelize');
const messagemodel = {
    messageid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    senderid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'userid'
        }
    },
    type: {
        type: DataTypes.ENUM('personal', 'group'),
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: true
    }
}

module.exports = messagemodel