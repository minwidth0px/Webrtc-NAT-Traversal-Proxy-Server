import { Network } from '@sinclair/smoke'
import { RemoteNetworkHub } from './hub.mjs'


const client2 = new Network({ hub: new RemoteNetworkHub('ws://localhost:5001/hub') })
//const client2 = new Network({ hub: new RemoteNetworkHub('wss://tracker.webtorrent.dev') })

const input = (document.getElementById('input') as HTMLInputElement);
const btn = (document.getElementById('btn') as HTMLButtonElement);
btn.addEventListener( "click" , async () => {
    const remoteAddr = input.value;
    console.log({ input: remoteAddr });
    const text = await client2.Http.fetch([remoteAddr, "test"].join("/")).then(r => r.text());
    const output = document.getElementById('output');
    console.log({ text });
    if (output !== null) {
        const div = document.createElement('div')
        div.innerText = text
        output.appendChild(div)
    }
});

