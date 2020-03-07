<script>
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"

  import Board from "./Board.svelte"
  import GameOverModal from "./GameOverModal.svelte"
  import {
    add,
    DIRECTIONS,
    getNewApplePosition,
    getNextSnakeBody,
    isEqual,
    isInsideBoard,
    isSnakeEatingItself,
  } from "./utils"

  const TICK_TIME = 100
  const BOARD_DIMENSIONS = { x: 20, y: 20 }

  let gameOver = false
  let score = 0
  let snake = [
    { x: 4, y: 4 },
    { x: 4, y: 3 },
    { x: 4, y: 2 },
  ]
  let headDirection = "SOUTH"
  let willGrow = false
  let apple = { x: 1, y: 1 }

  let headPosition
  $: headPosition = snake[0]
  $: gameOver =
    !isInsideBoard(BOARD_DIMENSIONS, headPosition) || isSnakeEatingItself(snake)

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

  function moveSnake() {
    snake = getNextSnakeBody(snake, DIRECTIONS[headDirection], willGrow)
    willGrow = false
  }

  $: if (isEqual(headPosition, apple)) {
    eatApple()
  }

  function eatApple() {
    score += 1
    willGrow = true
    apple = getNewApplePosition(BOARD_DIMENSIONS, snake)
  }

  function handleKeydown(event) {
    const newDirectionFromEventKey = getNewDirectionFromEventKey(event.key)

    const neckPosition = snake[1]

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
</script>

<style>
  .modalContainer {
    position: absolute;
    top: 40px;
    left: 40px;
  }
</style>

<svelte:options immutable={true} />

<svelte:body on:keydown={handleKeydown} />

<div>Score: {score}</div>

<Board
  {snake}
  {apple}
  {gameOver}
  boardDimensions={BOARD_DIMENSIONS}
  {score}
  tickTime={TICK_TIME} />

{#if gameOver}
  <div class="modalContainer" transition:fly={{ delay: 1300, y: -100 }}>
    <GameOverModal {score} />
  </div>
{/if}
