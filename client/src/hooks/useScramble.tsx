import { useState, useEffect } from "react";
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
import { useScores } from "../contexts/score";
var randomWords = require("random-words");

const useScramble = ({ dispatchEventUpdate }: ScramblerProps) => {
  const { state: playerScores, dispatch: dispatchPlayerScores } = useScores();

  const [words, setWords] = useState<Array<string>>([]);
  const [currentWord, setCurrentWord] = useState<string | undefined>();
  const [letters, setLetters] = useState<Array<Letter>>([]);
  const [isCorrect, setisCorrect] = useState<boolean>(false);
  const [userData] = useLocalStorage(SCRAMBLE_PLAYER_INFO);

  const incrementScore = (user) => {
    const playerToUpdate = playerScores.find(
      (score) => score.username === user
    );

    if (!playerToUpdate) return;
    socket.emit(EVENTS.user_score, {
      user: playerToUpdate,
      score: playerToUpdate.score + 1,
    });
    dispatchPlayerScores({
      type: SCORE_ACTIONS.increment,
      player: playerToUpdate,
    });
  };

  useEffect(() => {
    socket.on(EVENTS.user_score, ({ user, text, score }) => {
      const playerToUpdate = playerScores.find(
        (player) => player.username.toLowerCase() === user.toLowerCase()
      );
      if (!playerToUpdate) return;
      dispatchEventUpdate({
        event: { type: EVENTS.user_score, content: text },
        type: EVENT_ACTIONS.new_event,
      });
      dispatchPlayerScores({
        type: SCORE_ACTIONS.set_player_score,
        player: playerToUpdate,
        score,
      });
    });
  }, [playerScores]);

  const loadNextWord = () => {
    const indexOfCurrentWord = words.findIndex((word) => word === currentWord);
    setTimeout(() => {
      setCurrentWord(words[indexOfCurrentWord + 1]);
    }, 2000);
  };

  useEffect(() => {
    const randomWordsList = randomWords({ exactly: 50, maxLength: 5 });
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
      incrementScore(userData.username);
      loadNextWord();
    }
    setLetters(letterArray);
  };

  return { onDragEnd, words, isCorrect, letters };
};

export default useScramble;
