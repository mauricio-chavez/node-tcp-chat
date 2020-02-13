const {Server} = require('net')

const server = new Server()

server.listen(8000, 'localhost')

server.on('listening', () => {
  const {address, port} = server.address()
  console.log(`Listening on ${address}:${port}`)
})

server.on('connection', function(socket) {
  console.log('A new connection has been established...')
  socket.write('Hello, motherfucker!')

  socket.on('data', function(chunk) {
    const message = chunk.toString()
    console.log(`Data received from client: ${message}`)
    socket.write(`${message.toUpperCase()}`)
  })

  socket.on('end', function() {
    console.log('Closing connection with the client')
  })

  socket.on('error', function(err) {
    console.log(`Error: ${err}`)
  })
})
