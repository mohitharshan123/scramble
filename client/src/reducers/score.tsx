import { ScoreActionTypes, SCORE_ACTIONS, UserInfo } from "../types";

export const scoreReducer = (
  state: Array<UserInfo>,
  action: ScoreActionTypes
): Array<UserInfo> => {
  switch (action.type) {
    case SCORE_ACTIONS.set_scores:
      return [...action.players];
    case SCORE_ACTIONS.increment: {
      const allPlayers = [...state];
      const playerToUpdate = allPlayers.find(
        (player) => player.username === action.player.username
      );
      playerToUpdate.score++;
      return allPlayers;
    }
    case SCORE_ACTIONS.set_player_score: {
      const allPlayers = [...state];
      const playerToUpdate = allPlayers.find(
        (player) => player.username === action.player.username
      );
      playerToUpdate.score = action.score;
      return allPlayers;
    }
    default:
      return state;
  }
};
