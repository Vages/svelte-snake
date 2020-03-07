<script>
  export let apple
  export let boardDimensions
  export let gameOver
  export let snake
  export let score
  export let tickTime

  import cssVars from "svelte-css-vars"
  import { scale } from "svelte/transition"

  const CELL_SIZE = 25

  // Styling
  function calculatePositionAsStyle(coordinate) {
    return `left: ${coordinate.x * CELL_SIZE}px; top: ${coordinate.y *
      CELL_SIZE}px`
  }

  let styleVars
  $: styleVars = {
    "cell-size": `${CELL_SIZE}px`,
    "tick-time": `${tickTime}ms`,
  }
</script>

<style>
  :root {
    --checker-color: #f0f0f0;
  }

  .body-part,
  .skull,
  .apple {
    position: absolute;
    width: var(--cell-size);
    height: var(--cell-size);
    text-align: center;
    line-height: 1;
  }

  .body-part {
    background-color: green;
  }

  .head,
  .tail {
    transition: top var(--tick-time) linear, left var(--tick-time) linear;
  }

  .apple::before {
    content: "🍎";
    font-size: calc(var(--cell-size) * 0.8);
  }

  .skull::before {
    content: "☠️";
    overflow: hidden;
  }

  .skull {
    /* Transform cannot be applied to a before element */
    transform: scale(3, 3) translateY(4px);
    transform-origin: 50% 50%;
  }

  .board {
    position: relative;
    margin: calc(var(--cell-size) * 2);
    outline: var(--cell-size) solid black;

    background-image: linear-gradient(
        45deg,
        var(--checker-color) 25%,
        transparent 25%
      ),
      linear-gradient(-45deg, var(--checker-color) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--checker-color) 75%),
      linear-gradient(-45deg, transparent 75%, var(--checker-color) 75%);
    background-size: calc(var(--cell-size) * 2) calc(var(--cell-size) * 2);
    background-position: 0 0, 0 var(--cell-size),
      var(--cell-size) calc(-1 * var(--cell-size)),
      calc(-1 * var(--cell-size)) 0;
  }
</style>

<div
  use:cssVars={styleVars}
  class="board"
  style="width: {boardDimensions.x * CELL_SIZE}px; height: {boardDimensions.y * CELL_SIZE}px">

  <div class="body-part head" style={calculatePositionAsStyle(snake[0])} />
  {#each snake.slice(1) as bodyPart}
    <div class="body-part" style={calculatePositionAsStyle(bodyPart)} />
  {/each}
  <div
    class="body-part tail"
    style={calculatePositionAsStyle(snake[snake.length - 1])} />
  <!-- This extra tail is added to compensate for tail flickering in Chrome and Safari -->
  <div
    class="body-part tail"
    style={calculatePositionAsStyle(snake[snake.length - 2])} />

  <!--  We use two alternating apples in order to animate re-appearance on the board -->
  {#if score % 2}
    <div in:scale style={calculatePositionAsStyle(apple)} class="apple" />
  {:else}
    <div in:scale style={calculatePositionAsStyle(apple)} class="apple" />
  {/if}

  {#if gameOver}
    <div
      transition:scale={{ delay: 300 }}
      style={calculatePositionAsStyle(snake[0])}
      class="skull" />
  {/if}
</div>
