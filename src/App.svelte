<script>
  import { tick } from "svelte"
  import cssVars from "svelte-css-vars"

  const CELL_SIZE = 60

  const DIRECTIONS = Object.freeze({
    NORTH: { x: 0, y: -1 },
    SOUTH: { x: 0, y: 1 },
    EAST: { x: 1, y: 0 },
    WEST: { x: -1, y: 0 },
  })

  let snake_body = [
    { x: 4, y: 4 },
    { x: 4, y: 3 },
    { x: 4, y: 2 },
  ]

  let head_direction_as_words = "WEST"
  let head_direction_coordinate
  $: head_direction_coordinate = DIRECTIONS[head_direction_as_words]

  function calculatePositionAsStyle(coordinate) {
    return `left: ${coordinate.x * CELL_SIZE}px; top: ${coordinate.y *
      CELL_SIZE}px`
  }

  function getNextSnakeBody(the_body, direction) {
    const head_coordinate = the_body[snake_body.length - 1]
    const next_head = {
      x: head_coordinate.x + direction.x,
      y: head_coordinate.y + direction.y,
    }
    return [...the_body.slice(1), next_head]
  }

  function getNewDirectionFromEventKey(key) {
    switch (key) {
      case "ArrowUp":
        return "NORTH"
      case "ArrowDown":
        return "SOUTH"
      case "ArrowLeft":
        return "WEST"
      case "ArrowRight":
        return "EAST"
      default:
        return head_direction_as_words
    }
  }

  async function handleKeydown(event) {
    head_direction_as_words = getNewDirectionFromEventKey(event.key)
    // TODO 2020-02-15 (Eirik V.): Make a task that
    await tick()
    moveSnake()
  }

  function moveSnake() {
    snake_body = getNextSnakeBody(snake_body, head_direction_coordinate)
  }

  function eatApple() {
    // TODO 2020-02-15 (Eirik V.): increment score and select new apple
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
    position: relative;
    margin: 10rem;
    outline: 10px solid black;
  }
</style>

<svelte:options immutable={true} />

<svelte:body on:keydown={handleKeydown} />

<div
  use:cssVars={styleVars}
  class="board"
  style="width: {board_dimensions.x * CELL_SIZE}px; height: {board_dimensions.y * CELL_SIZE}px">

  {#each snake_body as body_part}
    <div class="body-part" style={calculatePositionAsStyle(body_part)} />
  {/each}

  <div style={calculatePositionAsStyle(apple_position)} class="apple">🍎</div>
</div>

<div>Head direction: {head_direction_as_words}</div>
