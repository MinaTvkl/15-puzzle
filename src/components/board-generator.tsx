
import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import styled from "styled-components"
import { indexToCoordinates, isMoveAllowed, moveAxis, moveDistance, tileMover } from '../helpers/game-logic';
import { TILE_COUNT, GRID_DIMENSIONS } from '../constants';
import ET from './../image-asset.jpeg'

type tileProps = {
  tileValue: number
  color: string
  index: number
  coordinates: { x: number, y: number }
  correct: boolean
}

export const Tile = styled.div<tileProps>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${40 / GRID_DIMENSIONS}vw;
  height: ${40 / GRID_DIMENSIONS}vw;
  translate :${props => 40 / GRID_DIMENSIONS * ((props.index%GRID_DIMENSIONS))}vw ${props => 40 / GRID_DIMENSIONS * (Math.floor((props.index)/GRID_DIMENSIONS))}vw;
  background-image: url("${ET}");
  background-size: 40vw;
  background-position: ${props => (100 / (GRID_DIMENSIONS - 1) * (props.tileValue % GRID_DIMENSIONS))}% ${props => (100 / (GRID_DIMENSIONS - 1) * Math.floor(props.tileValue / GRID_DIMENSIONS))}%;
  background-color: ${props => {
    if (props.correct) {
      return "lightgreen"
    }
    else {
      return "pink"
    }
  }};
  visibility: ${props => props.tileValue ? 'visible' : 'hidden'} ;
`;

export const Grid = styled.div`
  margin-top: 10%;
  margin-left: auto;
  margin-right: auto;
  height: 40vw;
  width: 40vw;
  background-color: black;
`;

export const ShuffleButton = styled.button`
`

function Board() {
  const array = Array.from({ length: TILE_COUNT }, (_, index) => index)
  array.sort(() => Math.random() - 0.5)

  const [color, setColor] = useState("");

  const [axis, setAxis] = useState({ horizontal: false, vertical: false })
  const [boardArray, setBoardArray] = useState(array)
  const [emptyTileIndex, setEmptyTileIndex] = useState(array.indexOf(0))

  const handleTileChange = (clickedIndex: number) => {
    setColor("pink")
    console.log("x position", (100 / (GRID_DIMENSIONS - 1) * (clickedIndex % GRID_DIMENSIONS)))

    console.log("y position", (100 / (GRID_DIMENSIONS - 1) * Math.floor(clickedIndex / GRID_DIMENSIONS)))
    //first check if allowed move 
    //then change board w helper functions (find direction, which tiles should move where (which clickedIndex change), )
    //find the location of 0 the first time and after that the clicked is the new zero
    console.log("this is coord for 0", indexToCoordinates(emptyTileIndex))
    console.log("this is coord for clicked", indexToCoordinates(clickedIndex))
    console.log(emptyTileIndex, clickedIndex)
    if (emptyTileIndex === clickedIndex) {
      return

    }
    const emptyCoord = indexToCoordinates(emptyTileIndex)
    const clickedCoord = indexToCoordinates(clickedIndex)
    console.log("x translation", 40 / GRID_DIMENSIONS * (clickedIndex % GRID_DIMENSIONS + 1))

    console.log("y translation", 40 / GRID_DIMENSIONS * (Math.floor(clickedIndex / GRID_DIMENSIONS) + 1))
    const allowedMove = isMoveAllowed(clickedCoord, emptyCoord)
    const axis = moveAxis(clickedCoord, emptyCoord)
    if (!allowedMove) {
      return
    }

    const distance = moveDistance(clickedCoord, emptyCoord, axis)
    let arr = tileMover(emptyTileIndex, boardArray, distance, axis)
    setEmptyTileIndex(clickedIndex)
    setBoardArray(arr)

  }

  const shuffleTiles = () => {
    setBoardArray(boardArray.sort(() => Math.random() - 0.5))
    setEmptyTileIndex(boardArray.indexOf(0))
  }

  const tileRender = (arr: number[]) => {
    let tileList = []
    for (let i = 0; i < arr.length; i++) {
      tileList.push(
        <Tile
          key={i}
          tileValue={arr[i]}
          color={color}
          index={i}
          coordinates={indexToCoordinates(arr[i])}
          correct={i + 1 === arr[i]}
          onClick={(e) => handleTileChange(i)}>
          {arr[i]}
        </Tile>)
    }
    return tileList
  }

  return (
    <div className="board">
      <Grid>
        {tileRender(boardArray)}
      </Grid>
      <ShuffleButton onClick={() => shuffleTiles()}> Shuffle </ShuffleButton>
    </div>
  );
}

export default Board;
