"use strict"
require('use-strict')
require('dotenv').load()

var http = require('http')

var express = require('express')

var app = express()
var server = http.Server(app)
module.exports = server

app.set('port', process.env.PORT)

server.listen(9999)
