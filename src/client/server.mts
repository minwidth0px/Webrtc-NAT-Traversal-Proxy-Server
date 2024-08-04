import { Network } from '@sinclair/smoke'
import { RemoteNetworkHub } from './hub.mjs'


const server = new Network({ hub: new RemoteNetworkHub('ws://localhost:5001/hub') })

const requestsDiv = document.getElementById('requests')

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
const url = `http://${remoteAddr}:5000`

const urlDiv = document.getElementById('url')
if (urlDiv !== null) {
    urlDiv.innerText = url
}
const qrDiv = document.getElementById('qrcode')
if (qrDiv !== null) {
    qrDiv.setAttribute("contents", url);  
}

console.log({ remoteAddr })
