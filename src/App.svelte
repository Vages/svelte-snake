<script>
  import { tick } from "svelte"
  import cssVars from "svelte-css-vars"

  const CELL_SIZE = 60
  let score = 0

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

  function areSameCoordinate(coordA, coordB) {
    return coordA.x === coordB.x && coordA.y === coordB.y
  }

  let apple_position = { x: 1, y: 1 }
  let is_growing_on_next_move = false

  let board_dimensions = { x: 5, y: 5 }

  let head_direction_as_words = "WEST"
  let head_direction_coordinate
  $: head_direction_coordinate = DIRECTIONS[head_direction_as_words]
  let head_position
  $: head_position = snake_body[snake_body.length - 1]

  $: if (areSameCoordinate(head_position, apple_position)) {
    eatApple()
  }

  function calculatePositionAsStyle(coordinate) {
    return `left: ${coordinate.x * CELL_SIZE}px; top: ${coordinate.y *
      CELL_SIZE}px`
  }

  function getNextSnakeBody(the_body, direction, shouldGrow) {
    const head_coordinate = the_body[snake_body.length - 1]
    const next_head = {
      x: head_coordinate.x + direction.x,
      y: head_coordinate.y + direction.y,
    }
    let withAddedHead = [...the_body, next_head]

    return {
      new_body: shouldGrow ? withAddedHead : withAddedHead.slice(1),
      new_growing: false,
    }
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
    const { new_body, new_is_growing } = getNextSnakeBody(
      snake_body,
      head_direction_coordinate,
      is_growing_on_next_move,
    )

    snake_body = new_body
    is_growing_on_next_move = new_is_growing
  }

  function randomPick(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  function getNewApplePosition() {
    const board_spaces = [...Array(board_dimensions.x).keys()].flatMap(x =>
      [...Array(board_dimensions.y).keys()].map(y => ({ x, y })),
    )
    const open_spaces = board_spaces.filter(
      board_space =>
        !snake_body.some(snake_space =>
          areSameCoordinate(snake_space, board_space),
        ),
    )

    return randomPick(open_spaces)
  }

  function eatApple() {
    score = score + 1
    is_growing_on_next_move = true
    apple_position = getNewApplePosition()

    // TODO 2020-02-15 (Eirik V.): increment score and select new apple
  }

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
<score>Score: {score}</score>
