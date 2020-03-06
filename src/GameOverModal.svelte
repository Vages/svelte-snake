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
    background-color: white;
    padding: 3rem;
  }
</style>

<div class="modal nes-container with-title is-rounded">
  <h1 class="title">Game over</h1>
  <h2>High scores</h2>
  <div class="nes-table-responsive">
    <table class="nes-table is-bordered is-centered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {#each scores as user}
          <tr>
            <td>{user.name}</td>
            <td>{user.score}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <h2>Results</h2>
  <div>You got {score} points.</div>
  <label class="nes-field">
    Name
    <input id="name_field" type="text" class="nes-input" bind:value={name} />
  </label>
  <button class="nes-btn" on:click={sendHighScore}>Submit</button>
</div>
