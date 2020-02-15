<script>
  import { tick, onMount } from "svelte"
  import cssVars from "svelte-css-vars"

  const CELL_SIZE = 25
  const MILLISECONDS_BEFORE_MOVING = 100
  let score = 0

  const DIRECTIONS = Object.freeze({
    NORTH: { x: 0, y: -1 },
    SOUTH: { x: 0, y: 1 },
    EAST: { x: 1, y: 0 },
    WEST: { x: -1, y: 0 },
  })

  const OPPOSITES = Object.freeze(
    Object.entries({ NORTH: "SOUTH", EAST: "WEST" }).reduce(
      (accumulator, [k, v]) => ({ ...accumulator, [k]: v, [v]: k }),
      {},
    ),
  )

  let snakeBody = [
    { x: 4, y: 2 },
    { x: 4, y: 3 },
    { x: 4, y: 4 },
  ]

  function areSameCoordinate(coordA, coordB) {
    return coordA.x === coordB.x && coordA.y === coordB.y
  }

  let applePosition = { x: 1, y: 1 }
  let isGrowingOnNextMove = false

  let boardDimensions = { x: 40, y: 30 }

  let headDirectionAsWords = "SOUTH"
  let headDirectionCoordinate
  $: headDirectionCoordinate = DIRECTIONS[headDirectionAsWords]
  let headPosition
  $: headPosition = snakeBody[snakeBody.length - 1]
  let gameOver = false
  $: gameOver =
    gameOver ||
    !isInsideBoard(headPosition) ||
    snakeBody
      .slice(0, snakeBody.length - 1)
      .some(snakeSpace => areSameCoordinate(snakeSpace, headPosition))

  function isInsideBoard(coordinate) {
    return (
      coordinate.x >= 0 &&
      coordinate.x < boardDimensions.x &&
      coordinate.y >= 0 &&
      coordinate.y < boardDimensions.y
    )
  }

  $: if (areSameCoordinate(headPosition, applePosition)) {
    eatApple()
  }

  function calculatePositionAsStyle(coordinate) {
    return `left: ${coordinate.x * CELL_SIZE}px; top: ${coordinate.y *
      CELL_SIZE}px`
  }

  function getNextSnakeBody(theBody, direction, shouldGrow) {
    const headCoordinate = theBody[snakeBody.length - 1]
    const nextHead = {
      x: headCoordinate.x + direction.x,
      y: headCoordinate.y + direction.y,
    }
    const withAddedHead = [...theBody, nextHead]

    return shouldGrow ? withAddedHead : withAddedHead.slice(1)
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
        return headDirectionAsWords
    }
  }

  async function handleKeydown(event) {
    const newDirectionFromEventKey = getNewDirectionFromEventKey(event.key)

    if (newDirectionFromEventKey !== OPPOSITES[headDirectionAsWords]) {
      headDirectionAsWords = newDirectionFromEventKey
    }
  }

  async function moveSnake() {
    snakeBody = getNextSnakeBody(
      snakeBody,
      headDirectionCoordinate,
      isGrowingOnNextMove,
    )
    isGrowingOnNextMove = false
  }

  function randomPick(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  function getNewApplePosition() {
    const boardSpaces = [...Array(boardDimensions.x).keys()].flatMap(x =>
      [...Array(boardDimensions.y).keys()].map(y => ({ x, y })),
    )
    const openSpaces = boardSpaces.filter(
      boardSpace =>
        !snakeBody.some(snakeSpace =>
          areSameCoordinate(snakeSpace, boardSpace),
        ),
    )

    return randomPick(openSpaces)
  }

  function eatApple() {
    score = score + 1
    isGrowingOnNextMove = true
    applePosition = getNewApplePosition()

    // TODO 2020-02-15 (Eirik V.): increment score and select new apple
  }

  let stopMovement

  onMount(() => {
    const id = setInterval(moveSnake, MILLISECONDS_BEFORE_MOVING)
    stopMovement = () => clearInterval(id)
    return () => clearInterval(id)
  })

  $: if (gameOver) {
    stopMovement()
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
    font-size: calc(var(--cell-size) * 0.8);
  }

  .board {
    position: relative;
    margin: 1rem;
    outline: 10px solid black;
  }
</style>

<svelte:options immutable={true} />

<svelte:body on:keydown={handleKeydown} />

<div
  use:cssVars={styleVars}
  class="board"
  style="width: {boardDimensions.x * CELL_SIZE}px; height: {boardDimensions.y * CELL_SIZE}px">

  {#each snakeBody as bodyPart}
    <div class="body-part" style={calculatePositionAsStyle(bodyPart)} />
  {/each}

  <div style={calculatePositionAsStyle(applePosition)} class="apple">🍎</div>
</div>

<div>Head direction: {headDirectionAsWords}</div>
<div>Head position: {JSON.stringify(headPosition)}</div>
<div>Score: {score}</div>
<div>Game over: {gameOver}</div>
