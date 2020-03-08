export function isEqual(coordA, coordB) {
  return coordA.x === coordB.x && coordA.y === coordB.y
}

export function isInsideBoard(boardDimensions, coordinate) {
  return (
    coordinate.x >= 0 &&
    coordinate.x < boardDimensions.x &&
    coordinate.y >= 0 &&
    coordinate.y < boardDimensions.y
  )
}

export function add(coordA, coordB) {
  return { x: coordA.x + coordB.x, y: coordA.y + coordB.y }
}

function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export const DIRECTIONS = Object.freeze({
  NORTH: { x: 0, y: -1 },
  SOUTH: { x: 0, y: 1 },
  EAST: { x: 1, y: 0 },
  WEST: { x: -1, y: 0 },
})

export function getNextSnakeBody(theBody, direction, shouldGrow) {
  const headCoordinate = theBody[0]
  const nextHead = add(headCoordinate, direction)
  const withAddedHead = [nextHead, ...theBody]

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

  return randomPick(openSpaces)
}

export function isSnakeEatingItself(snake) {
  const headPosition = snake[0]
  return snake.slice(1).some(snakeSpace => isEqual(snakeSpace, headPosition))
}

export function is180Turn(snake, newDirectionFromEventKey) {
  const neck = snake[1]
  const head = snake[0]
  const headWouldEatNeck = isEqual(
    neck,
    add(head, DIRECTIONS[newDirectionFromEventKey]),
  )
  return headWouldEatNeck
}

export function getNewDirectionFromEventKey(key) {
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
