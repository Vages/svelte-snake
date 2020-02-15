<script>
  import { tick, onMount } from "svelte"
  import cssVars from "svelte-css-vars"

  import {
    addCoordinates,
    areSameCoordinate,
    DIRECTIONS,
    isInsideBoard,
    randomPick,
  } from "./utils"

  let gameOver = false
  let score = 0
  const MILLISECONDS_BEFORE_MOVING = 100

  const CELL_SIZE = 25
  let boardDimensions = { x: 40, y: 30 }

  let snakeBody = [
    { x: 4, y: 2 },
    { x: 4, y: 3 },
    { x: 4, y: 4 },
  ]
  let headDirectionAsWords = "SOUTH"
  let isGrowingOnNextMove = false
  let headPosition
  $: headPosition = snakeBody[snakeBody.length - 1]

  $: gameOver =
    gameOver ||
    !isInsideBoard(boardDimensions, headPosition) ||
    snakeBody
      .slice(0, snakeBody.length - 1)
      .some(snakeSpace => areSameCoordinate(snakeSpace, headPosition))

  let applePosition = { x: 1, y: 1 }
  $: if (areSameCoordinate(headPosition, applePosition)) {
    eatApple()
  }

  function eatApple() {
    score += 1
    isGrowingOnNextMove = true
    applePosition = getNewApplePosition()
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

  function getNextSnakeBody(theBody, direction, shouldGrow) {
    const headCoordinate = theBody[snakeBody.length - 1]
    const nextHead = addCoordinates(headCoordinate, direction)
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

    const neckPosition = snakeBody[snakeBody.length - 2]

    const is180Turn = areSameCoordinate(
      neckPosition,
      addCoordinates(headPosition, DIRECTIONS[newDirectionFromEventKey]),
    )

    if (!is180Turn) {
      headDirectionAsWords = newDirectionFromEventKey
    }
  }

  async function moveSnake() {
    snakeBody = getNextSnakeBody(
      snakeBody,
      DIRECTIONS[headDirectionAsWords],
      isGrowingOnNextMove,
    )
    isGrowingOnNextMove = false
  }

  let stopMovement = () => {}

  const startMovement = () => {
    const id = setInterval(moveSnake, MILLISECONDS_BEFORE_MOVING)
    stopMovement = () => clearInterval(id)
    return () => clearInterval(id)
  }

  $: if (gameOver) {
    stopMovement()
  }

  onMount(startMovement)

  function calculatePositionAsStyle(coordinate) {
    return `left: ${coordinate.x * CELL_SIZE}px; top: ${coordinate.y *
      CELL_SIZE}px`
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
