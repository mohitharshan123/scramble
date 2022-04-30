
import  { Dispatch } from 'react';

export interface Letter {
    id: string;
    content: string;
  }
export interface LetterCardProps {
    letter: Letter;
    index: number;
    isCorrect: boolean;
  }

  export interface UserInfo {
    username:string; 
    gameID:string;
    score?:number
  }

  export interface ScramblerProps {
    setGameEvents:Dispatch<any>, 
    setPlayerScores:Dispatch<any>
  }

  export interface GameModalProps {
    onSubmit(param:UserInfo): void;
  }

  export interface EventsProps  {
    setIsGameModalOpen:Dispatch<any>,
    gameData:any,
    setGameEvents:Dispatch<any>,
    setPlayerScores:Dispatch<any>,
    setGameData:Dispatch<any>,
  }

  export enum EVENTS {
     "user_joined" = "user_joined",
     "user_disconnected"= "user_disconnected",
     "socket_connected" = "connection",
     "user_score" = "user_score",
     "users_in_game" = "users_in_game",
     "socket_disconnected"= "disconnect",
  }
  
  export interface GameEvent {
    type:EVENTS,
    content:string
  }

  export const SCRAMBLE_PLAYER_INFO = "scramble-player-info"