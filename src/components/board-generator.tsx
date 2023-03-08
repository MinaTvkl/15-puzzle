
import { useState, useEffect, useRef } from 'react';
import styled from "styled-components"
import { Motion, spring } from "react-motion";
import { indexToCoordinates, isMoveAllowed, moveAxis, moveDistance, tileMover } from '../helpers/game-logic';
import { TILE_COUNT, GRID_DIMENSIONS, ROWS, COLUMNS } from '../constants';
import { Tile } from './tile';
import ET from './../image-asset.jpeg'

export const Grid = styled.div`
  margin-top: 10%;
  margin-left: auto;
  margin-right: auto;
  height: ${10*ROWS}vw;
  width: ${10*COLUMNS}vw;
  background-color: #000000;
  border-radius: 25px;
`;

export const ShuffleButton = styled.button`
`

function Board() {
  const array = Array.from({ length: TILE_COUNT }, (_, index) => index + 1)
  array.sort(() => Math.random() - 0.5)

  const [boardArray, setBoardArray] = useState(array)
  const [emptyTileIndex, setEmptyTileIndex] = useState(array.indexOf(TILE_COUNT))
  const [image, setImage] = useState<FileList | null>()
  const [imageURL, setImageURL] = useState<string>("")

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


  useEffect(()=>{
      if (!image) return
      console.log(image)
      const newImageURL = URL.createObjectURL(image[0])
      setImageURL(newImageURL)
      console.log(imageURL)


  }, [image])


  const handleTileChange = (clickedIndex: number) => {

    console.log("x position", (100 / (GRID_DIMENSIONS - 1) * (clickedIndex % GRID_DIMENSIONS)))

    console.log("y position", (100 / (GRID_DIMENSIONS - 1) * Math.floor(clickedIndex / GRID_DIMENSIONS)))
    //first check if allowed move 
    //then change board w helper functions (find direction, which tiles should move where (which clickedIndex change), )
    //find the location of 0 the first time and after that the clicked is the new zero
    console.log("this is coord for 0", indexToCoordinates(emptyTileIndex))
    console.log("this is coord for clicked", indexToCoordinates(clickedIndex))
    console.log(emptyTileIndex, clickedIndex)
    if (emptyTileIndex === clickedIndex) return

    const emptyCoord = indexToCoordinates(emptyTileIndex)
    const clickedCoord = indexToCoordinates(clickedIndex)
    console.log("x translation", 40 / GRID_DIMENSIONS * (clickedIndex % GRID_DIMENSIONS + 1))
    console.log("y translation", 40 / GRID_DIMENSIONS * (Math.floor(clickedIndex / GRID_DIMENSIONS) + 1))

    const allowedMove = isMoveAllowed(clickedCoord, emptyCoord)
    if (!allowedMove) return
    const axis = moveAxis(clickedCoord, emptyCoord)
    
    const distance = moveDistance(clickedCoord, emptyCoord, axis)
    const arr = tileMover(emptyTileIndex, boardArray, distance, axis)
    setEmptyTileIndex(clickedIndex)
    setBoardArray(arr)
  }

  const shuffleTiles = () => {
    setBoardArray(boardArray.sort(() => Math.random() - 0.5))
    setEmptyTileIndex(boardArray.indexOf(TILE_COUNT))
  }

  console.log(usePrevious(emptyTileIndex))
  console.log(emptyTileIndex)
  const tileRender = (arr: number[]) => {
    let tileList = []
    for (let i = 0; i < arr.length; i++) {
      tileList.push(
      <Motion key={i} style={{
        translateX: spring(10 * ((i%COLUMNS))),
        translateY: spring(10 * (Math.floor(i/COLUMNS)))
      }}>
        {({ translateX, translateY }) => (
        <Tile style={{
          transform: `translate3d(${translateX}vw, ${translateY}vw, 0)`}}
          key={i}
          tileValue={arr[i]}
          index={i}
          coordinates={indexToCoordinates(arr[i])}
          correct={i + 1 === arr[i]}
          image={imageURL}
          translateX = {translateX}
          translateY = {translateY}
          onClick={() => handleTileChange(i)}>
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
      <input type="file" accept="image/*" onChange={(event)=>{setImage(event.target.files)} }></input>
      <button onClick={()=>setImageURL(ET)}>test image for NxN board</button>
      <p>Note that your image dimensions must be {ROWS}x{COLUMNS} to match the puzzle size</p>
    </div>
  );
}

export default Board;
