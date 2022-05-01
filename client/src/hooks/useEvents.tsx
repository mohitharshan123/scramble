import { useEffect } from "react";
import { useScores } from "../contexts/score";
import socket from "../socket";
import {
  EVENTS,
  EventsProps,
  EVENT_ACTIONS,
  SCORE_ACTIONS,
  UserInfo,
} from "../types";

const useEvents = ({
  setIsGameModalOpen,
  gameData,
  dispatchEventUpdate,
  setGameData,
}: EventsProps) => {
  const { dispatch: dispatchPlayerScores } = useScores();

  useEffect(() => {
    if (!gameData.gameID) {
      setIsGameModalOpen(true);
    } else {
      socket.emit(
        EVENTS.user_joined,
        { username: gameData.username, gameID: gameData.gameID },
        () => {}
      );
    }
  }, [gameData.username, gameData.gameID, setIsGameModalOpen]);

  useEffect(() => {
    if (socket.connected) {
      dispatchEventUpdate({
        event: {
          type: EVENTS.user_joined,
          content: "Successfully connected.",
        },
        type: EVENT_ACTIONS.new_event,
      });
    }

    socket.on(EVENTS.user_disconnected, ({ text }) => {
      dispatchEventUpdate({
        event: {
          type: EVENTS.user_disconnected,
          content: text,
        },
        type: EVENT_ACTIONS.new_event,
      });
    });

    socket.on(EVENTS.users_in_game, ({ users }) => {
      dispatchPlayerScores({
        players: users,
        type: SCORE_ACTIONS.set_scores,
      });
    });

    socket.on(EVENTS.user_joined, ({ text }) => {
      dispatchEventUpdate({
        event: {
          type: EVENTS.user_joined,
          content: text,
        },
        type: EVENT_ACTIONS.new_event,
      });
    });

    return () => {
      socket.emit(EVENTS.user_disconnected);
    };
  }, [dispatchPlayerScores, dispatchEventUpdate]);

  const handleJoinGame = ({ username, gameID }: UserInfo) => {
    socket.emit(EVENTS.user_joined, { username, gameID }, () => {
      setGameData({ username, gameID });
      setIsGameModalOpen(false);
    });
  };

  return { handleJoinGame };
};

export default useEvents;
