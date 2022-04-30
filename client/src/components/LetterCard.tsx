import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { LetterCardProps } from "../types";

const LetterCard = ({ letter, index, isCorrect }: LetterCardProps) => {
  return (
    <Draggable
      key={`letter-${index}`}
      draggableId={`letter-${index}`}
      index={index}
    >
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
          className={`p-10 bg-white drop-shadow-md outline outline-4 ${
            isCorrect ? "outline-green-400" : "outline-pink-500"
          }  hover:drop-shadow-lg rounded-md text-2xl
      `}
        >
          {letter.content}
        </div>
      )}
    </Draggable>
  );
};

export default LetterCard;
