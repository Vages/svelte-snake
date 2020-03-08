<script>
  import { onDestroy } from "svelte"
  import { fly } from "svelte/transition"

  import Board from "./Board.svelte"
  import GameOverModal from "./GameOverModal.svelte"
  import {
    DIRECTIONS,
    getNewApplePosition,
    getNextSnakeBody,
    is180Turn,
    isEqual,
    isInsideBoard,
    isSnakeEatingItself,
  } from "./utils"
  import NesContainer from "./NesContainer.svelte"
  import StartModal from "./StartModal.svelte"

  const TICK_TIME = 100
  const BOARD_DIMENSIONS = { x: 20, y: 20 }

  const GAME_STATES = {
    START_SCREEN: "START_SCREEN",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    GAME_OVER: "GAME_OVER",
  }

  const INITIAL_GAME_STATE = GAME_STATES.START_SCREEN,
    INITIAL_HEAD_DIRECTION = "SOUTH",
    INITIAL_SCORE = 0,
    INITIAL_SNAKE = [
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 4, y: 2 },
    ],
    INITIAL_WILL_GROW = false

  let snake = INITIAL_SNAKE,
    apple = getNewApplePosition(BOARD_DIMENSIONS, snake),
    gameState = INITIAL_GAME_STATE,
    headDirection = INITIAL_HEAD_DIRECTION,
    score = INITIAL_SCORE,
    willGrow = false

  $: if (
    snake &&
    (!isInsideBoard(BOARD_DIMENSIONS, snake[0]) || isSnakeEatingItself(snake))
  ) {
    gameState = GAME_STATES.GAME_OVER
  }

  let stopTicking = () => {}
  const startTicking = () => {
    const id = setInterval(moveSnake, TICK_TIME)
    stopTicking = () => clearInterval(id)
    return () => clearInterval(id)
  }

  function moveSnake() {
    snake = getNextSnakeBody(snake, DIRECTIONS[headDirection], willGrow)
    willGrow = false
  }

  $: if (snake && apple && isEqual(snake[0], apple)) {
    eatApple()
  }

  function eatApple() {
    score += 1
    willGrow = true
    apple = getNewApplePosition(BOARD_DIMENSIONS, snake)
  }

  function handleKeydown(event) {
    if (gameState === GAME_STATES.START_SCREEN) {
      gameState = GAME_STATES.PLAYING
      return
    }
    if (gameState === GAME_STATES.PAUSED) {
      if (event.key === " ") {
        gameState = GAME_STATES.PLAYING
      }
      return
    }
    if (gameState === GAME_STATES.PLAYING) {
      if (event.key === " ") {
        gameState = GAME_STATES.PAUSED
      }
      const keyDirection = getNewDirectionFromEventKey(event.key)
      if (!keyDirection) {
        return
      }

      if (!is180Turn(snake, keyDirection)) {
        headDirection = keyDirection
      }
    }
  }

  function getNewDirectionFromEventKey(key) {
    // Also contains a secret Dvorak mode
    switch (key) {
      case "ArrowUp":
      case "w":
      case ",":
        return "NORTH"
      case "ArrowDown":
      case "s":
      case "o":
        return "SOUTH"
      case "ArrowLeft":
      case "a":
        return "WEST"
      case "ArrowRight":
      case "d":
      case "e":
        return "EAST"
      default:
        return null
    }
  }

  function resetGame() {
    headDirection = INITIAL_HEAD_DIRECTION
    score = INITIAL_SCORE
    snake = INITIAL_SNAKE
    apple = getNewApplePosition(BOARD_DIMENSIONS, snake)
    willGrow = INITIAL_WILL_GROW
  }

  $: if (gameState === GAME_STATES.START_SCREEN) {
    resetGame()
  } else if (gameState === GAME_STATES.PLAYING) {
    startTicking()
  } else if (gameState === GAME_STATES.PAUSED) {
    stopTicking()
  } else if (gameState === GAME_STATES.GAME_OVER) {
    stopTicking()
  }

  onDestroy(stopTicking)
</script>

<style>
  .modal-container {
    position: absolute;
    left: 50%;
    top: 2rem;
  }

  .min-width {
    width: min-content;
  }

  .main-content {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
</style>

<svelte:options immutable={true} />

<svelte:body on:keydown={handleKeydown} />

<div class="main-content min-width">
  <div>{score}</div>

  <Board
    {snake}
    {apple}
    gameOver={gameState === GAME_STATES.GAME_OVER}
    boardDimensions={BOARD_DIMENSIONS}
    {score}
    tickTime={TICK_TIME} />
</div>

{#if gameState === GAME_STATES.START_SCREEN}
  <div class="modal-container" out:fly={{ y: -100 }}>
    <!-- This div, together with the class modal-container is required to center the content -->
    <div style="position: relative; left: -50%;">
      <StartModal />
    </div>
  </div>
{/if}

{#if gameState === GAME_STATES.PAUSED}
  <div class="modal-container" transition:fly={{ y: -100 }}>
    <!-- This div, together with the class modal-container is required to center the content -->
    <div style="position: relative; left: -50%;">
      <NesContainer>
        <h2>Pause</h2>
        Space to resume
      </NesContainer>
    </div>
  </div>
{/if}

{#if gameState === GAME_STATES.GAME_OVER}
  <div class="modal-container" in:fly={{ delay: 1300, y: -100 }}>
    <!-- This div, together with the class modal-container is required to center the content -->
    <div style="position: relative; left: -50%;">
      <GameOverModal
        on:close_modal={() => (gameState = GAME_STATES.START_SCREEN)}
        {score} />
    </div>
  </div>
{/if}
