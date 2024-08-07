import { SmokeMessage } from '../../shared/contract.ts'
import { Static } from '@sidewinder/client'
import { Hubs } from '@sinclair/smoke'
import networkService from '../networkService.mts'

///creates a signaiing server over webtorrent though websockets
///requires the server's websocket to have already anounced once
export class WebtorrentHub implements Hubs.Hub {
  #receiveCallback: Function
  #address: string
  #ws: WebSocket
  #infoHash: string
  #firstSendSignal: boolean = true
  #remoteAddr: string | any
  constructor(ws: WebSocket, infoHash: string, localAddr: string, remoteAddr: string | any) {
    if(remoteAddr){
      this.#address = remoteAddr
    }
    this.#address = localAddr
    this.#ws = ws
    this.#ws.onmessage = (event) => {
      console.log(`message received:`)
      console.log(event.data)
      const msg = JSON.parse(event.data)
      console.log(msg)
      if(msg.offer){
        console.log(`offer received:`)
        console.log(msg.offer)
        networkService.ICEParams.params.push(msg.offer)
        this.#onReceive(msg.offer)
      }
    }
    this.#infoHash = infoHash  
    this.#receiveCallback = () => {}
    networkService.address = this.#address
  }
  public async configuration(): Promise<RTCConfiguration> {
    return {
      iceServers: [{urls: ['stun:stun1.l.google.com:19302', 'stun:stun3.l.google.com:19302'] }]
    }
  }
  public async address(): Promise<string> {
    return this.#address
  }
  public send(message: any): void {
    console.log(`message sent: `)
    console.log(message)
    if(this.#firstSendSignal){
      this.#firstSendSignal = false
    }
    message.from = this.#address
    this.#ws.send(
      JSON.stringify({
        event: 'started',
        action: "announce",
        info_hash: this.#infoHash,
        peer_id: this.#address,
        numwant: 1,
        offers: [
            {
              offer: message,
              offer_id: this.#address
          },
        ]
      })
    ) 
  }
  public receive(callback: Hubs.HubMessageCallback): void {
    this.#receiveCallback = callback as never
  }
  public dispose(): void {
    this.#ws.close()
  }
  // ----------------------------------------------------------------
  // Internal
  // ----------------------------------------------------------------
  #onReceive(message: Static<typeof SmokeMessage>) {
    this.#receiveCallback(message)
  }

}

