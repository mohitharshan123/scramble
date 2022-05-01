import { Dispatch } from "react";

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
  username: string;
  gameID: string;
  score?: number;
}

export interface ScramblerProps {
  dispatchEventUpdate: Dispatch<any>;
}

export interface GameModalProps {
  onSubmit(param: UserInfo): void;
}
export type IncrementScoreAction = {
  type: typeof SCORE_ACTIONS.increment;
  player: UserInfo;
};

export type SetScoreCardAction = {
  type: typeof SCORE_ACTIONS.set_scores;
  players: Array<UserInfo>;
};

export type SetPlayerScoreAction = {
  type: typeof SCORE_ACTIONS.set_player_score;
  player: UserInfo;
  score: number;
};

export type NewEventAction = {
  type: typeof EVENT_ACTIONS.new_event;
  event: GameEvent;
};
export interface EventsProps {
  setIsGameModalOpen: Dispatch<any>;
  gameData: any;
  dispatchEventUpdate: Dispatch<NewEventAction>;
  setGameData: Dispatch<any>;
}

export interface GameEvent {
  type: EVENTS;
  content: string;
}

export enum EVENT_ACTIONS {
  new_event = "new_event",
}

export enum SCORE_ACTIONS {
  set_scores = "set_scores",
  increment = "increment",
  set_player_score = "set_player_score",
}

export type EventActionTypes = NewEventAction;

export type ScoreActionTypes =
  | SetScoreCardAction
  | IncrementScoreAction
  | SetPlayerScoreAction;

export enum EVENTS {
  "user_joined" = "user_joined",
  "user_disconnected" = "user_disconnected",
  "socket_connected" = "connection",
  "user_score" = "user_score",
  "users_in_game" = "users_in_game",
  "socket_disconnected" = "disconnect",
}

export const SCRAMBLE_PLAYER_INFO = "scramble-player-info";
