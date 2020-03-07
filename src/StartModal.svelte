<script>
  import { createEventDispatcher } from "svelte"
  import NesContainer from "./NesContainer.svelte"

  const dispatch = createEventDispatcher()
</script>

<style>
  h2 {
    font-size: 1.25rem;
  }

  div {
    margin: 3rem 0;
  }
</style>

<svelte:body on:keydown={() => dispatch('start')} />

<NesContainer>
  <h1>Snake</h1>
  <div>
    <p>Eat 🍎, not yourself</p>
    <p>Don't crash</p>
  </div>
  <div>
    <p>WASD and arrow keys change direction</p>
    <p>Space pauses</p>
  </div>
  <p>
    <strong>Any key to start</strong>
  </p>
</NesContainer>
