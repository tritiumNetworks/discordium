<div align="center">
  <h1>
    discordium
  </h1>
  <p>nodejs module for handle discord api but everything is manual</p>
  <p>디코봇 제작 모듈 인데... 다 수동이넹 ㅇㅁㅇ</p>
</div>

### concept
- 디스코드 봇 개발자가 디스코드 API의 원리를 분석하고 파악할 수 있도록 환경을 제공
- 간단한 기능은 지원하면서도 디스코드 API에 최대한 로우레벨로 접근할 수 있도록 함
- JSDOC를 모두 기록해 설명을 보면서 원리 및 구조를 최대한 이해할 수 있도록 함 (vscode에서 작업할때 잘 보임)

### install
`npm install discordium`\
or `yarn add discordium`

### example
```js
const TOKEN = process.env.TOKEN || '<토큰>'
const API_URL = 'discord.com/api/v8'
const GATEWAY_URL = 'wss://gateway.discord.gg/?v=8&encoding=json'

const { GatewaySocket, APIClient } = require('discordium');

(async () => {
  const api = new APIClient(API_URL, TOKEN)
  const socket = new GatewaySocket(GATEWAY_URL, { debug: false })

  // 게이트웨이에서 요청한 것들을 읽어옵니다
  // discord.com/developers/docs/topics/gateway#connecting-example-gateway-hello
  const { heartbeat_interval } = await socket.listenHello()

  // 게이트웨이에서 요청한 간격대로 하트비트를 전송합니다
  // discord.com/developers/docs/topics/gateway#heartbeating
  setInterval(() => socket.sendHeartbeat(), heartbeat_interval)

  // API를 통해 본인의 정보를 가져옵니다
  // discord.com/developers/docs/resources/user#get-current-user
  const { body } = await api.getUser('@me')
  console.log('API Online:', body.username)

  // 게이트웨이를 통해 계정 인증을 진행합니다
  // discord.com/developers/docs/topics/gateway#identifying
  const { user } = await socket.identify(TOKEN)
  console.log('Gateway Online:', user.username)

  // 게이트웨이를 통해 본인의 상태 표시를 변경합니다
  // discord.com/developers/docs/topics/gateway#update-status
  socket.updateStatus({
    since: Date.now(),
    status: 'online',
    afk: false,
    activities: [{
      name: 'Runing on Discordium',
      type: 0
    }]
  })

  // API를 통해 메시지를 전송합니다
  // discord.com/developers/docs/resources/channel#create-message
  api.createMessage('768832355455860770', {
    content: 'wa sans!'
  })
})()
```

![](https://cdn.discordapp.com/attachments/768832355455860770/769173968896393236/unknown.png)
![](https://cdn.discordapp.com/attachments/768832355455860770/769174117906907146/unknown.png)
![](https://cdn.discordapp.com/attachments/768832355455860770/769174231178674196/unknown.png)
