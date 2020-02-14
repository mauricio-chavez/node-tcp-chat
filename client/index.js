const {Socket} = require('net')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const client = new Socket()
let registered = false

client.connect(8000, () => {
  consoleOut('Type your name')
})

function consoleOut(message) {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  console.log(message)
  rl.prompt(true)
}

rl.on('line', input => {
  if (!registered) {
    registered = true
    message = JSON.stringify({
      type: 'register',
      data: input
    })
    client.write(message)
    consoleOut(`Hello, ${input}`)
  } else {
    message = JSON.stringify({
      type: 'message',
      data: input
    })
    client.write(message)
    consoleOut(`You said: "${input}"`)
  }
})

client.on('data', function(data) {
  consoleOut(data.toString())
})

client.on('error', error => {
  console.error(error)
})

rl.on('close', () => {
  console.log('Good bye!')
  client.destroy()
  return process.exit(0)
})

client.on('close', function() {
  console.log('Connection closed')
})
