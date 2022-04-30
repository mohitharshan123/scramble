import { useState, useEffect } from "react";
import { DropResult } from "react-beautiful-dnd";
import {
  GameEvent,
  Letter,
  ScramblerProps,
  SCRAMBLE_PLAYER_INFO,
} from "../types";
import { shuffleWord, reorder } from "../utils";
import socket from "../socket";
import { EVENTS } from "../types";
import useLocalStorage from "./useLocalStorage";
var randomWords = require("random-words");

const useScramble = ({ setGameEvents, setPlayerScores }: ScramblerProps) => {
  const [words, setWords] = useState<Array<string>>([]);
  const [currentWord, setCurrentWord] = useState<string | undefined>();
  const [letters, setLetters] = useState<Array<Letter>>([]);
  const [isCorrect, setisCorrect] = useState<boolean>(false);
  const [userData] = useLocalStorage(SCRAMBLE_PLAYER_INFO);

  useEffect(() => {
    socket.on(EVENTS.user_score, ({ user, text, score }) => {
      setGameEvents((events: Array<GameEvent>) => [
        ...events,
        { type: EVENTS.user_score, content: text },
      ]);

      setPlayerScores((players) => {
        const allPlayers = [...players];
        const playerToUpdate = allPlayers.findIndex(
          (score) => score.username === user
        );
        allPlayers[playerToUpdate].score = score;
        return allPlayers;
      });
    });
  }, []);

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
      setPlayerScores((players) => {
        const allPlayers = [...players];
        const playerToUpdate = allPlayers.find(
          (player) => player.username === userData.username
        );
        playerToUpdate.score++;
        socket.emit(EVENTS.user_score, playerToUpdate.score, (error) =>
          console.log("An error occurred during score broadcast.", error)
        );
        return allPlayers;
      });

      const indexOfCurrentWord = words.findIndex(
        (word) => word === currentWord
      );
      setTimeout(() => {
        setCurrentWord(words[indexOfCurrentWord + 1]);
      }, 2000);
    }

    setLetters(letterArray);
  };

  return { onDragEnd, words, isCorrect, letters };
};

export default useScramble;
