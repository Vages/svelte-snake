export const DIRECTIONS = Object.freeze({
  NORTH: "NORTH",
  SOUTH: "SOUTH",
  EAST: "EAST",
  WEST: "WEST",
})

export const DIRECTION_VECTORS = Object.freeze({
  [DIRECTIONS.NORTH]: { x: 0, y: -1 },
  [DIRECTIONS.SOUTH]: { x: 0, y: 1 },
  [DIRECTIONS.EAST]: { x: 1, y: 0 },
  [DIRECTIONS.WEST]: { x: -1, y: 0 },
})

export function add(coordinateA, coordinateB) {
  return { x: coordinateA.x + coordinateB.x, y: coordinateA.y + coordinateB.y }
}

export function isEqual(coordinateA, coordinateB) {
  return coordinateA.x === coordinateB.x && coordinateA.y === coordinateB.y
}

export function isInsideBoard(boardDimensions, coordinate) {
  return (
    coordinate.x >= 0 &&
    coordinate.x < boardDimensions.x &&
    coordinate.y >= 0 &&
    coordinate.y < boardDimensions.y
  )
}

export function getNextSnake(snake, direction, shouldGrow) {
  const headCoordinate = snake[0]
  const nextHead = add(headCoordinate, direction)
  const withAddedHead = [nextHead, ...snake]

  return shouldGrow
    ? withAddedHead
    : withAddedHead.slice(0, withAddedHead.length - 1)
}

export function getNewApplePosition(boardDimensions, snakeCoordinates) {
  const boardSpaces = [...Array(boardDimensions.x).keys()].flatMap(x =>
    [...Array(boardDimensions.y).keys()].map(y => ({ x, y })),
  )
  const openSpaces = boardSpaces.filter(
    boardSpace =>
      !snakeCoordinates.some(snakeSpace => isEqual(snakeSpace, boardSpace)),
  )

  return openSpaces[Math.floor(Math.random() * openSpaces.length)]
}

export function isSnakeEatingItself(snake) {
  const headPosition = snake[0]
  return snake.slice(1).some(snakeSpace => isEqual(snakeSpace, headPosition))
}

export function is180Turn(snake, newDirectionFromEventKey) {
  const head = snake[0]
  const neck = snake[1]
  const headWouldEatNeck = isEqual(
    add(head, DIRECTION_VECTORS[newDirectionFromEventKey]),
    neck,
  )
  return headWouldEatNeck
}

export function getNewDirectionFromEventKey(key) {
  // Also contains a secret Dvorak mode
  switch (key) {
    case "ArrowUp":
    case "w":
    case ",":
      return DIRECTIONS.NORTH
    case "ArrowDown":
    case "s":
    case "o":
      return DIRECTIONS.SOUTH
    case "ArrowLeft":
    case "a":
      return DIRECTIONS.WEST
    case "ArrowRight":
    case "d":
    case "e":
      return DIRECTIONS.EAST
    default:
      return null
  }
}
