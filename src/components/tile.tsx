import styled from 'styled-components'
import { TILE_COUNT, ROWS, COLUMNS } from '../constants'
import './../App.css'
import { device } from '../device'

type TileProps = {
    tileValue: number
    index: number
    coordinates: { x: number, y: number }
    correct: boolean
    image: string | undefined
    gameStarted: boolean
}

export const Tile = styled.div<TileProps>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8vh;
    height: 8vh;
    translate :${props => 8 * (props.index%COLUMNS)}vh ${props => 8 * (Math.floor((props.index)/COLUMNS))}vh;
    background-image: url('${props => props.image}');
    background-size: ${8 * ROWS}vh ${8 * COLUMNS}vh;
    background-position: ${props => (100 / (ROWS - 1) * ((props.tileValue-1) % ROWS))}% ${props => (100 / (COLUMNS - 1 ) * Math.floor((props.tileValue-1) / COLUMNS))}%;
    background-color: ${props => {
        if (props.correct) {
            return '#73b09e'
        }
        else {
            return '#E2D1F9'
        }
    }};
    animation: blink-animation ${Math.random}s 1;
    box-sizing: border-box;
    border-radius: 15px;
    border: 2px solid #000000;
    font-size: 20px;
    visibility: ${props => props.tileValue !== TILE_COUNT ? 'visible' : 'hidden'};
    opacity: ${props => props.gameStarted ? '1' : 0.6};
    
    @media ${device.tablet} { 
        width: 7vw;
        height: 7vw;
        translate :${props => 7 * (props.index%COLUMNS)}vw ${props => 7 * (Math.floor((props.index)/COLUMNS))}vw;
        background-image: url('${props => props.image}');
        background-size: ${7 * ROWS}vw ${7 * COLUMNS}vw;
        font-size: 2vw;
    }
    `
