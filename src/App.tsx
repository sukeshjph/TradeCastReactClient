import { CastStream } from "./components/CastStream";
import { CastDetails } from "./components/CastDetails";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Cast } from "./model";

export interface castState {
  allCasts: Cast[];
  currentCast?: Cast;
}

type contextType = {
  localCastState: castState;
  setLocalCastState: Dispatch<SetStateAction<castState>>;
};
export const CastContext = createContext<contextType>({} as contextType);

const App = () => {
  const [localCastState, setLocalCastState] = useState<castState>({
    allCasts: [],
    currentCast: undefined,
  });
  return (
    <div className="App">
      <CastContext.Provider value={{ localCastState, setLocalCastState }}>
        <CastDetails/>
        <CastStream />
      </CastContext.Provider>
    </div>
  );
};

export default App;
