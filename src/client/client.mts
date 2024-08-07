import { Network } from '@sinclair/smoke'
import { WebtorrentHub } from './hubs/webtorrentHub.mts'
import { ManualHub } from './hubs/manualHub.mts'
import networkService from './networkService.mts'
import { FakeNetworkHub } from './hubs/fakeHub.mts'

//const url = 'wss://tracker.openwebtorrent.com';
const url = 'ws://localhost:8000';
//const url = 'wss://tracker.webtorrent.dev'; //<-- does not work
//const url = 'wss://tracker.files.fm:7073'

const ws = new WebSocket(url)

const peerId = window.crypto.randomUUID().replaceAll('-', '').slice(0, 20)

const client2 = new Network({ hub: new ManualHub('ws://localhost:5001/hub') })

const input = (document.getElementById('input') as HTMLInputElement);
const infoHashInput = (document.getElementById('info-hash') as HTMLInputElement);
const btn = (document.getElementById('btn') as HTMLButtonElement);
btn.addEventListener( "click" , async () => {
    //check if remoteAddr is a url that contains infohash as a query parameter
    const url = new URL(input.value);
    const searchParams = url.searchParams;
    console.log({ searchParams });
    //print all search params
    let infoHash = '';
    //check if infohash is in the search params
    if(searchParams.has('infoHash')){
        infoHash = searchParams.get('infoHash')!;
    }else{
        infoHash = infoHashInput.value;
    }
    console.log({ infoHash });
    const remoteAddr = url.origin;
    console.log({ remoteAddr });
    const client1 = new Network({ hub : new WebtorrentHub(ws, infoHash, peerId, remoteAddr) })
    const client = client1;
    networkService.remoteAddr = remoteAddr;
    console.log({ input: remoteAddr });
    const text = await client.Http.fetch([remoteAddr, "test"].join("/")).then(r => r.text());
    const output = document.getElementById('output');
    console.log({ text });
    if (output !== null) {
        const div = document.createElement('div')
        div.innerText = text
        output.appendChild(div)
    }    
    networkService.useSmoke = true
    networkService.smokeClient = client
    console.log(client)
    console.log(networkService.ICEParams)
    const fake = new Network({ hub: new FakeNetworkHub('ws://localhost:5001/hub', networkService.address, networkService.ICEParams) })
    const text2 = await fake.Http.fetch([remoteAddr, "test"].join("/")).then(r => r.text());
    console.log(fake)
    console.log(text2);
    console.log(JSON.stringify(client))
});

