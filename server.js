"use strict"
require('use-strict')
require('dotenv').load()

var http = require('http')
var spawn = require('child_process').spawn

var _ = require('lodash')
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

if (process.env.VIDEO) {
  app.get('/video', function (req, res) {
    var grab = spawn('ffmpeg', [
      '-f', 'x11grab',
      '-r', '30',
      '-s', '1366x768',
      '-i', ':0.0',
      '-f', 'matroska',
      '-c:v', 'libx264',
      '-tune', 'zerolatency',
      '-preset', 'ultrafast',
      '-'
    ])

    req.on('close', function () {
      grab.kill()
    })

    grab.stdout.pipe(res)
    grab.stderr.pipe(process.stdout)
  })
}

var curDesktop = '0'

function changescreenPrivate (id) {
  curDesktop = id
  // spawn('wmctrl', ['-s', id])
  spawn('notify-send', ['Switch screen', id])
}

var changescreen = _.throttle(changescreenPrivate, 1000)

app.get('/desktop', function (req, res) {
  res.send(curDesktop).end()
})

app.get('/switch/:id', function (req, res) {
  changescreen(req.params.id)
  res.json({ok: true})
})

server.listen(9999)
console.log('Listening on tcp...')

var dgram = require('dgram')
var udpSocket = dgram.createSocket('udp4')
var udpReply = new Buffer('asdf')

udpSocket.on('error', (err) => {
  console.log(`udpSocket error:\n${err.stack}`)
  udpSocket.close()
})

udpSocket.on('message', (msg, rinfo) => {
  console.log(`udpSocket got: ${msg} from ${rinfo.address}:${rinfo.port}`)
  udpSocket.send(udpReply, 0, udpReply.length, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.log(err)
    }
  })
})

udpSocket.on('listening', () => {
  var address = udpSocket.address()
  console.log(`udpSocket listening ${address.address}:${address.port}`)
})

udpSocket.bind(9997)
