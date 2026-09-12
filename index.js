const mineflayer = require('mineflayer')

const host = process.env.MC_HOST
const port = Number(process.env.MC_PORT || 25565)
const username = process.env.MC_USERNAME

if (!host || !username) {
  console.error('Missing MC_HOST or MC_USERNAME')
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
    auth: process.env.MC_AUTH || 'offline',
    version: '26.2'
  })

  bot.once('spawn', () => {
    console.log('================================')
    console.log('Bot connected to Minecraft 26.2')
    console.log('Username:', bot.username)
    console.log('Position:', bot.entity.position)
    console.log('================================')
  })

  bot.on('kicked', reason => {
    console.log('Bot kicked:')
    console.log(reason)
  })

  bot.on('error', error => {
    console.error('Mineflayer error:')
    console.error(error)
  })

  bot.on('end', () => {
    console.log('Connection closed')

    if (!stopping) {
      console.log('Reconnecting in 30 seconds...')

      reconnectTimer = setTimeout(() => {
        startBot()
      }, 30000)
    }
  })
}

process.on('SIGTERM', () => {
  stopping = true

  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
  }

  console.log('Stopping bot...')
  process.exit(0)
})

process.on('SIGINT', () => {
  stopping = true

  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
  }

  console.log('Stopping bot...')
  process.exit(0)
})

startBot()
