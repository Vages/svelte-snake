<script>
  import { onMount } from "svelte"
  export let score
  let name = "Nico"

  let highScorePromise

  function fetchHighScores() {
    highScorePromise = fetch("/api/scores")
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText)
        }
        return res.json()
      })
      .then(j => j.scores)
  }

  async function sendHighScore() {
    await fetch("/api/scores", { method: "POST", body: { name, score } })
    await fetchHighScores()
  }

  onMount(fetchHighScores)
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
  {#await highScorePromise}
    <p>Fetching scores</p>
  {:then highScores}
    <div>
      <div class="nes-table-responsive">
        <table class="nes-table is-bordered is-centered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {#each highScores || [] as entry}
              <tr>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {:catch error}
    Got error "{error.message}"
    <button class="nes-btn" on:click={fetchHighScores}>Retry</button>
  {/await}
  <h2>Results</h2>
  <div>You got {score} points.</div>
  <label class="nes-field">
    Name
    <input id="name_field" type="text" class="nes-input" bind:value={name} />
  </label>
  <button class="nes-btn" on:click={sendHighScore}>Submit</button>
</div>
