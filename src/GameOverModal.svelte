<script>
  import { fly } from "svelte/transition"
  export let score
  let name = "Nico"
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
  <div>Game over! Du fikk {score} poeng.</div>
  <div>Skriv inn navnet ditt og post det til high-score-listen</div>
  <input bind:value={name} />
  <button>Send inn</button>
</div>
