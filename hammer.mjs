// ------------------------------------------------------------------
// Clean
// ------------------------------------------------------------------
export async function clean() {
  await folder('target').delete()
}
// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
export async function start_client() {
  await shell('hammer serve example/client/ --dist target/client')
}

export async function start_server() {
  await shell('hammer run example/server/index.ts --dist target/server')
}
export async function start() {
  await Promise.all([start_client(), start_server()])
}