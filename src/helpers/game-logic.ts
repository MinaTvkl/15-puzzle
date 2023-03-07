import { GRID_DIMENSIONS } from "../constants";

type Coordinate = { x: number, y: number };
type Axis = { horizontal: boolean, vertical: boolean }

export function indexToCoordinates(position: number): Coordinate {
    let x = position % GRID_DIMENSIONS
    let y = Math.floor(position / GRID_DIMENSIONS)
    return { x, y }
}

export function isMoveAllowed(clickedTileCoord: Coordinate, emptyTileCoord: Coordinate) {
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
export function positionCalculator(coord: Coordinate) {
    let index = coord.y * 4 + coord.x;
    return index
}


export function tileMover(emptyTileIndex: number, arr: number[], distance: number, axis: Axis) {
    const direction = Math.sign(distance)
    //swaps the zero to the next position & changes the stored position of 0
    if (axis.vertical) {
        for (let i = 1; i <= Math.abs(distance); i++) {
            [arr[emptyTileIndex], arr[emptyTileIndex + GRID_DIMENSIONS * direction]] = [arr[emptyTileIndex + GRID_DIMENSIONS * direction], arr[emptyTileIndex]]
            emptyTileIndex += GRID_DIMENSIONS * direction
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
