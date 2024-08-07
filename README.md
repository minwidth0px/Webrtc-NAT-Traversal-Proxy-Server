WIP WebRTC-NAT-Traversal-Proxy-Server using https://github.com/sinclairzx81/smoke/. 

The server runs as a web page in your browser and forwards all requests to localhost:8080 where your real server should be running

To install, clone this repo, and run `npm install` followed by `npm start` and vist `http://localhost:5000`, Some of the files generated by hammer will be placed in `target/client/client`. Be sure to move them to `target/client` and delete the second `client` folder. 

Open both the client.html page and the server html page which appaer after visiting `http://localhost:5000`. (The client html page should be opened on the device you wish to recieve to fetch data from the server). You will need a way to host the client page, for example via github pages. On the server page, a smoke network address will appear on the top. Paste that link into client.html and press send. This will start the begining of the singaling phase, which will be done via webtorrent trackers.

You will need to make some changes to your code to actually use this for anything. Specifically, you will need to repalce all uses of fetch with the following class:

```ts

import { Network } from '@sinclair/smoke';
import { RemoteNetworkHub } from './hub.mjs';

export class FetchService {
    useSmoke: boolean;
    private smokeClient?: Network;

    constructor( hubUrl = 'ws://localhost:5001/hub') {
        this.useSmoke = false;
        this.smokeClient = new Network({ 
            hub: new RemoteNetworkHub(hubUrl) 
        });
    }

   async fetch(url:string, options?: RequestInit): Promise<Response>{
        
         if(this.useSmoke && this.smokeClient){
            return await this.smokeClient.Http.fetch(url,options);
          }
          else{
              return await fetch(url,options);
           }
      }
}

```

eg `fetch(url //....` -> `FetchService.fetch //...` You need to set `useSmoke` to true for it to work. This class is only useful after you already established a connection. If there is anything you didn't unsertand, you can open an issue, but note that this is a very WIP project and may not work easily or at all for your usecase. You do not need to make these changes to client.html, which just tests that the webrtc connection is created.

You also have the option of doing the signaling manually. An example is provided in the client.html, cient.mts, server.html and server.mts files. After running the server, go to `target/client/client.js` and `target/client/server.js` and search for `4e3` and replace it with `500e3` and save both files. (This extends the timeout period from 4 seconds to 500.) You will need to manually paste the `RTCSessionDescription`s that will appear in your browser. (These will be printed to the screen on both ends.)
