
import { useState } from 'react';
import styled from "styled-components"
import { Motion, spring } from "react-motion";
import { indexToCoordinates, isMoveAllowed, moveAxis, moveDistance, tileMover } from '../helpers/game-logic';
import { TILE_COUNT, GRID_DIMENSIONS } from '../constants';
import ET from './../image-asset.jpeg'

type tileProps = {
  tileValue: number
  color: string
  index: number
  coordinates: { x: number, y: number }
  correct: boolean
  translateX: number
  translateY: number
}

export const Tile = styled.div<tileProps>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${40 / GRID_DIMENSIONS}vw;
  height: ${40 / GRID_DIMENSIONS}vw;
  translateX: ${props => props.translateX}vw;
  translateY: ${props => props.translateY}vw;
  
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
  visibility: ${props => props.tileValue !== TILE_COUNT ? 'visible' : 'hidden'} ;
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
  const array = Array.from({ length: TILE_COUNT }, (_, index) => index + 1)
  array.sort(() => Math.random() - 0.5)

  const [color, setColor] = useState("");
  const [axis, setAxis] = useState({ horizontal: false, vertical: false })
  const [boardArray, setBoardArray] = useState(array)
  const [emptyTileIndex, setEmptyTileIndex] = useState(array.indexOf(TILE_COUNT))

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
    setEmptyTileIndex(boardArray.indexOf(TILE_COUNT))
  }
  const tileRender = (arr: number[]) => {
    let tileList = []
    for (let i = 0; i < arr.length; i++) {
      tileList.push(

      <Motion key={i} style={{
        translateX: spring(40 / GRID_DIMENSIONS * ((i%GRID_DIMENSIONS))),
        translateY: spring(40 / GRID_DIMENSIONS * (Math.floor((i)/GRID_DIMENSIONS)))
      }}>
        {({ translateX, translateY }) => (
        <Tile style={{
          transform: `translate3d(${translateX}vw, ${translateY}vw, 0)`}}
          key={i}
          tileValue={arr[i]}
          color={color}
          index={i}
          coordinates={indexToCoordinates(arr[i])}
          correct={i + 1 === arr[i]}
          
          translateX = {translateX}
          translateY = {translateY}
          onClick={(e) => handleTileChange(i)}>
          {arr[i]}
        </Tile>
        )}
        </Motion>)
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
