export function areSameCoordinate(coordA, coordB) {
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

export function addCoordinates(coordA, coordB) {
  return { x: coordA.x + coordB.x, y: coordA.y + coordB.y }
}

export function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export const DIRECTIONS = Object.freeze({
  NORTH: { x: 0, y: -1 },
  SOUTH: { x: 0, y: 1 },
  EAST: { x: 1, y: 0 },
  WEST: { x: -1, y: 0 },
})
