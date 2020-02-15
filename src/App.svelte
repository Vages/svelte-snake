<script>
  import cssVars from "svelte-css-vars"

  const CELL_SIZE = 60

  let snake_body = [
    { x: 4, y: 4 },
    { x: 4, y: 3 },
    { x: 4, y: 2 },
  ]

  function calculatePositionAsStyle(coordinate) {
    return `left: ${coordinate.x * CELL_SIZE}px; top: ${coordinate.y *
      CELL_SIZE}px`
  }

  let apple_position = { x: 1, y: 1 }

  let board_dimensions = { x: 5, y: 5 }

  let styleVars
  $: styleVars = {
    "cell-size": `${CELL_SIZE}px`,
  }
</script>

<style>
  .body-part,
  .apple {
    position: absolute;
    width: var(--cell-size);
    height: var(--cell-size);
    text-align: center;
  }

  .body-part {
    background-color: green;
  }

  .apple {
    font-size: 48px;
  }

  .board {
    outline: 10px solid black;
  }
</style>

<div
  use:cssVars={styleVars}
  class="board"
  style="width: {board_dimensions.x * CELL_SIZE}px; height: {board_dimensions.y * CELL_SIZE}px">

  {#each snake_body as body_part}
    <div class="body-part" style={calculatePositionAsStyle(body_part)} />
  {/each}

  <div style={calculatePositionAsStyle(apple_position)} class="apple">🍎</div>
</div>
