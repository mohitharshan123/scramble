import { v4 as uuidv4 } from "uuid";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import LetterCard from "./LetterCard";
import { EVENTS, Letter, SCRAMBLE_PLAYER_INFO } from "../types";
import useScramble from "../hooks/useScramble";
import CorrentAnswer from "../lotties/CorrectAnswer";

import React, { useReducer, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import GameModal from "./GameModal";
import useEvents from "../hooks/useEvents";
import { eventsReducer } from "../reducers/events";
import { scoreReducer } from "../reducers/score";

window.onbeforeunload = function () {
  return false;
};

const Main = () => {
  const [isGameModalOpen, setIsGameModalOpen] = useState<boolean>(false);
  const [gameData, setGameData] = useLocalStorage(SCRAMBLE_PLAYER_INFO, {});
  const [gameEvents, dispatchEventUpdate] = useReducer(eventsReducer, []);
  const [playerScores, dispatchPlayerScores] = useReducer(scoreReducer, []);

  const { onDragEnd, isCorrect, letters } = useScramble({
    dispatchEventUpdate,
    dispatchPlayerScores,
    playerScores,
  });

  const { handleJoinGame } = useEvents({
    setIsGameModalOpen,
    gameData,
    dispatchEventUpdate,
    dispatchPlayerScores,
    setGameData,
  });

  const eventClassName = (event) =>
    [EVENTS.user_joined, EVENTS.user_disconnected].includes(event.type)
      ? "text-gray-600 text-sm"
      : "text-blue-600 text-lg ";

  return (
    <>
      {isGameModalOpen && <GameModal onSubmit={handleJoinGame} />}
      <div className="flex flex-row space-x-5">
        <div className="flex justify-center items-center h-screen flex-col space-y-10 w-3/4 overflow-scroll bg-gradient-to-r from-cyan-500 to-blue-500">
          {isCorrect ? (
            <CorrentAnswer />
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId={uuidv4()} direction="horizontal">
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-row space-x-6"
                  >
                    {letters.map((letter: Letter, index: number) => (
                      <LetterCard
                        key={index}
                        letter={letter}
                        index={index}
                        isCorrect={isCorrect}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
        <div className="w-1/4 flex flex-col">
          <div className="flex flex-col overflow-scroll">
            <span className="text-center text-2xl mt-3 text-amber-700">
              Score
            </span>
            <div className="flex flex-col space-y-2 overflow-auto h-full">
              {playerScores?.map((player, index) => (
                <span className="text-2xl text-blue-600" key={index}>
                  {player.username} :{player.score}
                </span>
              ))}
            </div>

            <div className="flex flex-col">
              <span className="text-center text-2xl mt-3 text-amber-700">
                Events
              </span>
              <div className="flex flex-col">
                {gameEvents?.map((event, index) => (
                  <span
                    key={index}
                    className={`text-center font-serif ${eventClassName(
                      event
                    )}`}
                  >
                    {event.content}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
