<script>
  import { onDestroy } from "svelte"
  import { fly } from "svelte/transition"

  import Board from "./Board.svelte"
  import GameOverModal from "./GameOverModal.svelte"
  import {
    DIRECTION_VECTORS,
    getNewApplePosition,
    getNewDirectionFromEventKey,
    getNextSnake,
    is180Turn,
    isEqual,
    isInsideBoard,
    isSnakeEatingItself,
  } from "./utils"
  import NesContainer from "./NesContainer.svelte"
  import StartModal from "./StartModal.svelte"

  const TICK_TIME = 100
  const BOARD_DIMENSIONS = { x: 20, y: 20 }

  const GAME_STATES = Object.freeze({
    START_SCREEN: "START_SCREEN",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    GAME_OVER: "GAME_OVER",
  })

  // Letting the state variables go uninitialized is safe,
  // because they are initialized by resetGame before they are ever read
  let apple, gameState, headDirection, score, snake, willGrow
  function resetGame() {
    const initialSnake = [
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 4, y: 2 },
    ]
    apple = getNewApplePosition(BOARD_DIMENSIONS, initialSnake)
    gameState = GAME_STATES.START_SCREEN
    headDirection = "SOUTH"
    score = 0
    snake = initialSnake
    willGrow = false
  }
  resetGame()

  // Snake logic
  function moveSnake() {
    snake = getNextSnake(snake, DIRECTION_VECTORS[headDirection], willGrow)
    willGrow = false
  }

  $: if (
    !isInsideBoard(BOARD_DIMENSIONS, snake[0]) ||
    isSnakeEatingItself(snake)
  ) {
    gameState = GAME_STATES.GAME_OVER
  }

  // Apple logic
  $: if (isEqual(snake[0], apple)) {
    eatApple()
  }

  function eatApple() {
    score += 1
    willGrow = true
    apple = getNewApplePosition(BOARD_DIMENSIONS, snake)
  }

  // User interaction
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

  // Starting and stopping gameplay
  let stopTicking = () => {}
  const startTicking = () => {
    const id = setInterval(moveSnake, TICK_TIME)
    stopTicking = () => clearInterval(id)
    return () => clearInterval(id)
  }

  // Reacting to changed states
  $: handleStateChange(gameState)
  // Extracting it as a separate function to avoid it being called when variables other than gameState
  // are reassigned, namely stopTicking, which is reassigned on startTicking
  function handleStateChange(newState) {
    if (newState === GAME_STATES.START_SCREEN) {
      resetGame()
    } else if (newState === GAME_STATES.PLAYING) {
      startTicking()
    } else if (newState === GAME_STATES.PAUSED) {
      stopTicking()
    } else if (newState === GAME_STATES.GAME_OVER) {
      stopTicking()
    }
  }

  // Stop calling functions in intervals when the functions stop existing (i.e. when the component unmounts)
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
    margin: 1rem auto 0 auto;
    display: grid;
    grid-template-columns: auto;
    gap: 2rem;
    align-items: center;
    text-align: center;
  }

  .score {
    justify-self: right;
  }
  .signature {
    font-size: 0.5rem;
  }

  .signature img {
    height: 2em;
    margin-right: -0.5em;
    margin-top: -0.25em;
  }
</style>

<svelte:options immutable={true} />

<svelte:body on:keydown={handleKeydown} />

<div class="main-content min-width">
  <div class="score">{score}</div>

  <Board
    {snake}
    {apple}
    gameOver={gameState === GAME_STATES.GAME_OVER}
    boardDimensions={BOARD_DIMENSIONS}
    {score}
    tickTime={TICK_TIME} />
  <div class="signature">
    <p>
      Made with
      <a href="https://svelte.dev/">
        <img alt="Svelte logo" src="/svelte.png" />
        Svelte
      </a>
      by
      <a href="https://github.com/vages">Eirik Vågeskar</a>
    </p>
    <p>
      Find
      <a href="https://github.com/Vages/svelte-snake">the code on Github</a>
    </p>
  </div>
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
