import { UserInfo } from "os";
import { useEffect } from "react";
import socket from "../socket";
import { EVENTS, EventsProps } from "../types";

const useEvents = ({
  setIsGameModalOpen,
  gameData,
  setGameEvents,
  setPlayerScores,
  setGameData,
}: EventsProps) => {
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
  }, [socket]);

  useEffect(() => {
    if (socket.connected) {
      setGameEvents((events) => [
        ...events,
        { type: EVENTS.user_joined, content: "Successfully connected." },
      ]);
    }

    socket.on(EVENTS.user_disconnected, ({ text }) => {
      setGameEvents((events) => [
        ...events,
        { type: EVENTS.user_disconnected, content: text },
      ]);
    });

    socket.on(EVENTS.users_in_game, ({ users }) => {
      setPlayerScores(users.map((user) => ({ ...user, score: 0 })));
    });

    socket.on(EVENTS.user_joined, ({ text }) => {
      setGameEvents((events) => [
        ...events,
        { type: EVENTS.user_joined, content: text },
      ]);
    });

    return () => {
      socket.emit(EVENTS.user_disconnected);
    };
  }, [socket]);

  const handleJoinGame = ({ username, gameID }: UserInfo) => {
    socket.emit(EVENTS.user_joined, { username, gameID }, () => {
      setIsGameModalOpen(false);
      setGameData({ username, gameID });
    });
  };

  return { handleJoinGame };
};

export default useEvents;
