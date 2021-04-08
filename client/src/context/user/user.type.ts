export interface IUser {
    id: string;
    socketID: string;
    username: string;
    name: string;
    trophies: string;
    coins: string;
    avatar: string;
}

export interface State {
    id: string;
    isLoggedIn: boolean;
    socketID: string;
    name: string;
    username: string;
    trophies: string;
    coins: string;
    avatar: string;
    errorMsg: string;
    loading: boolean;

    createUser: (values: { username: string; name: string; password: string }) => void;
    login: (values: { username: string; password: string }) => void;
    updateUser: (values: { username: string; name: string; avatar: string; id: string; }) => void;
    logout: () => void;
    deleteUser: ( id: string ) => void;
    userProfile: (id: string ) => void;

    setLoading: () => void;
}

export interface Action {
    payload?: any;
    type: string;
}
