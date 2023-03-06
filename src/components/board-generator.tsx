
import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import styled from "styled-components"
import { indexToCoordinates, isMoveAllowed, moveAxis, moveDistance, tileMover } from '../helpers/game-logic';
import { TILE_COUNT, GRID_DIMENSIONS } from '../constants';

type tileProps = {
  tileValue: number
  color: string
  correct: boolean
}

//background-color: ${props => props.tileValue ? "palevioletred" : "white"};
export const Tile = styled.div<tileProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5rem;
  background-color: ${props => {
    if (props.correct) {
      return "lightgreen"
    }
    if (!props.tileValue) {
      return "black"
    }
    else{
      return "pink"
    }
  }};
`;

export const Grid = styled.div`
  height: 40vw;
  width: 40vw;
  min-width: 300px;
  min-height: 300px;
  max-width: 700px;
  max-height: 700px;
  display: grid;
  grid-template: repeat(${GRID_DIMENSIONS}, 1fr) / repeat(${GRID_DIMENSIONS}, 1fr);
  grid-gap: 10px;
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

  const handleTileChange = (tileValue: number, clickedIndex: number) => {
    setColor("pink")
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
          correct={i + 1 === arr[i]}
          onClick={(e) => handleTileChange(arr[i], i)}> {arr[i]}
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
