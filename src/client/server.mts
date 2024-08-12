import { Network } from '@sinclair/smoke'
import { WebtorrentHub } from './hubs/webtorrentHub.mts'
import { ManualHub } from './hubs/manualHub.mts'

//const url = 'wss://tracker.openwebtorrent.com';
//const url = 'ws://localhost:8000';
//const url = 'wss://tracker.webtorrent.dev';//<-- does not work
const url = 'wss://tracker.files.fm:7073'  

const ws = new WebSocket(url)

///you could make these the same which would make 
///sending the info_hash and peer_id to the client easier
const infoHash = window.crypto.randomUUID().replaceAll('-', '').slice(0, 20)
const peerId = window.crypto.randomUUID().replaceAll('-', '').slice(0, 20)

ws.onopen = () => {
    console.log('connected')
    ws.send(
        JSON.stringify({
            event: 'started',
            action: "announce",
            info_hash: infoHash,
            peer_id: peerId,
            numwant: 5,
        })
    );
}

const network = new Network({ hub: new WebtorrentHub(ws, infoHash, peerId, null) })

const network2 = new Network({ hub: new ManualHub('ws://localhost:5001/hub') })

const requestsDiv = document.getElementById('requests')

const server = network

server.Http.listen({ port: 5000 }, async request => {
    console.log(request)
    console.log(request.url)
    const path = new URL(request.url).pathname
    if (requestsDiv !== null) {
        console.log("appending to requestsDiv")
        //add new div to requestsDiv with request.method and path
        const div = document.createElement('div')
        div.innerText = `${request.method} ${path}`
        requestsDiv.appendChild(div)
    }
    if (path === '/test') {
        return new Response('Test successful')
    }
    let body = null
    let signal = null
    console.log(request.signal)
    if (request.method === 'POST') {
        body = await request.text()
        console.log({ body })
        signal = request.signal
    }
    const res = await fetch(`http://localhost:8080${path}`, {
        method: request.method,
        signal: signal,
        headers: request.headers,
        body
    })
    return res
}) 

const remoteAddr = await server.Hub.address() 
const serverUrl = `http://${remoteAddr}:5000`

const urlDiv = document.getElementById('url')
const infoHashDiv = document.getElementById('info-hash')
const fullUrl = `${serverUrl}/?infoHash=${infoHash}`
if (urlDiv !== null) {
    urlDiv.innerText = fullUrl
}
const qrDiv = document.getElementById('qrcode')
if (qrDiv !== null) {
    qrDiv.setAttribute("contents", fullUrl);  
}

console.log({ remoteAddr })
