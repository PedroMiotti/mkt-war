import {
    CREATE_ROOM,
    JOIN_ROOM,
    SET_CURRENT_USER,
    SET_LOADING,
    LEAVE_ROOM,
} from '../types';
import { Action, State } from './user.type';

export const initialState: State = {
    _id: '',
    currentUser: '',
    activeUsers: [],
    roomLoaded: null, // checks if room is loaded or not for route handling
    loading: false,

    createRoom: () => null,
    joinRoom: () => null,

    setRoomUser: () => null,
    setLoading: () => null,
    leaveRoom: () => null,
};

//reducer
export default function roomReducer(state: State = initialState, action: Action) {
    const { type, payload } = action;

    switch (type) {
        case CREATE_ROOM:
        case JOIN_ROOM:
            return {
                ...state,
                _id: payload._id,
                activeUsers: payload.activeUsers,
                roomLoaded: true,
            };

        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: payload,
            };

        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };

        case LEAVE_ROOM:
            return {
                ...state,
                _id: '',
                currentUser: '',
                activeUsers: [],
                roomLoaded: null,
                loading: false,
            };

        default:
            return state;
    }
}
