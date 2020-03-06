import App from "./App.svelte"
import { makeServer } from "./server"

makeServer()

var app = new App({
  target: document.body,
})

export default app
