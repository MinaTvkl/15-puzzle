
import { useState, useEffect } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import styled from 'styled-components'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import { device } from '../device';
import { indexToCoordinates, isMoveAllowed, moveAxis, moveDistance, tileMover, shuffleArray, isSolved } from '../helpers/game-logic';
import { TILE_COUNT, ROWS, COLUMNS } from '../constants';
import { Tile } from './tile';
//use as test image for nxn puzzle
import ET from './../image-asset.jpeg'


type StartButtonType = {
  gameStarted: boolean
}

type WinnerMessageType = {
  gameSolved: boolean
}

export const Grid = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1vw;
  height: ${8 * ROWS}vh;
  width: ${8 * COLUMNS}vh;
  background-color: #000000;
  border-radius: 15px;
  text-align: center;

  @media ${device.tablet} { 
  height: ${7 * ROWS}vw;
  width: ${7 * COLUMNS}vw;
  }
`

export const StartButton = styled(Button) <StartButtonType>`
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px 25px;
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #000000;
  background-color: #5852ff;
  border: none;
  border-radius: 10px;
  visibility: ${props => props.gameStarted ? 'hidden' : 'visible'};
}
  :hover {background-color: #3e38ff}

  :active {
    background-color: #3e8e41;
  }
`

export const WinnerMessage = styled.h1<WinnerMessageType>`
  font-size: 5vw;
  visibility: ${props => props.gameSolved ? 'visible' : 'hidden'};

  @media ${device.tablet} { 
    font-size: 5vh;
    }
  
`

function Board() {
  const array = Array.from({ length: TILE_COUNT }, (_, index) => index + 1)

  const [boardArray, setBoardArray] = useState(array)
  const [emptyTileIndex, setEmptyTileIndex] = useState(boardArray.indexOf(TILE_COUNT))
  const [image, setImage] = useState<FileList | null>()
  const [imageURL, setImageURL] = useState<string | undefined>()
  const [gameStarted, setGameStarted] = useState(false)
  const [gameSolved, setGameSolved] = useState(false)

  const shuffleBoard = () => {
    const shuffled = shuffleArray(boardArray)
    setBoardArray(shuffled)
    setEmptyTileIndex(shuffled.indexOf(TILE_COUNT))
  }

  useEffect(() => {
    if (!image) return
    const newImageURL = URL.createObjectURL(image[0])
    setImageURL(newImageURL)
  }, [image])

  const handleTileChange = (clickedTileIndex: number) => {
    if (emptyTileIndex === clickedTileIndex) return
    const emptyTileCoord = indexToCoordinates(emptyTileIndex)
    const clickedTileCoord = indexToCoordinates(clickedTileIndex)

    const allowedMove = isMoveAllowed(clickedTileCoord, emptyTileCoord)
    if (!allowedMove) return

    const axis = moveAxis(clickedTileCoord, emptyTileCoord)
    const distance = moveDistance(clickedTileCoord, emptyTileCoord, axis)

    const newBoardArray = tileMover(emptyTileIndex, boardArray, distance, axis)
    setEmptyTileIndex(clickedTileIndex)
    setBoardArray(newBoardArray)
    if (isSolved(boardArray)) {
      setGameSolved(true)
      setGameStarted(false)
    }
  }

  const handleGameStart = () => {
    setGameStarted(true)
    setGameSolved(false)
    shuffleBoard()
  }

  const tileRender = () => {
    let tileList = []
    for (let i = 0; i < boardArray.length; i++) {
      tileList.push(
        <Tile
          key={boardArray[i]}
          tileValue={boardArray[i]}
          index={i}
          coordinates={indexToCoordinates(boardArray[i])}
          correct={i + 1 === boardArray[i]}
          image={imageURL}
          gameStarted={gameStarted}
          onClick={() => handleTileChange(i)}>
          {boardArray[i]}
        </Tile>
      )
    }
    return tileList
  }

  return (
    <div className='board'>
      <WinnerMessage gameSolved={gameSolved}> You won!!! </WinnerMessage>
      <Grid>
        {tileRender()}
        <StartButton color='inherit' variant='contained' style={{ position: 'absolute' }} gameStarted={gameStarted} onClick={() => handleGameStart()}>New game</StartButton>
        {gameSolved && <ConfettiExplosion
          colors={['#ffd478', '#ff59c2', '#3f51b5']}
          duration={3000}
          force={0.6}
          particleCount={80}
          width={1600}
          particleSize={10}
        />}
      </Grid>
      <Stack direction='row' alignItems='center'
        justifyContent='center' spacing={2}>
        <Button variant='contained' color='inherit' component='label' onClick={() => shuffleBoard()}>
          Shuffle
        </Button>
        <IconButton color='inherit' aria-label='upload picture' component='label'>
          <input hidden type='file' accept='image/*' onChange={(event) => { setImage(event.target.files) }} />
          <PhotoCamera />
        </IconButton>
      </Stack>
      <p id='info-txt' >Upload an image to customise your puzzle, note that your image dimensions must be {ROWS}x{COLUMNS} to match the puzzle size</p>
    </div>
  )
}

export default Board;
