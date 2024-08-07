import { SmokeContract, SmokeMessage } from '../../shared/contract.ts'
import { WebSocketClient, Static } from '@sidewinder/client'
import { Hubs } from '@sinclair/smoke'
import networkService from '../networkService.mts'

export class ManualHub implements Hubs.Hub {

    #receiveCallback: Function
    #address: string = manualAddr()
    #sendParams: any = {params: []}
    constructor(endpoint: string) {
      networkService.address = this.#address
      this.manualRecive()
      
      this.#receiveCallback = () => {}
     
    }
    public async configuration(): Promise<RTCConfiguration> {
      return manualConfig()
    }
    public async address(): Promise<string> {
      return this.#address
    }
    public send(message: { to: string; data: any }): void {
      console.log(`message sent: `)
      console.log(message)
      this.manualSend(message)
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
            networkService.ICEParams = message
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