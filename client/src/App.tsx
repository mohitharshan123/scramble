import Main from "./components/Main";

import { ScoresProvider } from "./contexts/score";

const App = () => {
  return (
    <ScoresProvider>
      <Main />
    </ScoresProvider>
  );
};

export default App;
