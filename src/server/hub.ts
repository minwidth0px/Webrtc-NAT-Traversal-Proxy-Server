import { SmokeContract } from '../shared/contract'
import { WebSocketService } from '@sidewinder/server'

/**
 * This is a public web socket signalling hub used to relay ice messages
 * between peers, as well as return network identity information.
 */
export class SmokeHubService extends WebSocketService<typeof SmokeContract> {
  constructor() {
    super(SmokeContract)
  }
  onConfiguration = this.method('configuration', (identity) => {
    return {
      iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun3.l.google.com:19302']
        }
    ]
    }
  })
  onAddress = this.method('address', (identity) => {
    return identity
  })
  onSend = this.method('send', (identity, request) => {
    this.send(request.to, 'receive', { 
      from: identity, 
      to: request.to, 
      data: request.data 
    })
  })
}