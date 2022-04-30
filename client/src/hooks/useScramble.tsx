import { useState, useEffect, useCallback, useMemo } from "react";
import { DropResult } from "react-beautiful-dnd";
import {
  EVENT_ACTIONS,
  Letter,
  SCORE_ACTIONS,
  ScramblerProps,
  SCRAMBLE_PLAYER_INFO,
} from "../types";
import { shuffleWord, reorder } from "../utils";
import socket from "../socket";
import { EVENTS } from "../types";
import useLocalStorage from "./useLocalStorage";
var randomWords = require("random-words");

const useScramble = ({
  dispatchEventUpdate,
  dispatchPlayerScores,
  playerScores,
}: ScramblerProps) => {
  const allPlayers = useMemo(() => [...playerScores], [playerScores]);

  const [words, setWords] = useState<Array<string>>([]);
  const [currentWord, setCurrentWord] = useState<string | undefined>();
  const [letters, setLetters] = useState<Array<Letter>>([]);
  const [isCorrect, setisCorrect] = useState<boolean>(false);
  const [userData] = useLocalStorage(SCRAMBLE_PLAYER_INFO);

  const incrementScore = useCallback(
    (user) => {
      const playerToUpdate = allPlayers.find(
        (score) => score.username === user
      );

      if (!playerToUpdate) return;
      dispatchPlayerScores({
        type: SCORE_ACTIONS.increment,
        player: playerToUpdate,
      });
    },
    [dispatchPlayerScores, allPlayers]
  );

  useEffect(() => {
    socket.on(EVENTS.user_score, ({ user, text, score }) => {
      const playerToUpdate = allPlayers.find(
        (player) => player.username === user
      );
      dispatchEventUpdate({
        event: { type: EVENTS.user_score, content: text },
        type: EVENT_ACTIONS.new_event,
      });
      if (!playerToUpdate) return;
      dispatchPlayerScores({
        type: SCORE_ACTIONS.set_player_score,
        player: playerToUpdate,
        score,
      });
    });
  }, [dispatchEventUpdate, incrementScore, allPlayers, dispatchPlayerScores]);

  const loadNextWord = () => {
    const indexOfCurrentWord = words.findIndex((word) => word === currentWord);
    setTimeout(() => {
      setCurrentWord(words[indexOfCurrentWord + 1]);
    }, 2000);
  };

  useEffect(() => {
    const randomWordsList = randomWords(10);
    setWords(randomWordsList);
    setCurrentWord(randomWordsList[0]);
  }, []);

  useEffect(() => {
    if (!currentWord) return;
    const letters = shuffleWord(currentWord.split("")).map(
      (content: string, index) => ({
        id: `letter-${index}`,
        content,
      })
    );
    setLetters(letters);
    setisCorrect(false);
  }, [currentWord]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const letterArray = reorder(
      letters,
      result.source.index,
      result.destination.index
    );
    const letterContents = letterArray.map((letter) => letter.content).join("");

    if (currentWord === letterContents) {
      setisCorrect(true);
      const playerToUpdate = allPlayers.find(
        (player) => player.username === userData.username
      );
      socket.emit(EVENTS.user_score, playerToUpdate.score + 1, (error) =>
        console.log("An error occurred during score broadcast.", error)
      );
      incrementScore(userData.username);
      loadNextWord();
    }

    setLetters(letterArray);
  };

  return { onDragEnd, words, isCorrect, letters };
};

export default useScramble;
