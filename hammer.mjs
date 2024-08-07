// ------------------------------------------------------------------
// Clean
// ------------------------------------------------------------------
export async function clean() {
  await folder('web').delete()
}
// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
export async function start_client() {
  await shell('hammer serve src/client/ --dist web/client')
}

export async function start_server() {
  await shell('hammer run src/server/index.ts --dist web/server')
}
export async function start() {
  await Promise.all([start_client(), start_server()])
}
