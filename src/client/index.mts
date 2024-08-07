import { Network } from '@sinclair/smoke'
import { ManualHub } from './hubs/manualHub.mts'

// ------------------------------------------------------------------
//
// Create two virtual network clients
//
// ------------------------------------------------------------------

const client1 = new Network({ hub: new ManualHub('ws://localhost:5001/hub') })

const client2 = new Network({ hub: new ManualHub('ws://localhost:5001/hub') })

// ------------------------------------------------------------------
//
// Client 1: Listens on port 5000
//
// ------------------------------------------------------------------

client1.Http.listen({ port: 5000 }, request => new Response('hello webrtc'))

// ------------------------------------------------------------------
//
// Client 2: Fetches data from Client 1
//
// ------------------------------------------------------------------

const remoteAddr = await client1.Hub.address() // get client1's address somehow

const text = await client2.Http.fetch(`http://${remoteAddr}:5000`).then(r => r.text())

console.log({ text }) 