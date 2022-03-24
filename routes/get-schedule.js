const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const bcrypt = require("bcryptjs")
const saltRounds = 10
const pgp = require('pg-promise')()



module.exports = router
