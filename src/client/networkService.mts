import { Network } from '@sinclair/smoke'

export default  {
    remoteAddr: '',
    address: '',
    //sendParams any, 
    ICEParams  : {params: []} = {params: []} as any ,
    useSmoke: false,
    smokeClient: null as Network | null,

   async fetch(url:string, options?: RequestInit): Promise<Response>{
        
         if(this.useSmoke && this.smokeClient){
            return await this.smokeClient.Http.fetch(url,options)
          }
          else{
              return await fetch(url,options)
           }
      }
}