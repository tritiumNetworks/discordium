const TOKEN = process.env.TOKEN
const API_URL = 'https://discord.com/api/v8'
const GATEWAY_URL = 'wss://gateway.discord.gg/?v=8&encoding=json'

const { GatewaySocket, APIClient } = require('../');

(async () => {
  const api = new APIClient(API_URL, TOKEN)
  const socket = new GatewaySocket(GATEWAY_URL, { debug: false })

  const { heartbeat_interval } = await socket.listenHello()
  setInterval(() => socket.sendHeartbeat(), heartbeat_interval)

  const { body } = await api.getUser('@me')
  console.log('API Online:', body.username)

  const { user } = await socket.identify(TOKEN)
  console.log('Gateway Online:', user.username)

  socket.updateStatus({
    since: Date.now(),
    status: 'online',
    afk: false,
    activities: [{
      name: 'Runing on Discordium',
      type: 0
    }]
  })

  api.createMessage('768832355455860770', {
    content: 'wa sans!'
  })
})()
