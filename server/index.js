const {Server} = require('net')
const logger = require('./logger')

const server = new Server()
let clients = []

function broadcast(socket, message) {
  clients.forEach(client => {
    if (client === socket) return
    client.write(message)
  })
}

function removeSocket(socket) {
  clients = clients.filter(client => client !== socket)
}

server.on('listening', () => {
  const {address, port} = server.address()
  logger('info', `Listening on ${address}:${port}`)
})

server.on('connection', function(socket) {
  logger('success', 'A new connection has been established...')
  socket.name = 'Annonymous'
  clients.push(socket)

  socket.on('data', function(chunk) {
    const message = chunk.toString()
    const {type, data} = JSON.parse(message)
    logger('message', `Received from ${socket.name}: ${message}`)

    switch (type) {
      case 'register':
        socket.name = data
        broadcast(socket, `${data} has joined!`)
        break

      default:
        broadcast(socket, `${socket.name} says: "${data}"`)
        break
    }
  })

  socket.on('end', function() {
    const {name} = socket
    logger('info', `Closing connection with ${name}`)
    broadcast(socket, `${name} is gone :(`)
    removeSocket(socket)
  })

  socket.on('error', function(err) {
    logger('error', err)
  })
})
server.listen(8000, 'localhost')
