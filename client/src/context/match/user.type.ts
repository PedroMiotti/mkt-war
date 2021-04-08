export interface IUser {
    username: string;
    socketID: string;
    _id: string;
}


export interface IRoom {
    _id: string;
    roomName: string;
    activeUsers: IUser[];

}

export interface State {
    _id: string;
    currentUser: string;
    activeUsers: IUser[];
    roomLoaded: boolean | null;
    loading: boolean;

    createRoom: (values: { username: string; roomName: string }) => void;
    joinRoom: (values: { username: string; roomID: string }) => void;

    setRoomUser: (username: string) => void;
    setLoading: (roomID: string) => void;
    leaveRoom: () => void;
}

export interface Action {
    payload?: any;
    type: string;
}
