"use strict"
require('use-strict')
require('dotenv').load()

var http = require('http')
var spawn = require('child_process').spawn

var express = require('express')

var app = express()
var server = http.Server(app)
module.exports = server

app.set('port', process.env.PORT)

app.get('/', function (req, res) {
  var grab = spawn('ffmpeg', [
    '-f', 'x11grab',
    '-r', '25',
    '-s', '1366x768',
    '-i', ':0.0',
    '-vframes', '1',
    '-f', 'mjpeg',
    '-'
  ])

  grab.stdout.pipe(res)
})

server.listen(9999)
