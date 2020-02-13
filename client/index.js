const {Socket} = require('net')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const client = new Socket()

client.connect(8000, () => {
  consoleOut('Connected -> localhost:8000')
})

function consoleOut(message) {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  console.log(message)
  rl.prompt(true)
}

rl.on('line', input => {
  client.write(input)
})

client.on('data', function(data) {
  consoleOut('Received: ' + data)
})

client.on('error', error => {
  console.error(error)
})

rl.on('close', () => {
  console.log('Good bye!')
  client.destroy()
})

client.on('close', function() {
  console.log('Connection closed')
})
