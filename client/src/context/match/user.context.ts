import React from 'react';
import { initialState } from './user.reducer';
import { State } from './user.type';

const DEFAULT_VALUE: State = {
    ...initialState,
};

const RoomContext = React.createContext(DEFAULT_VALUE);
export default RoomContext;

export const useRoomContext = () => {
    return React.useContext(RoomContext);
};
