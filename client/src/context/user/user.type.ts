export interface IUser {
    id: string;
    username: string;
    name: string;
    trophies: string;
    coins: string;
    avatar: string;
}

export interface IPlayer {
    player_id: number;
    player_name: string;
    player_username: string;
    player_trophies: number;
    player_avatar: number;
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
    onlinePlayers: IPlayer[];
    errorMsg: string;
    loading: boolean;
    leaderboard: IPlayer[];


    createUser: (values: { username: string; name: string; password: string }) => void;
    login: (values: { username: string; password: string }) => void;
    updateUser: (values: { username: string; name: string; avatar: string; id: string; }) => void;
    logout: (userId: string) => void;
    deleteUser: ( id: string ) => void;
    userProfile: (id: string ) => void;
    setLoading: () => void;
    getOnlinePlayers: () => void;
    setUserOnline: () => void;
    updateUserAvatar: (avatarId: string) => void;
    getLeaderboard: () => void;

}


export interface Action {
    payload?: any;
    type: string;
}
