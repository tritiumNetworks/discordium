const { get, post } = require('superagent')

/**
 * HTTP client that interact with discord api,
 * 디코 API와 상호작용하는 HTTP 클라이언트
 */
class APIClient {
  /**
   * Create API client,
   * API 클라이언트를 만듭니다
   *
   * @param {string} apiURL api baseURL address, API의 루트 주소
   * @param {string} token authorization token, 식별 및 인증 토큰
   * @param {object} options connection options, 연결 설정값
   * @param {'Bot' | 'Bearer'} options.authorizationMethod prefix of Authorization header, 인증방식
   */
  constructor (apiURL, token, options = { authorizationMethod: 'Bot' }) {
    this.apiURL = apiURL
    this.authorization = options.authorizationMethod + ' ' + token
  }

  /**
   * Get user info,
   * 유저 정보를 불러옵니다
   *
   * @param {?string | '@me'} userId user id
   */
  async getUser (userId = '@me') {
    return await get(this.apiURL + '/users/' + userId)
      .set('Authorization', this.authorization)
  }

  /**
   * Write message,
   * 메시지 작성을 요청합니다
   *
   * @param {string} channelId id of channel where send message, 메시지를 보낼 채널
   * @param {messageInfos} message message, 메시지
   */
  async createMessage (channelId, message) {
    return await post(this.apiURL + '/channels/' + channelId + '/messages')
      .set('Authorization', this.authorization)
      .set('Content-Type', 'application/json')
      .send(message)
  }
}

module.exports = APIClient

/**
 * @typedef {object} messageInfos Message Structure, 메시지 구조
 * @property {string} content string the message contents (up to 2000 characters)
 * @property {number} nonce integer or string a nonce that can be used for optimistic message sending
 * @property {boolean} tts boolean true if this is a TTS message
 * @property {fileInfos} file file contents the contents of the file being sent
 * @property {embedInfos} embed embed object embedded rich content
 * @property {string} payload_json string JSON encoded body of any additional request fields.
 */
