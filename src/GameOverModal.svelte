<script>
  import { fly } from "svelte/transition"
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
  div {
    font-family: "Comic Sans MS", serif;
  }

  .modal {
    position: absolute;
    top: 40px;
    left: 40px;
    background-color: red;
    padding: 3rem;
  }
</style>

<div transition:fly={{ delay: 400, y: -100 }} class="modal">
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
