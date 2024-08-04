import { SmokeContract, SmokeMessage } from '../shared/contract.js'
import { WebSocketClient, Static } from '@sidewinder/client'
import { Hubs } from '@sinclair/smoke'

export class RemoteNetworkHub implements Hubs.Hub {
  readonly #client: WebSocketClient<typeof SmokeContract>
  #receiveCallback: Function
  constructor(endpoint: string) {
    this.#client = new WebSocketClient(SmokeContract, endpoint)
    this.#client.method('receive', message => this.#onReceive(message))
    this.#receiveCallback = () => {}
  }
  public async configuration(): Promise<RTCConfiguration> {
    return this.#client.call('configuration')
  }
  public async address(): Promise<string> {
    return this.#client.call('address')
  }
  public send(message: { to: string; data: unknown }): void {
    return this.#client.send('send', message)
  }
  public receive(callback: Hubs.HubMessageCallback): void {
    this.#receiveCallback = callback as never
  }
  public dispose(): void {
    this.#client.close()
  }
  // ----------------------------------------------------------------
  // Internal
  // ----------------------------------------------------------------
  #onReceive(message: Static<typeof SmokeMessage>) {
    this.#receiveCallback(message)
  }
}


