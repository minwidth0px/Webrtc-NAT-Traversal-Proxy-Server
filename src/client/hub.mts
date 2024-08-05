import { SmokeContract, SmokeMessage } from '../shared/contract.js'
import { WebSocketClient, Static } from '@sidewinder/client'
import { Hubs } from '@sinclair/smoke'

export class RemoteNetworkHub implements Hubs.Hub {

  //readonly #client: WebSocketClient<typeof SmokeContract>
  #receiveCallback: Function
  //adress: string
  #address: string = manualAddr()
  //sendParams  object that looks like {params: [any]}
  #sendParams: any = {params: []}
  constructor(endpoint: string) {
    /*
    this.#client = new WebSocketClient(SmokeContract, endpoint)
    this.#client.method('receive', (message:any) => {
      console.log(`message received:`)
      console.log(message)
      this.#onReceive(message)}
    )
    */
    
    this.manualRecive()
    
    this.#receiveCallback = () => {}
   
  }
  public async configuration(): Promise<RTCConfiguration> {
    //return this.#client.call('configuration')
    return manualConfig()
  }
  public async address(): Promise<string> {
    //return this.#client.call('address')
    return this.#address
  }
  public send(message: { to: string; data: any }): void {
    console.log(`message sent: `)
    console.log(message)
    //return this.#client.send('send', message)
    this.manualSend(message)
  }
  public receive(callback: Hubs.HubMessageCallback): void {
    this.#receiveCallback = callback as never
  }
  public dispose(): void {
    //this.#client.close()
  }
  // ----------------------------------------------------------------
  // Internal
  // ----------------------------------------------------------------
  #onReceive(message: Static<typeof SmokeMessage>) {
    this.#receiveCallback(message)
  }

  manualRecive(){
    const textarea = document.getElementById('receive')
    console.log(textarea)
    if(textarea !== null){
      //when user pastes the message, call #onReceive
      textarea.addEventListener('paste', async (e) => {
        e.preventDefault()
        const text = e.clipboardData?.getData('text/plain') // Add null check using optional chaining operator
        if (text) {
          const message = JSON.parse(text)
          //sort params array so that data.type == 'description' is first
          message.params.sort((a: any, b: any) => {
            if (a.data.type === 'description') return -1
            return 1
          })
          //loop through the params array and call #onReceive then wait 5 ms
          for (let i = 0; i < message.params.length; i++){
            this.#onReceive(message.params[i])
            await delay(5)
          }

        }
      })
    }
  }
  manualSend(message: any){
    const log = document.getElementById('send')
    const copy = document.getElementById('copy')
    const qr = document.getElementById('qrcode')
    //add the message to the sendparams object's params array
    this.#sendParams.params.push(message)
    const paramsString = JSON.stringify(this.#sendParams)
    if (log !== null){
      message.from = this.#address
      log.innerText = paramsString
    }
    if (qr !== null) {
      qr.setAttribute("contents", paramsString);  
    }
    if (copy !== null){
      copy.addEventListener('click', () => {
        navigator.clipboard.writeText(paramsString)
      })
    }
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

function manualAddr(){
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

