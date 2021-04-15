import React from "react";
import { initialState } from "./match.reducer";
import { State } from "./match.type";

const DEFAULT_VALUE: State = {
  ...initialState,
};

const MatchContext = React.createContext(DEFAULT_VALUE);
export default MatchContext;

export const useMatchContext = () => {
  return React.useContext(MatchContext);
};
