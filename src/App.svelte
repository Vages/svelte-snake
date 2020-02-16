<script>
  import { tick, onMount } from "svelte"
  import cssVars from "svelte-css-vars"
  // import { flip } from "svelte/animate"
  // import { linear } from "svelte/easing"

  import HighScores from "./HighScores.svelte"

  import { add, isEqual, DIRECTIONS, isInsideBoard, randomPick } from "./utils"

  // Configuration
  const TICK_TIME = 100
  const CELL_SIZE = 25
  let boardDimensions = { x: 20, y: 20 }

  let innerWidth = 10000
  let innerHeight = 10000

  $: boardDimensions = {
    x: Math.floor(innerWidth / CELL_SIZE) - 5,
    y: Math.floor(innerHeight / CELL_SIZE) - 5,
  }

  // Game state
  let gameOver = false
  let score = 0
  let snakeBody = [
    { x: 4, y: 2 },
    { x: 4, y: 3 },
    { x: 4, y: 4 },
  ]
  let headDirection = "SOUTH"
  let willGrow = false
  let applePosition = { x: 1, y: 1 }

  let headPosition
  $: headPosition = snakeBody[snakeBody.length - 1]
  $: gameOver =
    gameOver ||
    !isInsideBoard(boardDimensions, headPosition) ||
    snakeBody
      .slice(0, snakeBody.length - 1)
      .some(snakeSpace => isEqual(snakeSpace, headPosition))

  // Movement
  let stopTicking = () => {}
  const startTicking = () => {
    const id = setInterval(moveSnake, TICK_TIME)
    stopTicking = () => clearInterval(id)
    return () => clearInterval(id)
  }
  onMount(startTicking)
  $: if (gameOver) {
    stopTicking()
  }

  async function moveSnake() {
    snakeBody = getNextSnakeBody(snakeBody, DIRECTIONS[headDirection], willGrow)
    willGrow = false
  }

  function getNextSnakeBody(theBody, direction, shouldGrow) {
    const headCoordinate = theBody[snakeBody.length - 1]
    const nextHead = add(headCoordinate, direction)
    const withAddedHead = [...theBody, nextHead]

    return shouldGrow ? withAddedHead : withAddedHead.slice(1)
  }

  $: if (isEqual(headPosition, applePosition)) {
    eatApple()
  }

  function eatApple() {
    score += 1
    willGrow = true
    applePosition = getNewApplePosition(boardDimensions, snakeBody)
  }

  function getNewApplePosition(boardDimensions, snakeCoordinates) {
    const boardSpaces = [...Array(boardDimensions.x).keys()].flatMap(x =>
      [...Array(boardDimensions.y).keys()].map(y => ({ x, y })),
    )
    const openSpaces = boardSpaces.filter(
      boardSpace =>
        !snakeCoordinates.some(snakeSpace => isEqual(snakeSpace, boardSpace)),
    )

    return randomPick(openSpaces)
  }

  // User interaction
  async function handleKeydown(event) {
    const newDirectionFromEventKey = getNewDirectionFromEventKey(event.key)

    const neckPosition = snakeBody[snakeBody.length - 2]

    const is180Turn = isEqual(
      neckPosition,
      add(headPosition, DIRECTIONS[newDirectionFromEventKey]),
    )

    if (!is180Turn) {
      headDirection = newDirectionFromEventKey
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
        return headDirection
    }
  }

  // Styling
  function calculatePositionAsStyle(coordinate) {
    return `left: ${coordinate.x * CELL_SIZE}px; top: ${coordinate.y *
      CELL_SIZE}px`
  }

  let styleVars
  $: styleVars = {
    "cell-size": `${CELL_SIZE}px`,
  }

  let darkCells
  $: darkCells = [...Array(boardDimensions.x).keys()]
    .flatMap(x => [...Array(boardDimensions.y).keys()].map(y => ({ x, y })))
    .filter(({ x, y }) => (x + y) % 2)

  // let indexedSnakeBody
  // $: indexedSnakeBody = snakeBody.map((thing, index) => ({ ...thing, index }))
</script>

<style>
  .body-part,
  .dark-cell,
  .apple {
    position: absolute;
    width: var(--cell-size);
    height: var(--cell-size);
    text-align: center;
  }

  .body-part {
    background-color: green;
    /*border-radius: 2rem;*/
  }

  .apple {
    font-size: calc(var(--cell-size) * 0.8);
  }

  .dark-cell {
    background-color: #f0f0f0;
  }

  .board {
    position: relative;
    margin: calc(var(--cell-size) * 2);
    outline: var(--cell-size) solid black;
  }
</style>

<svelte:options immutable={true} />

<svelte:window bind:innerWidth bind:innerHeight />
<svelte:body on:keydown={handleKeydown} />

<div
  use:cssVars={styleVars}
  class="board"
  style="width: {boardDimensions.x * CELL_SIZE}px; height: {boardDimensions.y * CELL_SIZE}px">

  {#each darkCells as cell}
    <div class="dark-cell" style={calculatePositionAsStyle(cell)} />
  {/each}

  {#each snakeBody as bodyPart}
    <div class="body-part" style={calculatePositionAsStyle(bodyPart)} />
  {/each}

  <!--  {#each indexedSnakeBody as bodyPart (bodyPart.index)}-->
  <!--    <div-->
  <!--            animate:flip={{ duration: TICK_TIME - 20, easing: linear }}-->
  <!--            class="body-part"-->
  <!--            style={calculatePositionAsStyle(bodyPart)} />-->
  <!--  {/each}-->

  <div style={calculatePositionAsStyle(applePosition)} class="apple">🍎</div>
</div>

<!--<div>Inner Width: {innerWidth}</div>-->
<!--<div>Inner Heighth: {innerHeight}</div>-->

<!--<div>Head direction: {headDirection}</div>-->
<!--<div>Head position: {JSON.stringify(headPosition)}</div>-->
<!--<div>Score: {score}</div>-->
<!--<div>Game over: {gameOver}</div>-->

<!--<HighScores />-->
