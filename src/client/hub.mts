import { SmokeContract, SmokeMessage } from '../shared/contract.js'
import { WebSocketClient, Static } from '@sidewinder/client'
import { Hubs } from '@sinclair/smoke'

export class RemoteNetworkHub implements Hubs.Hub {

  //readonly #client: WebSocketClient<typeof SmokeContract>
  #receiveCallback: Function
  //adress: string
  #address: string
  constructor(endpoint: string) {
    /*
    this.#client = new WebSocketClient(SmokeContract, endpoint)
    this.#client.method('receive', (message:any) => {
      console.log(`message received:`)
      console.log(message)
      this.#onReceive(message)}
    )
    */
    this.#address = manualAddr()
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
    console.log("we are here")
        //create a field for a document element with id RTCSessionDescription-offer
        const log = document.getElementById('rtc-connection-log')
        let connectionType = document.getElementById('type')
        //get data-value field of the connectionType element
        let connectionTypeValue = connectionType?.getAttribute('data-value')
        console.log(connectionTypeValue)
        let type = ""
        if (connectionTypeValue === "server"){
          type = "offer"
        }else if (connectionTypeValue === "client"){
          type = "answer"
        }
        for (let i = 0; i < 1; i++){
          if (log !== null){
            const div = document.createElement('div')
            div.innerText = `receive ${type}:`
            log.appendChild(div)
  
            //create textarea for user to past the message
            const textarea = document.createElement('textarea')
            
            //when user pastes the message, call #onReceive
            textarea.addEventListener('paste', (e) => {
              e.preventDefault()
              const text = e.clipboardData?.getData('text/plain') // Add null check using optional chaining operator
              if (text) {
                const message = JSON.parse(text)
                this.#onReceive(message)
              }
            })
            log.appendChild(textarea)
          }
          type = "candidate"
        }
  
  }
  manualSend(message: any){
    const log = document.getElementById('rtc-connection-log')
    if (message.data.type == "description" ){
      if (message.data.description.type == "offer"){
        if (log !== null){
          const div = document.createElement('div')
          div.innerText = "send offer:"
          log.appendChild(div)
        }
      }
      if (message.data.description.type == "answer"){
        if (log !== null){
          const div = document.createElement('div')
          div.innerText = "send answer:"
          log.appendChild(div)
        }
      }
    }else if (message.data.type == "candidate"){
      if (log !== null){
        const div = document.createElement('div')
        div.innerText = "send candidate:"
        log.appendChild(div)
      }
    }
    if (log !== null){
      const div = document.createElement('div')
      message.from = this.#address
      div.innerText = JSON.stringify(message)
      log.appendChild(div)
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

