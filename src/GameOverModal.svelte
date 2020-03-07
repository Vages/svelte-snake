<script>
  import { onMount } from "svelte"
  import * as api from "./api"
  export let score
  let name = ""

  let getPromise
  let postPromise

  function fetchScores() {
    getPromise = api.fetchScores().then(j => j.scores)
  }

  function postScore() {
    postPromise = api.postScore({ name, score }).then(() => fetchScores())
  }

  onMount(fetchScores)
</script>

<style>
  .modal {
    background-color: white;
    padding: 3rem;
  }
</style>

<div class="modal nes-container with-title is-rounded">
  <h2 class="title">Game over</h2>
  <h3>High scores</h3>
  {#await getPromise}
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
    <span class="nes-text is-error">Got error "{error.message}"</span>
    <button class="nes-btn" on:click={fetchScores}>Retry</button>
  {/await}
  <h3>Submit score</h3>
  {#if !postPromise}
    <div>You got {score} points.</div>
    <form on:submit={postScore}>
      <div>
        <label class="nes-field">
          Name
          <input
            minlength="3"
            required
            type="text"
            class="nes-input"
            bind:value={name} />
        </label>
      </div>
      <button type="submit" class="nes-btn">Submit</button>
    </form>
  {:else}
    {#await postPromise}
      <p>Submitting</p>
    {:then success}
      <div class="nes-text is-success">Successfully submitted!</div>
    {:catch error}
      <span class="nes-text is-error">Got error "{error.message}"</span>
      <button class="nes-btn" on:click={postScore}>Retry</button>
    {/await}
  {/if}
</div>
