import { Network } from '@sinclair/smoke'
import { WebtorrentHub } from './hubs/webtorrentHub.mts';

export default  {
    remoteAddr: '',
    address: '',
    //sendParams any, 
    ICEParams  : {params: []} = {params: []} as any ,
    useSmoke: false,
    ws: WebSocket as any,
    queue: [] as any[],
    smokeClient: null as Network | null,

    setNetwork(ws: WebSocket, infoHash: string, peerId: string, remoteAddr: string ){
        console.log("setting network")
        this.address = peerId
        const client = new Network({ hub : new WebtorrentHub(ws, infoHash, peerId, remoteAddr) })
        this.smokeClient = client;
        this.remoteAddr = remoteAddr;
        this.ws = ws;
        console.log("done setting network")
    },

   async fetch(url:string, options?: RequestInit): Promise<Response>{
    if(this.useSmoke && this.smokeClient){
      console.log('using smoke')
      console.log({ws: this.ws.readyState})
      if(this.ws.readyState === 1){
        return await this.smokeClient.Http.fetch(url,options)
      }else{
        throw new Error('socket not open. Mkae sure to use ws.addEventListener("open", ()=>{...})')
      }
    }
    else{
        return await fetch(url,options)
      }
  }
}