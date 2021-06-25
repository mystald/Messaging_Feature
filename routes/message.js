const messageRouter = require("express").Router();
const { QueryTypes, Op } = require("sequelize")
const sequelize = require('../model')
const jwt = require('jsonwebtoken');
const messagemodel = sequelize.models.message
const personal_messagemodel = sequelize.models.personal_message

messageRouter.route('/')
    .get(async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
            jwt.verify(token, "somekey", async function (err, decoded) {
                const mymessage = await sequelize.query(
                    'SELECT * FROM ( SELECT `message`.`messageid`, `message`.`senderid`, `message`.`type`, `message`.`content`, `message`.`image`, `message`.`createdAt`, `message`.`updatedAt`, `personal_message`.`messageid` AS `personal_message.messageid`, `personal_message`.`receiverid` AS `personal_message.receiverid` FROM `message` AS `message` INNER JOIN `personal_message` AS `personal_message` ON `message`.`messageid` = `personal_message`.`messageid` AND `personal_message`.`receiverid` = :receiverid ORDER BY createdAt DESC LIMIT 18446744073709551615 ) tab GROUP BY senderid ORDER BY createdAt DESC',
                    {
                        replacements: { receiverid: decoded.id },
                        type: QueryTypes.SELECT
                    }
                )
                res.json(mymessage)
            })
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    })

messageRouter.route('/:targetid')
    .get(async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
            jwt.verify(token, "somekey", async function (err, decoded) {
                const targetid = parseInt(req.params.targetid)
                const mymessage = await messagemodel.findAll({
                    include: {
                        model: personal_messagemodel,
                        where: {
                            [Op.or]: [
                                { receiverid: decoded.id },
                                { receiverid: targetid }
                            ]
                        }
                    },
                    where: {
                        [Op.or]: [
                            { senderid: decoded.id },
                            { senderid: targetid }
                        ]
                    },
                    order: sequelize.literal('createdAt DESC')
                })
                res.json(mymessage)
            })
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    })

messageRouter.route('/send/personal')
    .post(async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
            jwt.verify(token, "somekey", async function (err, decoded) {
                if (req.body.receiverid == null) {
                    res.json({ success: false, message: "No Receiver ID" })
                    res.end()
                }
                if (req.body.content == null) {
                    res.json({ success: false, message: "No Message Content" })
                    res.end()
                }
                const sendmessage = await messagemodel.create({
                    senderid: decoded.id,
                    type: 'personal',
                    content: req.body.content
                })

                const messagedetail = await personal_messagemodel.create({
                    messageid: sendmessage.messageid,
                    receiverid: req.body.receiverid
                })
                res.json({ success: true, message: "Message Sent Successfully" })
            })
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    })

module.exports = messageRouter