import { ScoreActionTypes, UserInfo } from "../types";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { scoreReducer } from "../reducers/score";

type ScoresProviderProps = { children: React.ReactNode };

const ScoresStateContext = createContext<
  { state: Array<UserInfo>; dispatch: Dispatch<ScoreActionTypes> } | undefined
>(undefined);

const ScoresProvider = ({ children }: ScoresProviderProps) => {
  const [state, dispatch] = useReducer(scoreReducer, []);

  const value = { state, dispatch };
  return (
    <ScoresStateContext.Provider value={value}>
      {children}
    </ScoresStateContext.Provider>
  );
};

function useScores() {
  const context = useContext(ScoresStateContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a ScoresProvider");
  }
  return context;
}

export { ScoresProvider, useScores };
