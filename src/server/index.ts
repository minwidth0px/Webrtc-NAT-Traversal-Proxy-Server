import { Host } from '@sidewinder/server'
import { SmokeHubService } from './hub.js'



async function start(options: { port: number }) {
  
  const host = new Host({ })
  
  host.use('/hub', new SmokeHubService())
  
  await host.listen(options.port)

  console.log(`Listening on port ${options.port}`)

  //sconst a = await import('../client/index2.mts')
  //a.startServer()
}

start({ port: 5001 })

