import styled from "styled-components"
import { TILE_COUNT, ROWS, COLUMNS } from '../constants';
import ET from './../image-asset.jpeg'
import './../App.css';

type TileProps = {
    tileValue: number
    index: number
    coordinates: { x: number, y: number }
    correct: boolean
    image: string
    translateX: number
    translateY: number
  }
  
  export const Tile = styled.div<TileProps>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  
    width: 10vw;
    height: 10vw;
    translateX: ${props => props.translateX}vw;
    translateY: ${props => props.translateY}vw;
    
    background-image: url("${props => props.image}");
    background-size: ${10*ROWS}vw ${10*COLUMNS};
    background-position: ${props => (100 / (ROWS - 1) * (props.tileValue % ROWS))}% ${props => (100 / (COLUMNS - 1) * Math.floor(props.tileValue / COLUMNS))}%;
    background-color: ${props => {
        if (props.correct) {
          return "#73b09e"
        }
        else {
          return "#E2D1F9"
        }
      }};
    animation: blink-animation ${Math.random}s 1;
    box-sizing: border-box;
    border-radius: 25px;
    border: 2px solid #000000;
    visibility: ${props => props.tileValue !== TILE_COUNT ? 'visible' : 'hidden'} ;
  `;
  