const userRouter = require("express").Router();
const sequelize = require('../model')
const jwt = require('jsonwebtoken');
const usermodel = sequelize.models.user

userRouter.route('/login')
  .post(async (req, res, next) => {
    try {
      const check = await usermodel.findAll({
        where: {
          username: req.body.username,
          password: req.body.password
        }
      })
      if (check.length > 0) {
        const token = jwt.sign({ id: check[0].userid }, "somekey", {
          expiresIn: 86400
        });
        res.json({ success: true, token: token, message: "Logged In" })
      } else {
        res.json({ success: false, message: "Failed to Login" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json(error)
    }
  })

userRouter.route('/logout')
  .post(async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
      jwt.verify(token, "somekey", function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
        const userid = decoded.id
        res.json({ success: true, message: 'Userid ' + userid + ' logged out' })
      })
    } catch (error) {
      console.error(error)
      res.status(500).json(error)
    }
  })

module.exports = userRouter;
