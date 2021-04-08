import React from 'react';

import { initialState } from './user.reducer';
import { State } from './user.type';

const DEFAULT_VALUE: State = {
    ...initialState,
};

const UserContext = React.createContext(DEFAULT_VALUE);
export default UserContext;

export const useUserContext = () => {
    return React.useContext(UserContext);
};
