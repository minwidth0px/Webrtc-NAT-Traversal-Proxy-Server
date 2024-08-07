import { SmokeMessage } from '../../shared/contract.ts'
import { Static } from '@sidewinder/client'
import { Hubs } from '@sinclair/smoke'

export class FakeNetworkHub implements Hubs.Hub {

  //readonly #client: WebSocketClient<typeof SmokeContract>
  #receiveCallback: Function
  //adress: string
  #address: string
  #isSet: boolean = false
  //sendParams  object that looks like {params: [any]}
  #sendParams: any = {params: []}
  #ICEParams: any
  #sendCount = 0
  constructor(endpoint: string, address: string, ICEParams: any) {
    console.log(ICEParams)
    ICEParams.params.sort((a: any, b: any) => {
      if (a.data.type === 'description') return -1
      return 1
    })
    this.#ICEParams = ICEParams
    this.#address = address
    this.#receiveCallback = () => {}
   
  }
  public async configuration(): Promise<RTCConfiguration> {
    return manualConfig()
  }
  public async address(): Promise<string> {
    return this.#address
  }
  public async send(message: { to: string; data: any }): Promise<void> {
    console.log(this.#ICEParams.params[this.#sendCount])
    this.#onReceive(this.#ICEParams.params[this.#sendCount])
    this.#sendCount++
    /*
    if(!this.#isSet){
        this.#isSet = true
        const ICEParams = this.#ICEParams
        for (let i = 0; i < ICEParams.params.length; i++){
            console.log(ICEParams.params[i])
            this.#onReceive(ICEParams.params[i])
            await delay(5)
        }
    }
    */
  }
  public receive(callback: Hubs.HubMessageCallback): void {
    this.#receiveCallback = callback as never
  }
  public dispose(): void {
    //empty
  }
  // ----------------------------------------------------------------
  // Internal
  // ----------------------------------------------------------------
  #onReceive(message: Static<typeof SmokeMessage>) {
    this.#receiveCallback(message)
  }
}

function manualConfig(){
  return {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun3.l.google.com:19302']
      }
    ]
  }
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

