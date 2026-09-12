const mineflayer = require('mineflayer')

const host = process.env.MC_HOST
const port = Number(process.env.MC_PORT || 25565)
const username = process.env.MC_USERNAME
const auth = process.env.MC_AUTH || 'offline'

if (!host) {
  console.error('MC_HOST is missing')
  process.exit(1)
}

if (!username) {
  console.error('MC_USERNAME is missing')
  process.exit(1)
}

let reconnectTimer = null
let stopping = false

function startBot() {
  console.log(`Connecting to ${host}:${port}...`)

  const bot = mineflayer.createBot({
    host,
    port,
    username,
    auth,
    version: '26.2'
  })

  bot.once('spawn', () => {
    console.log('Bot connected successfully')
    console.log(`Minecraft version: ${bot.version}`)
    console.log(`Username: ${bot.username}`)
  })

  bot.on('kicked', (reason) => {
    console.log('Bot kicked:')
    console.log(reason)
  })

  bot.on('error', (error) => {
    console.error('Bot error:')
    console.error(error)
  })

  bot.on('end', () => {
    console.log('Connection ended')

    if (!stopping) {
      console.log('Reconnecting in 30 seconds...')

      reconnectTimer = setTimeout(() => {
        startBot()
      }, 30000)
    }
  })
}

function shutdown() {
  stopping = true

  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
  }

  console.log('Shutting down...')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

startBot()
