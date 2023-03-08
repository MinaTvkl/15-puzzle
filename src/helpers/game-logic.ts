import { COLUMNS, ROWS, TILE_COUNT } from '../constants'

type Coordinate = { x: number, y: number }
type Axis = { horizontal: boolean, vertical: boolean }

export function indexToCoordinates(position: number): Coordinate {
    const x = position % COLUMNS
    const y = Math.floor(position / COLUMNS)
    return { x, y }
}

export function isMoveAllowed(clickedTileCoord: Coordinate, emptyTileCoord: Coordinate): boolean {
    if (clickedTileCoord.x !== emptyTileCoord.x && clickedTileCoord.y !== emptyTileCoord.y) {
        return false
    }
    else {
        return true
    }
}

export function moveAxis(clickedTileCoord: Coordinate, emptyTileCoord: Coordinate): Axis {
    if (clickedTileCoord.y === emptyTileCoord.y) {
        return { horizontal: true, vertical: false }
    }
    else {
        return { horizontal: false, vertical: true }
    }
}

export function moveDistance(clickedTileCoord: Coordinate, emptyTileCoord: Coordinate, axis: Axis): number {
    if (axis.horizontal) {
        return clickedTileCoord.x - emptyTileCoord.x
    }
    else {
        return clickedTileCoord.y - emptyTileCoord.y
    }
}

//note that when going from 2d to 1d x & y reverse???
export function positionCalculator(coord: Coordinate): number {
    const index = coord.y * COLUMNS + coord.x;
    return index
}


export function tileMover(emptyTileIndex: number, arr: number[], distance: number, axis: Axis): number[] {
    const direction = Math.sign(distance)
    if (axis.vertical) {
        for (let i = 1; i <= Math.abs(distance); i++) {
            [arr[emptyTileIndex], arr[emptyTileIndex + COLUMNS * direction]] = [arr[emptyTileIndex + COLUMNS * direction], arr[emptyTileIndex]]
            emptyTileIndex += COLUMNS * direction
        }
    }
    if (axis.horizontal) {
        for (let i = 1; i <= Math.abs(distance); i++) {
            [arr[emptyTileIndex], arr[emptyTileIndex + direction]] = [arr[emptyTileIndex + direction], arr[emptyTileIndex]]
            emptyTileIndex += direction
        }
    }
    return arr
}

export function isSolvable(boardArray: number[]): boolean {
    let count = 0
    for (let i = 0; i < (ROWS * COLUMNS - 1); i++) {
        for (let j = i + 1; j < ROWS * COLUMNS; j++) {
            if ((boardArray[j] && boardArray[i] && boardArray[i]) > boardArray[j]) {
                count += 1
            }
        }
    }
    console.log('this is count', count)
    return count % 2 == 0
}

export function isSolved(boardArray: number[]): boolean {
    for (let i = 1; i <= (boardArray.length - 1); i++) {
        if (i !== boardArray[i - 1]) {
            return false
        }
    }
    return true
}

export function shuffleArray(boardArray: number[]): number[] {
    const shuffledBoard = Array.from({ length: TILE_COUNT }, (_, index) => index + 1).sort(() => Math.random() - 0.5)
    return isSolvable(shuffledBoard) ? shuffledBoard : shuffleArray(shuffledBoard)
}