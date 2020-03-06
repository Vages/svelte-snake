<script>
  import { onMount } from "svelte"
  export let score
  let name = "Nico"

  let scores = []

  onMount(fetchHighScores)

  async function fetchHighScores() {
    const res = await fetch("/api/scores")
    const json = await res.json()
    scores = json.scores
  }

  async function sendHighScore() {
    await fetch("/api/scores", { method: "POST", body: { name, score } })
    await fetchHighScores()
  }
</script>

<style>
  .modal {
    background-color: red;
    padding: 3rem;
  }
</style>

<div class="modal">
  <h1>Game over</h1>
  <div>Du fikk {score} poeng.</div>
  <h2>High scores</h2>
  {#each scores as user}
    <div>{user.name} {user.score}</div>
  {/each}
  <h2>Send inn</h2>
  <div>Skriv inn navnet ditt</div>
  <input bind:value={name} />
  <button on:click={sendHighScore}>Send inn</button>
</div>
