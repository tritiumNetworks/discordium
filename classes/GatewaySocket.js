const WebSocket = require('ws')

/**
 * WebSocket that interact with gateway,
 * 게이트웨이와 상호작용하는 웹소켓
 */
class GatewaySocket extends WebSocket {
  /**
   * Create gateway websocket,
   * 게이트웨이 웹소켓을 만듭니다
   *
   * @param {string} gateway gateway address, 게이트웨이 주소
   * @param {object} options connection options, 연결 설정값
   * @param {boolean} options.debug debug flag, 디버그 여/부
   */
  constructor (gateway, options = { debug: false }) {
    super(gateway)

    if (options.debug) this.on('message', debug)
  }

  /**
   * Listen "Hello" payload and receive heartbeat informations,
   * 게이트웨이에서 "Hello" 페이로드를 읽어오면서 하트비트 정보들을 받아옵니다
   *
   * @returns {Promise<heartbeatInfos>}
   */
  listenHello () {
    return new Promise((resolve, reject) => {
      this.once('message', (msg) => {
        msg = JSON.parse(msg)
        if (msg.op !== 10) reject(new Error('gateway message collision'))
        else resolve(msg.d)
      })
    })
  }

  /**
   * Identify user with given client token,
   * 게이트웨이에 받은 토큰과 함깨 유저 식별을 요청합니다
   *
   * @param {string} token discord client token, 디스코드 봇/클라이언트 토큰
   * @param {object} options identify options, 식별 설정값
   * @param {number} options.intents gateway intents, 인텐트 설정값 (https://discord.com/developers/docs/topics/gateway#gateway-intents)
   * @param {object} options.properties working enviroment infomations, 작동 환경값
   *
   * @returns {Promise<userInfos>}
   */
  identify (token, options = { intents: 513 }) {
    if (!options.properties) {
      options.properties = {
        $os: process.platform,
        $browser: 'discordium',
        $device: 'discordium'
      }
    }

    this.send(JSON.stringify({
      op: 2,
      d: { token, ...options }
    }))

    return new Promise((resolve, reject) => {
      this.once('message', (msg) => {
        msg = JSON.parse(msg)
        if (msg.op !== 0) reject(new Error('gateway message collision'))
        else resolve(msg.d)
      })
    })
  }

  /**
   * Update status with given options,
   * 주어진 상태 설정값으로 게이트웨이에 상태 변경을 요청합니다
   *
   * @param {object} options status options, 상태 설정값
   * @param {?number} options.since unix time (in milliseconds) of when the client went idle, or null if the client is not idle
   * @param {?activityInfos[]} options.activities null, or the user's activities
   * @param {'online' | 'dnd' | 'idle' | 'invisible' | 'offline'} options.status the user's new status
   * @param {boolean} options.afk whether or not the client is afk
   */
  updateStatus (options) {
    if (typeof options !== 'object') throw new Error('options not provided or invaild type')

    this.send(JSON.stringify({
      op: 3,
      d: options
    }))
  }

  /**
   * Send heartbeat, 하트비트를 전송합니다
   *
   * @returns {void}
   */
  sendHeartbeat () {
    this.send(JSON.stringify({ op: 1 }))
  }
}

function debug (body) {
  console.log(new Date(), body)
}

module.exports = GatewaySocket

/**
 * @typedef {object} heartbeatInfos heartbeat infomations, 하트비트 정보들
 * @property {number} heartbeat_interval heartbeat interval that requested by discord (in millisecond), 디스코드에서 요구하는 하트비트 간격 (밀리초 단위)
 */

/**
 * @typedef {object} activityInfos Activity Structure, 엑티비티 관련
 * @property {string} name the activity's name
 * @property {number} type activity type
 * @property {?string} url stream url, is validated when type is 1
 * @property {number} created_at unix timestamp of when the activity was added to the user's session
 * @property {timeRange} timestamps unix timestamps for start and/or end of the game
 * @property {string} application_id application id for the game
 * @property {?string} details what the player is currently doing
 * @property {?string} state the user's current party status
 * @property {?emojiInfos} emoji the emoji used for a custom status
 * @property {?partyInfos} party information for the current party of the player
 * @property {?assetsInfos} assets images for the presence and their hover texts
 * @property {?secretsInfos} secrets secrets for Rich Presence joining and spectating
 * @property {boolean} instance whether or not the activity is an instanced game session
 * @property {number} flags activity flags `OR`d together, describes what the payload includes
 */
