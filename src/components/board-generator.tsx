
import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import styled from "styled-components"
import { indexToCoordinates, isMoveAllowed, moveAxis, moveDistance, tileMover } from '../helpers/game-logic';
import { TILE_COUNT, GRID_DIMENSIONS } from '../constants';

type tileProps = {
  tileValue: number
  color: string
  index: number
  coordinates: { x: number, y: number }
  correct: boolean
}

//background-color: ${props => props.tileValue ? "palevioletred" : "white"};
//col* width
//

export const Tile = styled.div<tileProps>`
  position: absolute;
  width: ${500 / GRID_DIMENSIONS}px;
  height: ${500 / GRID_DIMENSIONS}px;
  translate :${props => 500 / GRID_DIMENSIONS * ((props.index%GRID_DIMENSIONS)+1)}px ${props => 500 / GRID_DIMENSIONS * (Math.floor((props.index)/GRID_DIMENSIONS)+1)}px;
  
  background-image: url(https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/1478637736504-K2S5E4GPWXMIWC42X8B3/image-asset.jpeg);
  background-size: ${500 * 1.25}px;
  background-position: ${props => (100 / (GRID_DIMENSIONS - 1) * (props.tileValue % GRID_DIMENSIONS))}% ${props => (100 / (GRID_DIMENSIONS - 1) * Math.floor(props.tileValue / GRID_DIMENSIONS))}%;
  background-color: ${props => {
    if (props.correct) {
      return "lightgreen"
    }
    if (!props.tileValue) {
      return "black"
    }
    else {
      return "pink"
    }
  }};
`;

export const Grid = styled.div`
  height: 500px;
  width: 500px;

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
    console.log("x translation", 500 / GRID_DIMENSIONS * (clickedIndex % GRID_DIMENSIONS + 1))
    
    console.log("y translation", 500 / GRID_DIMENSIONS * ( Math.floor(clickedIndex / GRID_DIMENSIONS)  + 1))
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
